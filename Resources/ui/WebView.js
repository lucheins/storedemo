exports.create = function(title, url){
	var window = Ti.UI.createWindow({
			title           : title,
			navBarHidden    : false,
			barColor        : '#000000',
			backgroundColor : "#fff"
		}),
		webview = Ti.UI.createWebView({
			top             : 0,
			bottom          : 0,
			left            : 0,
			right           : 0,
			backgroundColor	: "transparent",
			visible         : false,
			scalesPageToFit : false,
			url             : url
		}),
		LoadingIndicator = require('ui/Indicator');

	window.add(webview);

	window.addEventListener(
		"focus",
		setInfoHTML
	);
	webview.addEventListener(
		"beforeload",
		function(){
			LoadingIndicator.show();
		}
	);
	webview.addEventListener(
		"load",
		function(){
			LoadingIndicator.hide();
		}
	);


	function setInfoHTML(){
		window.add(webview);
		webview.show();
	}

	return window;
};