/**********************************************
* Use this file to send order information to  *
* your server for order fulfillment.          *
***********************************************/

// Get Configuration Data
var config = require('data/Config');

var ProcessOrder = {

	// Called when order is successful via PayPal
	success : function(order, transactionId){
		Ti.API.info('Payment Success.  TransactionID: ' + transactionId);
		Ti.API.info('Order Data = ' + JSON.stringify(order));
		Ti.UI.createAlertDialog({
		    title   : config.PAYMENT_SUCCESS_MESSAGE.TITLE,
		    message : config.PAYMENT_SUCCESS_MESSAGE.MESSAGE
		}).show();
	},

	// Called when order was cancelled by user during PayPal flow
	cancelled : function(order){
		Ti.API.info('Payment Canceled');
	},

	// Called if an error occurs during PayPal transaction
	failed : function(order, errorCode, errorMessage){
		Ti.API.info('Payment Error');
		Ti.API.info('errorCode: ' + errorCode);
	    Ti.API.info('errorMessage: ' + errorMessage);
		alert(errorMessage);
	}
};