{
	"configurationSettings": [{
		"category": "General",
		"fields": [{
			"type": "webmap"
		}, {
			"type": "appproxies"
		}, 
		 {
			"placeHolder": "Defaults to web map title",
			"label": "Title:",
			"fieldName": "title",
			"type": "string",
			"tooltip": "Defaults to web map title"
		}]
	}, {
		"category": "Theme",
		"fields": [{
			"type": "subcategory",
			"label": "Colors"
		}, {
			"type": "color",
			"fieldName": "theme",
			"tooltip": "Color theme to use",
			"label": "Color Theme:",
			"sharedThemeProperty": "header.background"
		}, {
			"type": "color",
			"fieldName": "color",
			"tooltip": "Title bar text color",
			"label": "Title Color:",
			"sharedThemeProperty": "header.text"
		}, {
			"type": "color",
			"fieldName": "bodyColor",
			"tooltip": "Panel text color",
			"label": "Panel Text Color:",
			"sharedThemeProperty": "body.text"
		}, {
			"type": "color",
			"fieldName": "bodyBg",
			"tooltip": "Panel background color",
			"label": "Panel Background Color:",
			"sharedThemeProperty": "body.background"
		}, {
			"type": "subcategory",
			"label": "Custom Layout Options"
		}, {
			"type": "paragraph",
			"value": "Use the Custom css option to paste css that overwrites rules in the app."
		}, {
			"type": "string",
			"fieldName": "customstyle",
			"tooltip": "Custom css",
			"label": "Custom css"
		}]
	}, {
		"category": "Options",
		"fields": [{
			"type": "subcategory",
			"label": "Tools"
		}, {
			"type": "boolean",
			"fieldName": "edittoolbar",
			"label": "Display Edit Toolbar"
		}, {
			"type": "paragraph",
			"value": "Enable the Locate Button to add a button to the map that allows users to identify thier current location. To track the users current location set Locate Button and Location Tracking to true."
		}, {
			"type": "boolean",
			"fieldName": "locate",
			"label": "Locate Button"
		}, {
			"type": "boolean",
			"fieldName": "locatetrack",
			"label": "Location Tracking"
		}, {
			"type": "boolean",
			"fieldName": "home",
			"label": "Home Button"
		}, {
			"type": "boolean",
			"fieldName": "scale",
			"label": "Scalebar"
		}, {
			"type": "paragraph",
			"value": "Enable the basemap toggle button. The button will use the web map's default basemap as the map main. Select an alternate basemap from the list to toggle."
		}, {
			"type": "boolean",
			"fieldName": "basemap",
			"label": "Basemap Toggle"
		}, {
			"type": "basemaps",
			"fieldName": "alt_basemap",
			"tooltip": "Select the alternate basemap",
			"label": "Alternate Basmap"
		}]
	}, {
		"category": "Search",
		"fields": [{
			"type": "subcategory",
			"label": "Search Settings"
		}, {
			"type": "paragraph",
			"value": "Enable search to allow users to find a location or data in the map. Configure the search settings to refine the experience in your app by setting the default search resource, placeholder text, etc."
		}, {
			"type": "boolean",
			"fieldName": "search",
			"label": "Enable search tool"
		}, {
			"type": "search",
			"fieldName": "searchConfig",
			"label": "Configure search tool"
		}]
	}],
	"values": {
		"color": "#4c4c4c",
		"theme": "#f7f8f8",
		"bodyBg": "#fff",
		"bodyColor": "#666",
		"scale": true,
		"home": true,
		"edittoolbar": false,
		"locate": false,
		"locatetrack": false,
		"search": true,
		"basemap": false,
		"alt_basemap": "satellite"
	}
}