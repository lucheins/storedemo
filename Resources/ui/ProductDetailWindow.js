
var 
	// get configuration data
	config = require('data/Config'),

	// get util library
	util = require('core/Util'),

	// get cart manager
	CartManager = require('core/CartManager');

/*
 * Create product options modal (Android)
 *
 * @param {Object} productObj: product object from ProductManager
 */
exports.create = function(productObj) {
	var ProductDetail = Ti.UI.createWindow({
			title        : L("details"),
			navBarHidden : false,
			barColor     : "#000",
			layout       : "vertical"
		}),
		top = Ti.UI.createView({
			height          : 115,
			width           : Ti.UI.FILL,
			borderColor     : "#ccc",
			borderWidth     : 1,
			backgroundColor : "#fff"
		}),
		bottom = Ti.UI.createView({
			height          : Ti.UI.FILL,
			width           : Ti.UI.FILL,
			backgroundColor : "#fff",
			layout          : "vertical"
		}),
		img  = Ti.UI.createImageView({
			image        : productObj.imgs.main,
			defaultImage : config.PRODUCTS_DEFAULT_MAIN_IMAGE,
			height       : 100,
			left         : 1,
			width        : 140,
			top          : 1,
			borderWidth  : 3,
			borderColor  : "#fff"
		}),
		name = Ti.UI.createLabel({
			text   : productObj.name,
			width  : 170,
			height : 50,
			top    : 3,
			left   : 151,
			color  : '#000',
			font   : {
				fontSize   : 16,
				fontWeight : "normal"
			}
		}),
		price = Ti.UI.createLabel({
			text   : "$" + productObj.price,
			width  : 100,
			height : 20,
			top    : 50,
			left   : 151,
			color  : "#00c",
			font   : {
				fontSize   : 16,
				fontWeight : "bold"
			}
		}),
		info = Ti.UI.createWebView({
			visible : false,
			height  : Ti.UI.FILL,
			width   : Ti.UI.FILL,
			html    : [
				"<htm><head><style>body{margin:5px;padding:0}body,p,strong",
				"{font-family:helvetica;font-size:12px}</style></head><body>",
				productObj.desc.long,
				"</body></html>"
			].join("")
		});

	if(util.osname==='android'){
		var buyButton = Ti.UI.createButton({
			title                   : L("addToCart"),
			backgroundColor         : "#063",
			color                   : "#fff",
			backgroundSelectedColor : "#F5785A",
			height                  : 30,
			width                   : Ti.UI.SIZE,
			top                     : 75,
			left                    : 145
		});
	}
	else{
		var buyButton = Ti.UI.createButtonBar({
			labels          : [ L("addToCart") ],
			backgroundColor : "#063",
			style           : Ti.UI.iPhone.SystemButtonStyle.BAR,
			height          : 30,
			width           : Ti.UI.SIZE
		});
	}

	// assemble UI
	top.add(img);
	top.add(name);
	top.add(price);
	ProductDetail.add(top);
	ProductDetail.add(bottom);

	if(util.osname==='android'){
		top.add(buyButton);
	}
	else{
		ProductDetail.setRightNavButton(buyButton);
	}

	// Add webview to screen and display
	function setInfoHTML(){
		bottom.add(info);
		info.show();
	}

	// Add item to cart or show options modal
	function buyHandler(){
		if(productObj.options){
			require('ui/ProductOptionsWindow').create(productObj).open();
		}
		else{
			CartManager.addItem(productObj.id);
		}
	}

	ProductDetail.addEventListener(
		"focus",
		setInfoHTML
	);

	ProductDetail.addEventListener(
		"blur",
		function(e){
			setTimeout(
				function(){
					ProductDetail.close({animated : false});
				},
				300
			);
		}
	);

	buyButton.addEventListener(
		"click",
		buyHandler
	);

	return ProductDetail;
}
