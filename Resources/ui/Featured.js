
var 
	// get util library
	util = require('core/Util'),

	// Get Configuration Data
	config = require('data/Config');

function Featured(options){
	var self = Ti.UI.createTableView({
			width  : Ti.UI.FILL,
			height : options.height || null
		});

	return {
		get : function(){
			return self;
		},
		/*
		 * Featured row factory method
		 *
		 * @param {String} name: the product name to display
		 * @param {String} image: the icon image to display
		 * @param {String} desc: description of item to display in row
		 * @param {String} itemId: item id used to load product page
		 */
		createRow : function(name, image, desc, itemId){
			var row = Ti.UI.createTableViewRow({
					className : "featured_rows",
					backgroundColor : "#fff",
					hasChild  : true
				}),
				img = Ti.UI.createImageView({
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
					font            : {
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
					font   : {
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
				bodyView.bottom = 2;
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
						{ "itemId" : itemId, "tab" : "Home" }
					);
				}
			);

			return row;
		}
	}
}

exports.create = function(options){
	return Featured(options);
};

