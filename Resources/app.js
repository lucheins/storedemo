/*
 * Open top-level UI component (AppTabGroup) based os name
 */
(function() {
	var 
		AppTabGroup = require('ui/AppTabGroup'),
		config = require('data/Config'),
		util = require('core/Util'),
		App;

		// Get Configuration Data
		var config = require('data/Config');

		//Using a local Product file
		Ti.include("data/SampleProducts.js");
		App = new AppTabGroup(ProductData);
		
		//Using a remote Product file
		//App = new AppTabGroup(config.PRODUCT_LIST_URL);

	// Open Main App Window
	if (util.osname === 'iphone' || util.osname === 'ipad') {
		App.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP });
	}
	else{
		App.open();
	}
})();