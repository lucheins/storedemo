
// Get Configuration Data
var config = require('data/Config');

function InfoWindow() {
	var Window = Ti.UI.createWindow({
		title           : L("info"),
		navBarHidden    : false,
		barColor        : '#000000',
		backgroundColor : "#cbd2d8",
		layout          : "vertical"
	}),
	infoTable,
	versionLabel;

	Window.addEventListener(
		"focus",
		function(e){
			infoTable    = buildInfoTable();
			versionLabel = getVersionLabel();

			infoTable.addEventListener( "click", function(e){ launchInfoWebView(e.index) } );

			Window.add(infoTable);
			Window.add(versionLabel);
		}
	);

	Window.addEventListener(
		"blur",
		function(e){
			// release info table for garbage collection
			// delay 500ms to allow window transition
			setTimeout(
				function(){
					Window.remove(infoTable);
					Window.remove(versionLabel);
					infoTable = null;
					versionLabel = null;
				},
				500
			);
			
		}
	);

	/*
	 * Create an info table
	 * 
	 * @return {Object} returns a Ti table object
	 */
	function getTable(){
		return Ti.UI.createTableView({
			top : 10,
			borderRadius    : 6,
			borderWidth     : 1,
			borderColor     : "#ababab",
			scrollable      : false,
			left            : 10,
			right           : 10,
			backgroundColor : "#fff"
		});
	}

	/*
	 * Create an info table row
	 * 
	 * @param {String} text: the text label for the row
	 * @return {Object} returns a Ti table row object
	 */
	function getRow(text){
		return Ti.UI.createTableViewRow({
			height   : 44,
			hasChild : true,
			width    : 300,
			color    : '#000',
			title    : text
		});
	}

	/*
	 * Create info table
	 * 
	 * @return {Object} returns info table object
	 */
	function buildInfoTable(){
		var arrLength   = config.INFO_SCREENS.length,
			table       = getTable(),
			rows        = [],
			tableHeight = arrLength * 44;

		for(var i=0; i<arrLength; i++){
			rows.push( getRow(config.INFO_SCREENS[i].TITLE) );
		}
		
		table.height = tableHeight;
		table.setData(rows);

		return table;
	}

	/*
	 * Create version label
	 */
	function getVersionLabel(){
		return Ti.UI.createLabel({
			text         : L("version") + " " + Ti.App.version,
			top          : 20,
			height       : 20,
			width        : 320,
			color        : "#666",
			textAlign    : "center",
			shadowColor  : "#fff",
			shadowOffset : { x : 1, y : 1 },
			font         : { fontSize : 16 }
		});
	}

	/*
	 * Launch info screen webview
	 *
	 * @param {Number} index: the table row index
	 */
	function launchInfoWebView(index){
		Ti.App.fireEvent(
			"APP:SHOW_INFO_VIEW",
			{ "title" : config.INFO_SCREENS[index].TITLE, "url" : config.INFO_SCREENS[index].URL }
		);
	}

	return Window;
};

module.exports = InfoWindow;