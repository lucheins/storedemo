// Add CartManager
var CartManager = require('core/CartManager');

exports.create = function (productObj){
	var ProductOptions = Ti.UI.createWindow({
			height          : 460,
			width           : 320,
			navBarHidden    : true,
			modal           : true
		}),
		view = Ti.UI.createView({
			height          : 420,
			width           : 300,
			backgroundColor : "#eee",
			borderRadius    : 10
		}),
		title1 = Ti.UI.createLabel({
			text   : L("purchaseOptionsFor"),
			color  : "#000",
			width  : "auto",
			height : 20,
			font   : { fontSize : 16, fontWeight : "bold" },
			top    : 5
		}),
		title2 = Ti.UI.createLabel({
			text   : productObj.name,
			color  : "#000",
			width  : "auto",
			height : 20,
			font   : { fontSize : 16, fontWeight : "bold" },
			top    : 26
		}),
		dropShadowTop = Ti.UI.createImageView({
			image  : "imgs/drop_shadow_top.png",
			width  : 320,
			height : 4,
			top    : 50
		}),
		table = Ti.UI.createTableView({
			top                : 50,
			bottom             : 41,
			style              : Ti.UI.iPhone.TableViewStyle.GROUPED,
			backgroundColor    : "#ccc",
			rowBackgroundColor : "white"
		}),
		dropShadowBottom = Ti.UI.createImageView({
			image  : "imgs/drop_shadow_bottom.png",
			width  : 320,
			height : 4,
			bottom : 41
		}),
		buyButton = Ti.UI.createButtonBar({
			labels          : [ L("addToCart") ],
			backgroundColor : "#063",
			style           : Ti.UI.iPhone.SystemButtonStyle.BAR,
			height          : 30,
			width           : 80,
			bottom          : 5,
			right           : 5
		}),
		optionsLength   = productObj.options.length,
		tableData       = [],
		groupIndex      = 0,
		selectedOptions = [];

	// assemble UI
	view.add(title1);
	view.add(title2);
	view.add(table);
	view.add(buyButton);
	view.add(dropShadowTop);
	view.add(dropShadowBottom);
	ProductOptions.add(view);

	for(var i=0; i<optionsLength; i++){
		var option          = productObj.options[i],
			selectionLength = option.selections.length,
			isMultiSelect   = option.multiple;

		for(var x=0; x<selectionLength; x++){
			var isFirst = x==0,
				row = getRow(
					option.selections[x],
					isFirst ? option.name : undefined
				);

			row.groupIndex    = groupIndex;
			row.isMultiSelect = isMultiSelect;
			row.name          = option.selections[x];

			tableData.push(row);
		}
		groupIndex++;
	}

	table.setData(tableData);

	/*
	 * Create selection table row
	 * 
	 * @param {String} text: the text label for the row
	 * @return {Object} returns a Ti table row object
	 */
	function getRow(text, header){
		var row = Ti.UI.createTableViewRow({
			height         : 30,
			title          : text,
			selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});

		if(header){
			row.header = header;
		}

		row.select = function(bool){
			row.hasCheck = bool;
		}

		return row;
	}

	buyButton.addEventListener(
		"click",
		function(e){
			for(var i=0, len = tableData.length; i<len; i++){
				if(tableData[i].hasCheck) {
					selectedOptions.push(tableData[i].name);
				}
			}
			ProductOptions.close();
			CartManager.addItem(productObj.id, selectedOptions);
		}
	);

	table.addEventListener(
		"click",
		function(e){
			// if multiple selection is not allowed then treat group as radio buttons
			if(!e.row.isMultiSelect){
				for(var i=0, len = tableData.length; i<len; i++){
					if(tableData[i].groupIndex == e.row.groupIndex){
						tableData[i].hasCheck = false;
					}
				}
				e.row.hasCheck = true;
			}
			// else treat as group as checkboxes
			else{
				e.row.hasCheck = (e.row.hasCheck) ? false : true;
			}
		}
	);

	return ProductOptions;
};
