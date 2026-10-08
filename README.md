# GROZ E-commerce Website — v7 cart & payment verification update

This update keeps the existing GROZ design/features and adds only the requested cart/order/payment improvements.

## Cart & quantity
- Multiple products can be selected together from the Cart.
- **Order Selected** sends only checked items to Pay & Buy.
- **Order All** sends the entire cart together.
- Each product quantity uses buttons instead of requiring typing.
- Quantity supports **−10, −1, +1, +10**, capped from 1 to 99.
- Cart totals update automatically.
- Pay & Buy receives every selected item name, unit price, quantity and line total, plus the grand total.
- The order information sent to WhatsApp contains the complete multi-item list.

## Online payment verification
A transaction ID typed by itself cannot prove that a payment is real, completed, received by GROZ, or not expired. The browser therefore no longer treats any transaction ID as automatically valid.

For online payment methods, Pay & Buy calls:

`POST /api/payment/verify`

The server rejects the order unless the configured official payment-provider verifier confirms:
- transaction is valid and successful/completed
- transaction amount exactly matches the cart total
- receiver matches the selected GROZ payment number
- transaction ID has not already been accepted

If the provider reports an expired/failed/wrong/incomplete transaction, the order is blocked and is **not sent to WhatsApp**.

### Important API requirement
Real-time expiry/status checking requires the official merchant/payment API credentials for bKash, Nagad, Upay and/or Rocket. Those credentials were not supplied, so this package intentionally does **not** pretend that a transaction ID is valid.

Configure the server using the instructions in `server/README.md`. Until an official verifier is configured, online orders are blocked safely; Cash on Delivery continues to work.

## WhatsApp
The website uses the server endpoint `/api/whatsapp/order` when WhatsApp Cloud API credentials are configured. Otherwise it falls back to opening the GROZ WhatsApp chat link.

Never put WhatsApp tokens or payment API credentials in frontend HTML/JS.
