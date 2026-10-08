# Optional WhatsApp Cloud API relay

The storefront uses the official WhatsApp click-to-chat URL by default:
`https://wa.me/8801604985164`

For automated WhatsApp Cloud API sending, deploy the optional server and keep credentials on the server only. Never put a Meta access token in browser JavaScript.

Required environment variables:
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_API_VERSION` (example: `v23.0`)

You must obtain these from Meta WhatsApp Business Platform and configure the phone number in your own WABA. This template intentionally does not contain credentials.
