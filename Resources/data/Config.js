// get util library
var Util        = require('core/Util'),
	viewscrollr = require("core/ViewScrollrPro");

Util.mixin(exports, {

	// Default thumb image
	PRODUCTS_DEFAULT_THUMB_IMAGE : "<<IMAGE PATH>>",

	// Default main image
	PRODUCTS_DEFAULT_MAIN_IMAGE : "<<IMAGE PATH>>",

	// Default spotlight image
	PRODUCTS_DEFAULT_SPOTLIGHT_IMAGE : "<<IMAGE PATH>>",

	// Info screens (titles & webview urls)
	INFO_SCREENS : [
		{
			TITLE : "About Us",
			URL   : "http://Mode54.com"
		},
		{
			TITLE : "Our Blog",
			URL   : "http://mode54.com/blog"
		}
	],

	// URL for product list on your server
	PRODUCT_LIST_URL : "http://your-site.com/path/to/file/SampleProducts.js'",

	// PayPal App ID Issued by PayPal
	PAYPAL_APP_ID : "APP-80W284485P519543T",// Use "APP-80W284485P519543T" for sandbox testing,

	// PayPal payment recipient email (so you get paid)
	PAYPAL_RECIPIENT : "<<RECIPIENT EMAIL>>",

	// PayPal transaction type (HARD_GOODS, SERVICE or PERSONAL)
	PAYPAL_TRANSACTION_TYPE : "SERVICE",

	// PayPal payment environment (LIVE, SANDBOX or NONE)
	PAYPAL_ENVIRONMENT : "SANDBOX",

	// Whether or not to select/send PayPal shipping information
	PAYPAL_ENABLE_SHIPPING : false,

	// PayPal payment type (Causes the button's text to change from "Pay" to "Donate")
	PAYPAL_PAYMENT_TYPE : "PAY",

	// Your Instant Payment Notification URL. This will be hit by Paypal server on completion of payment.
	PAYPAL_IPN_URL : "",

	// PayPal currency type
	PAYPAL_CURRENCY_TYPE : "USD",

	// Merchant Name used in PayPal transaction (default to app name)
	MERCHANT_NAME : Ti.App.name,

	// Successful Payment Message
	PAYMENT_SUCCESS_MESSAGE : {
		TITLE   : "Payment successful!",
		MESSAGE : "Thank You for your purchase!"
	},

	// Enable spotlight component auto scrolling
	SPOTLIGHT_AUTO_SCROLL : true,

	// Background Image for the Spotlight section (not required)
	SPOTLIGHT_BG_IMAGE : null,

	// Background Color for the Spotlight component
	SPOTLIGHT_NAV_STYLE : viewscrollr.NAV_STYLE.CIRCLE,

	// Color of current page in Spotlight navigation
	SPOTLIGHT_NAV_SELECTED_COLOR : "#000",

	// Color of Spotlight navigation page indicators
	SPOTLIGHT_NAV_COLOR : "#ddd",

	// Add border to Spotlight navigation page indicators
	SPOTLIGHT_NAV_SHOW_BORDER : true,

	// Color of border on Spotlight navigation page indicators
	SPOTLIGHT_NAV_BORDER_COLOR : "#000",

	// Background color of Spotlight navigation
	SPOTLIGHT_NAV_BACKGROUND_COLOR : "transparent",

	// Opacity setting for Spotlight navigation background
	SPOTLIGHT_NAV_OPACITY : 0.5,

	// Position Spotlight navigation to top or bottom
	SPOTLIGHT_NAV_ONTOP : false,

	// Background Color for the Spotlight component
	SPOTLIGHT_BG_COLOR : "#000",

	// Height of Spotlight component
	SPOTLIGHT_HEIGHT : "210dp"
});