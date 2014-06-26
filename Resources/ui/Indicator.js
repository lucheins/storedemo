var isIndicatorOpen = false,
	osname = Ti.Platform.osname,
	style  = '',
	view   = Ti.UI.createView({
		backgroundColor : "#000",
		borderRadius    : "10dip",
		opacity         : 0.8
	}),
	// message
	message = Ti.UI.createLabel({
		color  : "#fff",
		width  : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		font   : { fontSize : 14, fontWeight : "bold" },
		bottom : "20dip"
	}),
	// window container
	indicatorWin = Ti.UI.createWindow({
		top    : 0,
		left   : 0,
		right  : 0,
		bottom : 0
	}),
	// loading indicator
	activityIndicator = Ti.UI.createActivityIndicator({
		height : "30dip",
		width  : "30dip"
	});

if (osname === 'iphone' || osname === 'ipad'){
	style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
}
else{
	style = Ti.UI.ActivityIndicatorStyle.BIG;
}
activityIndicator.style = style;

view.add(activityIndicator);
view.add(message);
indicatorWin.add(view);

exports.show = function(settings){
	settings        = settings || {};
	isIndicatorOpen = true;
	message.text    = settings.txt || L("loading");
	view.width      = settings.width || "150dip";
	view.height     = settings.height || "150dip";
	view.top        = settings.top || null;
	view.bottom     = settings.bottom || null;
	view.left       = settings.left || null;
	view.right      = settings.right || null;
	indicatorWin.open();
	activityIndicator.show();
};

exports.hide = function(){
	isIndicatorOpen = false;
	activityIndicator.hide();
	indicatorWin.close({ opacity : 0, duration : 500 });
};

exports.isOpen = function(){
	return isIndicatorOpen;
};
