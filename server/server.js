import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const app=express();
app.use(express.json({limit:'50kb'}));
const port=process.env.PORT||3000;
const RECEIVERS={bKash:'01604985164',Nagad:'01814026318',Upay:'01814026318',Rocket:'01604985164'};
const LEDGER=path.join(process.cwd(),'transaction-ledger.json');

async function readLedger(){try{return JSON.parse(await fs.readFile(LEDGER,'utf8'));}catch{return {};}}
async function writeLedger(data){await fs.writeFile(LEDGER,JSON.stringify(data,null,2),'utf8');}

// WhatsApp Cloud API relay. Credentials stay server-side.
app.post('/api/whatsapp/order',async(req,res)=>{
  try{
    const {WHATSAPP_TOKEN,WHATSAPP_PHONE_NUMBER_ID,WHATSAPP_API_VERSION='v23.0'}=process.env;
    if(!WHATSAPP_TOKEN||!WHATSAPP_PHONE_NUMBER_ID) return res.status(503).json({ok:false,error:'WhatsApp Cloud API is not configured on the server.'});
    const to=String(req.body?.to||'8801604985164').replace(/\D/g,'');
    const message=String(req.body?.message||'');
    if(!message) return res.status(400).json({ok:false,error:'message is required'});
    const r=await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,{method:'POST',headers:{Authorization:`Bearer ${WHATSAPP_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to,type:'text',text:{body:message}})});
    const data=await r.json();
    res.status(r.ok?200:502).json({ok:r.ok,data});
  }catch(err){res.status(500).json({ok:false,error:err.message});}
});

// Payment verification gateway. An online order is NOT accepted unless the
// configured provider verifier confirms the transaction as successful.
// Set PAYMENT_VERIFY_URL_BKASH / _NAGAD / _UPAY / _ROCKET (or the common
// PAYMENT_VERIFY_URL) to your official provider verification endpoint.
app.post('/api/payment/verify',async(req,res)=>{
  try{
    const method=String(req.body?.method||'');
    const transactionId=String(req.body?.transactionId||'').trim();
    const amount=Number(req.body?.amount||0);
    const receiver=String(req.body?.receiver||RECEIVERS[method]||'');
    if(!RECEIVERS[method]||!transactionId||!Number.isFinite(amount)||amount<=0) return res.status(400).json({valid:false,error:'Invalid payment verification request.'});

    const ledger=await readLedger();
    const key=`${method}:${transactionId.toUpperCase()}`;
    if(ledger[key]) return res.status(409).json({valid:false,error:'This transaction ID has already been submitted.'});

    const suffix=method.toUpperCase();
    const url=process.env[`PAYMENT_VERIFY_URL_${suffix}`]||process.env.PAYMENT_VERIFY_URL;
    const token=process.env[`PAYMENT_VERIFY_TOKEN_${suffix}`]||process.env.PAYMENT_VERIFY_TOKEN;
    if(!url) return res.status(503).json({valid:false,error:'Online payment verification is not configured. Configure the official payment provider API before accepting online orders.'});

    const headers={'Content-Type':'application/json'};
    if(token) headers.Authorization=`Bearer ${token}`;
    const provider=await fetch(url,{method:'POST',headers,body:JSON.stringify({method,transactionId,amount,receiver})});
    const result=await provider.json().catch(()=>({}));
    if(!provider.ok) return res.status(502).json({valid:false,error:'Payment provider verification failed.'});

    // Expected normalized provider response:
    // { valid:true, status:'COMPLETED'|'SUCCESS', amount:<number>, receiver:<number> }
    const status=String(result.status||'').toUpperCase();
    const verifiedAmount=Number(result.amount);
    const verifiedReceiver=String(result.receiver||result.recipient||receiver).replace(/\D/g,'');
    const valid=result.valid===true && ['COMPLETED','SUCCESS','PAID','SETTLED'].includes(status) && Number.isFinite(verifiedAmount) && Math.abs(verifiedAmount-amount)<0.01 && verifiedReceiver===receiver.replace(/\D/g,'');
    if(!valid) return res.status(422).json({valid:false,error:'Transaction is invalid, expired, incomplete, wrong amount, wrong receiver, or not confirmed by the provider.'});

    ledger[key]={method,transactionId,amount,receiver,verifiedAt:new Date().toISOString()};
    await writeLedger(ledger);
    return res.json({valid:true,status:'VERIFIED'});
  }catch(err){return res.status(500).json({valid:false,error:'Payment verification service error.'});}
});

app.listen(port,()=>console.log(`GROZ server listening on ${port}`));
