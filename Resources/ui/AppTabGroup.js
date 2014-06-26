/*
 * AppTabGroup object contains the main ui components in a tab group.
 */
function AppTabGroup(products) {

	var
		// get util library
		util = require('core/Util'),

		// initiate ui components
		TabGroup = Ti.UI.createTabGroup({
			tabsBackgroundColor : "#000"
		}),

		HomeWindow        = new (require('ui/HomeWindow'))(),
		InfoWindow        = new (require('ui/InfoWindow'))(),
		CartWindow        = new (require('ui/CartWindow'))(),
		ProductListWindow = new (require('ui/ProductsListWindow'))(),

		Home     = Ti.UI.createTab({ title : L("home"),     icon : "/images/icons/home.png", window : HomeWindow        }),
		Products = Ti.UI.createTab({ title : L("products"), icon : "/images/icons/tag.png",  window : ProductListWindow }),
		Info     = Ti.UI.createTab({ title : L("info"),     icon : "/images/icons/info.png", window : InfoWindow        }),
		Cart     = Ti.UI.createTab({ title : L("cart"),     icon : "/images/icons/cart.png", window : CartWindow        }),

		// get product manager
		ProductManager  = require('core/ProductManager'),

		// Add CartManager
		CartManager = require('core/CartManager'),

		// get loading indicator
		LoadingIndicator = require('ui/Indicator');

	// assemble StoreApp UI
	TabGroup.addTab(Home);
	TabGroup.addTab(Products);
	TabGroup.addTab(Info);
	TabGroup.addTab(Cart);

	/*
	 * Load products from local data or from server based on param passed in
	 * 
	 * @param {String|Object} data: the json data or url for json data to load
	 */
	function load(data){
		var _callBack = function(productList){
			if(productList){
				ProductManager.setProducts(
					productList,
					function(){
						LoadingIndicator.hide();
					}
				);
			}
		}
		if(typeof data==="string" && util.isURL(data)){ util.fetch(data, _callBack); }
		else if(typeof data==="object" && data.products){ _callBack(data.products); }
		else { return Ti.API.error("Store.load: Invalid url or object"); }
	}

	//Load Store Products when TabGroup is opened
	TabGroup.addEventListener(
		"open",
		function(e){
			LoadingIndicator.show({bottom : "50dip"});
			load(products);
		}
	);

	// show product detail window for different sections
	Ti.App.addEventListener(
		"APP:SHOW_PRODUCT",
		function(e){
			var sourceTab,
				selectedProduct = ProductManager.getProduct(e.itemId);

			if(e.tab=="Home"){
				sourceTab = Home;
			}
			else if(e.tab=="Products"){
				sourceTab = Products;
			}
			else if(e.tab=="Cart"){
				sourceTab = Cart;
			}
			sourceTab.open(
				require('ui/ProductDetailWindow').create(selectedProduct),
				{ animated : true }
			);
		}
	);

	Ti.App.addEventListener(
		"APP:SHOW_INFO_VIEW",
		function(e){
			Info.open(
				require('ui/WebView').create(e.title, e.url),
				{ animated : true }
			);
		}
	);

	Ti.App.addEventListener(
		CartManager.events.change,
		function(e){
			if(!CartManager.hasItems()){
				Cart.badge = null;
			}
			else{
				Cart.badge = CartManager.getItemCount();
			}
		}
	);

	return TabGroup;
};

module.exports = AppTabGroup;