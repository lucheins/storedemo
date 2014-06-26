
var 
	// get util library
	util = require('core/Util'),

	// get product manager
	ProductManager = require('core/ProductManager');

// Get Configuration Data
var config = require('data/Config');

function ProductListWindow() {
	var Window = Ti.UI.createWindow({
			title        : L("products"),
			barColor     : "#000",
			navBarHidden : false
		}),
		Table  = Ti.UI.createTableView({
			width           : Ti.UI.FILL,
			height          : Ti.UI.FILL,
			backgroundColor : "#fff"
		});

	// get product manager
	var products      = require('core/ProductManager'),
		productEvents = products.events;

	// assemble UI
	Window.add(Table);

	/*
	 * Product row factory method
	 *
	 * @param {String} name: the product name to display
	 * @param {String} image: the icon image to display
	 * @param {String} desc: description of item to display in row
	 * @param {String} itemId: item id used to load product page
	 */
	function createRow(name, image, desc, itemId){
		var row = Ti.UI.createTableViewRow({
				className : "product_rows",
				backgroundColor : "#fff"

			}),
			img  = Ti.UI.createImageView({
				image        : image,
				left         : 1,
				top          : 1,
				borderWidth  : 3,
				borderColor  : "#fff",
				defaultImage : config.PRODUCTS_DEFAULT_THUMB_IMAGE
			}),
			bodyView = Ti.UI.createView({
				layout : 'vertical'
			}),
			title = Ti.UI.createLabel({
				text            : name,
				minimumFontSize : 12,
				color           : "#000",
				height          : Ti.UI.SIZE,
				left            : 2,
				top             : 4,
				font : {
					fontSize   : 14,
					fontWeight : "bold"
				}
			}),
			body = Ti.UI.createLabel({
				text   : desc,
				height : Ti.UI.SIZE,
				left   : 2,
				top    : 2,
				color  : "#000",
				font : {
					fontSize : 12
				}
			});

		// assemble row
		bodyView.add(title);
		bodyView.add(body);
		row.add(img);

		if(util.osname==='android'){
			img.width       = "81dip";
			bodyView.left   = "82dip";
			bodyView.right  = "3dip";
			bodyView.top    = 0;
			bodyView.bottom = 0;
			body.height     = Ti.UI.SIZE;
		}
		else{
			img.width       = 81;
			bodyView.left   = 82;
			bodyView.height = Ti.UI.SIZE;
		}

		row.add(bodyView);

		// handle featured item click event
		row.addEventListener(
			"click",
			function(e){
				Ti.App.fireEvent(
					"APP:SHOW_PRODUCT",
					{ "itemId" : itemId, "tab" : "Products" }
				);
			}
		);

		return row;
	}

	/*
	 * Product group factory method
	 * 
	 * @param {String} name: the name of the group/section
	 * @param {Array} products: array of products for this group/section
	 */
	function createProductGroup(name, products){
		var productGroup = Ti.UI.createTableViewSection({
			headerTitle     : name,
			backgroundColor : "#F5785A"
		});
		for(var i=0,l=products.length;i<l;i++){
			productGroup.add(
				createRow(
					products[i].name,
					products[i].imgs.thumb,
					products[i].desc.short,
					products[i].id
				)
			);
		}
		return productGroup;
	}

	/*
	 * Assemble product groups for table view
	 *
	 * @param {Object} groups: the groups object containing product arrays for each group/section
	 */
	function displayProducts(){
		var data = [],
			groups = require('core/ProductManager').getProductGroup("__ALL__");
		for(var key in groups){
			data.push(
				createProductGroup(
					key,
					groups[key]
				)
			);
		}
		Table.setData(data);
	}

	Window.addEventListener(
		"focus",
		displayProducts
	);

	return Window;
};

module.exports = ProductListWindow;