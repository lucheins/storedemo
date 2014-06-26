// Private Parameters
var _hasItems       = false,
	_subTotal       = 0.00,
	_items          = [],
	_itemCount      = 0,
	_ProductManager = require('core/ProductManager'),
	_this           = this,
	_events         = {
		"change" : "CartManager::Cart_Changed"
	};

// Private Methods
var _compareOptions = function(optionsA, optionsB){
		if(typeof optionsA == "undefined" || typeof optionsB == "undefined"){
			return false;
		}
		return optionsA === optionsB;
	},
	_findItemIndex = function(id, options){
		var i         = 0,
			len       = _items.length,
			options   = (typeof options == "string") ? options : options.join(", "),
			itemIndex = null,
			hasSameOptions,
			item;

		for(; i<len;i++){
			item = _items[i];
			hasSameOptions = _compareOptions(item.options, options);
			if(id===item.id && hasSameOptions){
				itemIndex = i;
				break;
			}
		}
		return itemIndex;
	},
	_addItem = function(product, options){
		_items.push({
			"id"       : product.id,
			"name"     : product.name,
			"quantity" : 1,
			"price"    : (product.price - 0).toFixed(2),
			"options"  : (typeof options == "string") ? options : options.join(", ")
			
		});
	},
	_fireEvent = function(event){
		Ti.App.fireEvent(event);
	};

// Public Methods
exports.hasItems = function(){
	return _hasItems;
};

exports.addItem = function(id, options, itemIndex, howMany){
	var options    = options || [],
		indexToAdd = itemIndex || _findItemIndex(id, options),
		product,
		item;

	if(indexToAdd===null){
		product = _ProductManager.getProduct(id);
		_addItem(product, options);
		_subTotal += product.price;
	}
	else{
		item = _items[indexToAdd];
		item.quantity += howMany || 1;
		_subTotal += (item.price - 0) * (howMany || 1);
	}
	_itemCount += howMany || 1;
	_hasItems = true;
	_fireEvent(_events.change);
};

exports.setItemQuantity = function(id, options, quantity){
	var options   = options || [],
		itemIndex = _findItemIndex(id, options),
		item;

	if(itemIndex===null){
		return;
	}

	item = _items[itemIndex];

	if(quantity<1){
		this.removeItem(id, options, itemIndex);
	}
	else if(quantity<item.quantity){
		this.removeItem(id, options, itemIndex, item.quantity - quantity);
	}
	else if(quantity>item.quantity){
		this.addItem(id, options, itemIndex, quantity - item.quantity);
	}
}

exports.removeItem = function(id, options, itemIndex, howMany){
	var options = options || [],
		indexToRemove = itemIndex || _findItemIndex(id, options),
		removedItem,
		item;

	if(indexToRemove===null){
		return;
	}

	if(howMany){
		item           = _items[indexToRemove];
		item.quantity -= howMany;
		_subTotal     -= (item.price - 0).toFixed(2) * howMany;
		_itemCount    -= howMany;

		_fireEvent(_events.change);

		return;
	}

	removedItem = _items.splice(indexToRemove, 1)[0];

	if(_items.length<1){
		this.empty();
	}
	else{
		_subTotal  -= (removedItem.price - 0).toFixed(2) * removedItem.quantity;
		_itemCount -= removedItem.quantity;
	}
	_fireEvent(_events.change);
};

exports.findItem = function(id){
	var i   = 0,
		len = _items.length;
	for(;i<len;i++){
		if(id==_items[i].id){
			return _items[i];
		}
	}
	return false;
};

exports.empty = function(){
	if(this.hasItems()){
		_subTotal  = 0.00;
		_items     = [];
		_itemCount = 0;
		_hasItems  = false;

		_fireEvent(_events.change);
	}
};

exports.getCartData = function(){
	var cartData = [],
		i        = 0,
		len      = _items.length,
		item;
	for(;i<len;i++){
		item = _items[i];
		cartData.push({
			"itemID"     : item.id,
			"name"       : item.name + (item.options) ? "(" + item.options + ")" : "",
			"itemCount"  : parseInt(item.quantity),
			"itemPrice"  : (item.price - 0).toFixed(2) * 1,
			"totalPrice" : (item.price - 0).toFixed(2) * item.quantity
		});
	}
	return cartData;
}

exports.getRawCartData = function(){
	return _items;
}

exports.getSubTotal = function(){
	return _subTotal.toFixed(2);
}

exports.getItemCount = function(){
	return _itemCount;
}

exports.events = _events;