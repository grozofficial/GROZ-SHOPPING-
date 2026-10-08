# GROZ E-commerce Website — v2

Updated according to the latest GROZ requirements.

### New changes
- Homepage big logo artwork removed from the hero.
- Two supplied photos are used in a full-frame homepage slideshow.
- Slides automatically change every 5 seconds with a fade transition.
- Hero images fill the frame with dark cinematic overlays.
- Small unique GROZ copy sits at the bottom of each frame.
- Red blended glow/accent runs along the bottom of the hero.
- Payment confirmation moved out of Buy Now/Checkout.
- Buy Now now collects product + customer + delivery details only.
- Continue to Payment stores those details and opens the Payment page.
- Payment page has bKash, Nagad, Upay, Rocket and COD selection.
- Selecting an online payment app immediately shows its GROZ number underneath the payment method.
- Copy Number button copies the currently selected number.
- COD hides/disables the transaction ID requirement.
- Online payments require transaction ID + confirmation checkbox.
- Final order details are sent to GROZ WhatsApp.

### Supplied homepage images
- assets/hero-01.jpg
- assets/hero-02.jpg

Replace these two files with your actual product/brand photos later and keep the same filenames for the slideshow to work automatically.

### Payment verification
This is a front-end/manual confirmation workflow. It does not automatically verify bKash/Nagad/Upay/Rocket transactions. The submitted transaction ID is sent to WhatsApp for manual confirmation.


### Homepage slideshow v3
The homepage uses the eight latest supplied GROZ images in `assets/hero/`. Each image fills the hero frame and fades to the next image every 5 seconds. The slideshow has a dark cinematic overlay, red bottom blend and small editorial copy.

## GROZ Settings Upgrade

The header now includes a red-outlined gear **Settings** icon on every page. It provides:
- **Dark** theme (original GROZ look)
- **White** theme
- **Bright** high-contrast light theme with the GROZ red accent preserved
- **English** and **বাংলা** language options

Theme and language choices are saved in the browser with `localStorage` and persist while moving between pages.

## v5 checkout update
- The Buy Now page is now a combined **Pay & Buy Now** flow.
- Payment method is shown at the top; product/order details are below it.
- bKash/Nagad/Upay/Rocket number appears under the selected method with a copy button.
- Cash on Delivery disables the transaction-ID field.
- Unit price × quantity automatically calculates the order amount.
- Orders are sent directly to the GROZ WhatsApp number after required details are completed.


## v6 Cart
Shop cards now include quantity controls and Add to Cart. The cart is stored in localStorage and available from the header cart icon. The standalone Payment page has been removed; payment and order details are completed together on Pay & Buy.
