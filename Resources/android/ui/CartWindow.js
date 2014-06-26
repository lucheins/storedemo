function CartWindow() {
	var CartWindow = Ti.UI.createWindow({
			title           : L("cart"),
			navBarHidden    : false,
			barColor        : '#000000',
			backgroundColor : "#cbd2d8"
		}),
		checkoutButton = Ti.UI.createButton({
			title                   : L("checkout"),
			backgroundColor         : "#063",
			color                   : "#fff",
			backgroundSelectedColor : "#F5785A",
			backgroundDisabledColor : "#666",
			width                   : Ti.UI.SIZE,
			height                  : 30,
			left                    : 10,
			enabled                 : false
		}),
		table = Ti.UI.createTableView({
			allowsSelection : false,
			editable        : true,
			width           : Ti.UI.FILL,
			backgroundColor : '#fff',
			bottom          : 44,
			top             : 0
		}),
		emptyCartRow = Ti.UI.createTableViewRow({
			className : "empty_cart",
			height    : Ti.UI.SIZE
		}),
		emptyCartLbl = Ti.UI.createLabel({
			text      : L("yourCartIsEmpty"),
			textAlign : "center",
			color     : "#000",
			height    : 26,
			font      : {
				fontSize   : 16,
				fontWeight : "bold"
			}
		}),
		subTotalView = Ti.UI.createView({
			width  : Ti.UI.FILL,
			height : 44,
			bottom : 0
		}),
		subTotalLbl = Ti.UI.createLabel({
			text      : L("subtotal") + ": ",
			textAlign : "right",
			height    : 44,
			color     : "#000",
			width     : Ti.UI.SIZE,
			right     : 95,
			font      : {
				fontSize   : 16,
				fontWeight : "normal"
			}
		}),
		subTotalAmountLbl = Ti.UI.createLabel({
			text       : "$0.00",
			width      : 80,
			height     : 44,
			right      : 10,
			textAlign  : "left",
			color      : "#00c",
			font       : {
				fontSize   : 16,
				fontWeight : "bold"
			}
		});

	// Add CartManager
	var CartManager = require('core/CartManager');
	
	// Add ProductManager
	var ProductManager = require('core/ProductManager');

	// Cart Data (as table row components) and other vars
	var CartItems = [emptyCartRow];

	// get loading indicator
	var LoadingIndicator = require('ui/Indicator');

	// Assemble Cart UI
	subTotalView.add(checkoutButton);
	subTotalView.add(subTotalLbl);
	subTotalView.add(subTotalAmountLbl);
	emptyCartRow.add(emptyCartLbl);
	CartWindow.add(table);
	CartWindow.add(subTotalView);

	/*
	 * check if cart contains any items
	 *
	 * @return {Boolean}
	 */
	CartWindow.hasItems = function(){
		return CartManager.hasItems();
	};

	/*
	 * add an item to the cart
	 *
	 * @param {String} id: unique id of product to add to cart
	 */
	CartWindow.addItem = function(id, options){
		CartManager.addItem(id, options);
	};

	/*
	 * remove an item from the cart
	 *
	 * @param {String} id: unique id of product to remove from cart
	 */
	CartWindow.removeItem = function(id, options){
		CartManager.removeItem(id, options);
	};

	/*
	 * Empty Cart
	 */
	CartWindow.empty = function(){
		subTotalAmountLbl.text = "$0.00";
		CartItems = [emptyCartRow];
		enableCheckout(false);
		table.allowsSelection = false;
		if(table.editing == true){
			table.editing = false;
		}
		table.setData(CartItems);
		CartManager.empty();
	};

	/*
	 * Populate Cart table
	 */
	function setCartTable(){
		var cartData  = CartManager.getRawCartData(),
			tableRows = [],
			i         = 0,
			len       = cartData.length,
			product;

		for(; i<len; i++){
			product = ProductManager.getProduct(cartData[i].id);
			tableRows.push(createRow(product, cartData[i].options, cartData[i].quantity));
		}
		if(CartManager.hasItems()){
		    enableCheckout(true);
			table.allowsSelection = true;
			table.setData(tableRows);
			CartItems = tableRows;
		}
		else{
			CartWindow.empty();
		}

	}

	/*
	 * Build a Cart row
	 *
	 * @param {Object} product: product object from ProductManager
	 * @param {String} options: options selected for item
	 * @param {Number} quantity: quantity of item
	 */
	function createRow(product, options, quantity){
		var row  = Ti.UI.createTableViewRow({
				backgroundColor : '#fff',
				hasChild        : true,
				layout          : 'horizontal'
			}),
			bodyView = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width  : Ti.UI.FILL
			}),
			img  = Ti.UI.createImageView({
				image  : product.imgs.thumb,
				height : 40,
				left   : 3,
				width  : 60,
				top    : 3
			}),
			title = Ti.UI.createLabel({
				text            : product.name,
				minimumFontSize : 13,
				right           : 3,
				height          : Ti.UI.SIZE,
				color           : "#000",
				left            : 65,
				top             : 4,
				font            : {
					fontSize   : 14,
					fontWeight : "bold"
				}
			}),
			optionsList = Ti.UI.createLabel({
				color  : "#5C5C5C",
				left   : 28,
				height : Ti.UI.SIZE,
				right  : 3,
				top    : 42,
				left   : 65,
				text   : "",
				font   : {
					fontSize   : 11,
					fontWeight : "normal"
				}
			}),
			price = Ti.UI.createLabel({
				text   : "$" + product.price,
				width  : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				left   : 65,
				top    : 22,
				color  : "#00c",
				font   : {
					fontSize   : 12,
					fontWeight : "bold"
				}
			}),
			qty = Ti.UI.createLabel({
				text   : "Qty: " + (quantity || 1),
				width  : Ti.UI.SIZE,
				height : Ti.UI.SIZE,
				left   : 125,
				color  : "#000",
				top    : 22,
				font   : {
					fontSize   : 12,
					fontWeight : "normal"
				}
			}),
			touchTracker;

		bodyView.add(img);
		bodyView.add(title);
		bodyView.add(price);
		bodyView.add(qty);

		row.id       = product.id;
		row.quantity = quantity || 1;
		row.qtyLbl   = qty;
		row.price    = product.price;
		row.name     = product.name;
		row.options  = options;

		if(options!==""){
			optionsList.text = options;
			bodyView.add(optionsList);
			row.options = options;
		}

		row.add(bodyView);

		// Bind row events
		row.addEventListener(
			"click",
			function(e){
				Ti.App.fireEvent(
					"APP:SHOW_PRODUCT",
					{ "itemId" : product.id, "tab" : "Cart" }
				);
			}
		);

		row.addEventListener(
			"touchstart",
			function(e){
				touchTracker = setTimeout(
					function(){
						e.cancelBubble = true;
						showContextMenu(row);
					},
					1010
				);
			}
		);

		row.addEventListener(
			"touchend",
			function(e){
				if(touchTracker){
					clearTimeout(touchTracker);
				}
			}
		);

		row.addEventListener(
			"touchcancel",
			function(e){
				if(touchTracker){
					clearTimeout(touchTracker);
				}
			}
		);

		return row;
	}

	/*
	 * Show contextual delete dialog
	 *
	 * @param {Object} tiObj: product object from ProductManager
	 */
	function showContextMenu(tiObj){
		var dialog = Ti.UI.createAlertDialog({
			buttonNames : [L("delete"), L("cancel")],
			message     : L("removeThisItem"),
			title       : L("delete")
		});
		dialog.addEventListener('click', function(e){
			if (e.index === 0){
				CartWindow.removeItem(tiObj.id, tiObj.options);
				setCartTable();
			}
		});
		dialog.show();
	}

	/*
	 * Enable & Disable checkout button
	 *
	 * @param {Boolean} bool: set to true or false
	 */
	function enableCheckout(bool){
		checkoutButton.enabled = bool;
	}

	/*
	 * Bind Events & Handlers
	 */
	Ti.App.addEventListener(
		CartManager.events.change,
		function(e){
			if(table.editing){ return; }
			if(!CartManager.hasItems()){
				CartWindow.empty();
			}
			else{
				setCartTable();
				subTotalAmountLbl.text = "$" + CartManager.getSubTotal();
			}
		}
	);

	CartWindow.addEventListener(
		"focus",
		function(e){
			setCartTable();
		}
	);

	checkoutButton.addEventListener(
		"click",
		function(e){
			var modal = require('ui/CheckoutModal').create();
			modal.open();
		}
	);

	return CartWindow;
};

module.exports = CartWindow;