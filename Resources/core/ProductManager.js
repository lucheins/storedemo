var _products  = {},
	_groups    = {},
	_spotlight = [],
	_featured  = [],
	_fire      = Ti.App.fireEvent,
	_events    = {
		"PRODUCTS_READY"   : "ProductManager:Products.Ready",
		"SPOTLIGHTS_READY" : "ProductManager:Spotlights.Ready",
		"FEATURED_READY"   : "ProductManager:Featured.Ready"
	};

/*
 * Set the products data into product list and sub-list (spotlight, featured and group list).
 * All sub-list use product index keys to save memory
 * 
 * @param {Array|Object} data: the products array or the full json object from server
 */
exports.setProducts = function(data, callback){
	if(!Array.isArray(data) && !data.products){
		return Ti.API.error("Store > setProducts: Invalid products object");
	}
	var p = data.products || data;

	for(var i=0, l=p.length; i<l; i++){
		_products[p[i].id] = p[i];
		if(p[i].groups.spotlight){
			_spotlight.push({
				"img"    : p[i].imgs.spotlight,
				"id"     : p[i].id,
				"config" : p[i].animatedSpotlightCaptions
			});
		}
		if(p[i].groups.featured){
			_featured.push({
				img  : p[i].imgs.thumb,
				name : p[i].name,
				desc : p[i].desc.short,
				id   : p[i].id
			});
		}
		if(!_groups[p[i].groups.category]){
			_groups[p[i].groups.category] = [p[i]];
		}
		else{
			_groups[p[i].groups.category].push(p[i]); // add product index to product group
		}
	}

	Ti.App.fireEvent( _events.SPOTLIGHTS_READY );
	Ti.App.fireEvent( _events.FEATURED_READY );
	Ti.App.fireEvent( _events.PRODUCTS_READY );

	callback();
};

exports.getProduct = function(id){
	return _products[id];
};

exports.getProductGroup = function(category){
	return (category==="__ALL__") ? _groups : _groups[category];
};

exports.getFeaturedProducts = function(){
	return _featured;
};

exports.getSpotlightProducts = function(){
	return _spotlight;
};

exports.events = _events;