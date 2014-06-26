var osname  = Ti.Platform.osname,
	density = Ti.Platform.displayCaps.density,
	width   = Ti.Platform.displayCaps.platformWidth,
	height  = Ti.Platform.displayCaps.platformHeight,
	dpi     = Ti.Platform.displayCaps.dpi;

//Shortcuts
exports.osname  = osname;
exports.width   = width;
exports.height  = height;
exports.density = density,
exports.dpi     = dpi;

/**
 * Mix an object with the properties from another
 *
 * @param {Object} target: The target object
 * @param {Object} source: The source object
 * @return {Object} Returns merged object.
 */
exports.mixin = function(target, source){
	var name, s, i;
	for(name in source){
		if (source.hasOwnProperty(name)) {
			s = source[name];
			if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
				target[name] = s;
			}
		}
	}
	return target;
};

/**
 * Return size for one of four different settings.
 * Always returns normal size setting for iOS (scaling is handled by os & 2x images)
 *
 * @param {Number} small: Size for small screens (Android)
 * @param {Number} normal: Size for normal screens (iOS & Android)
 * @param {Number} large: Size for large screens (Android)
 * @param {Number} xlarge: Size for xtra large screens (Android)
 */
exports.getSize = function (small, normal, large, xlarge){
	if(osname === 'iphone' || osname === 'ipad'){
		return normal;
	}
	else if(osname === 'android'){
		if(height<427 && width<321){
			return small;
		}
		else if(height<471 && width<321){
			return normal;
		}
		else if(height<641 && width<481){
			return large;
		}
		else if(height<961 && width<721){
			return xlarge;
		}
		else{
			return normal;
		}
	}
}

/*
 * Check of string is a url
 * 
 * @param {String} str: the url string to validate
 */
exports.isURL = function(str){
	if(typeof str!=="string"){ return false; }
	return (/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/).test(str);
},

/*
 * Fetch data from the interwebs using HTTP Get
 * 
 * @param {String} url: the url to fetch data from
 * @param {Function} callback: the callback function used when data is returned
 * @event 
 */
exports.fetch = function (url, callback, attempts, sendCount){
	var httpc     = Ti.Network.createHTTPClient(),
		sendCount = sendCount || 0,
		that      = this,
		defaults  = {
			timeout  : 5000,
			type     : "GET",
			attempts : attempts || 10
		};

	httpc.setTimeout(defaults.timeout);

	httpc.onerror = function(e){
		if(sendCount>=defaults.attempts){
			Ti.API.error("Util.fetch: Request Error (Attemts: " + sendCount + ")");
			callback(false);
		}
		else{
			that.fetch.send(url, callback, ++sendCount);
		}
	};

	httpc.onload  = function(evt){
		var json;

		try{
			Ti.API.info(httpc.responseText);
			json = JSON.parse(httpc.responseText);
		}
		catch(e){
			Ti.API.error("Util.fetch: Invalid JSON from server");
			if(sendCount>=defaults.attempts){
				Ti.API.error("Util.fetch: JSON Parse Error (Attemts: " + sendCount + ")");
				callback(false);
			}
			else{
				that.fetch.send(url, callback, ++sendCount);
			}
		}

		callback(json);
	};

	sendCount++;
	if(Ti.Network.getOnline()){
		Ti.API.log("Util.fetch: Attempt #" + sendCount);
		httpc.open(defaults.type, url);
		httpc.send();
	}
	else{
		httpc.onerror();
	}
}



