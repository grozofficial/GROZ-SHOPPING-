import express from 'express';
const app=express(); app.use(express.json());
const port=process.env.PORT||3000;
app.post('/api/whatsapp/order',async(req,res)=>{
  const {WHATSAPP_TOKEN,WHATSAPP_PHONE_NUMBER_ID,WHATSAPP_API_VERSION='v23.0'}=process.env;
  if(!WHATSAPP_TOKEN||!WHATSAPP_PHONE_NUMBER_ID) return res.status(503).json({ok:false,error:'WhatsApp Cloud API is not configured on the server.'});
  const to=String(req.body?.to||'8801604985164').replace(/\D/g,'');
  const message=String(req.body?.message||'');
  if(!message) return res.status(400).json({ok:false,error:'message is required'});
  const r=await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,{method:'POST',headers:{'Authorization':`Bearer ${WHATSAPP_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to,type:'text',text:{body:message}})});
  const data=await r.json(); res.status(r.ok?200:502).json({ok:r.ok,data});
});
app.listen(port,()=>console.log(`GROZ WhatsApp relay listening on ${port}`));
