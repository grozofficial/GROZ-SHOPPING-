# GROZ server integrations

The static storefront now requires server verification before an online payment order can be sent to WhatsApp.

## WhatsApp Cloud API
Set:
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- optional `WHATSAPP_API_VERSION` (defaults to `v23.0`)

The browser calls `/api/whatsapp/order`; the token never appears in frontend files.

## Payment verification
A transaction ID by itself cannot prove that money was actually received or that a transaction has not expired. The `/api/payment/verify` endpoint therefore **rejects online orders unless an official payment-provider verifier is configured and returns a successful normalized result**.

Configure either a common endpoint:
- `PAYMENT_VERIFY_URL`
- optional `PAYMENT_VERIFY_TOKEN`

or provider-specific endpoints/tokens:
- `PAYMENT_VERIFY_URL_BKASH` / `PAYMENT_VERIFY_TOKEN_BKASH`
- `PAYMENT_VERIFY_URL_NAGAD` / `PAYMENT_VERIFY_TOKEN_NAGAD`
- `PAYMENT_VERIFY_URL_UPAY` / `PAYMENT_VERIFY_TOKEN_UPAY`
- `PAYMENT_VERIFY_URL_ROCKET` / `PAYMENT_VERIFY_TOKEN_ROCKET`

The configured verifier should return JSON in this normalized shape:
```json
{"valid":true,"status":"COMPLETED","amount":1490,"receiver":"01604985164"}
```
Accepted success statuses are `COMPLETED`, `SUCCESS`, `PAID`, and `SETTLED`.

The server also rejects a transaction ID that has already been accepted, which helps prevent replaying the same payment against multiple orders.

**Important:** Do not put provider API keys or WhatsApp tokens in `js/app.js` or any HTML file. You need the official merchant/payment-provider API credentials for real-time expiry/status checking. Without those credentials the site intentionally blocks online-payment orders instead of falsely treating any transaction ID as valid.
