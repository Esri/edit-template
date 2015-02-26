{  
   "configurationSettings":[  
      {  
         "category":"<b>Map Settings</b>",
         "fields":[  
            {  
               "type":"webmap"
            },
            {  
               "placeHolder":"Defaults to web map title",
               "label":"Title:",
               "fieldName":"title",
               "type":"string",
               "tooltip":"Defaults to web map title"
            }
         ]
      },{
         "category": "Theme",
         "fields":[
            {  
               "type":"color",
               "fieldName":"theme",
               "tooltip":"Color theme to use",
               "label":"Color Theme:"
            },
            {  
               "type":"color",
               "fieldName":"color",
               "tooltip":"Title bar text color",
               "label":"Title Color:"
            }
         ]
      },{
         "category": "Search Settings",
         "fields":[
            {  
               "type":"paragraph",
               "value":"Enable the search capability and optionally select search layers and fields. These layers will appear in the search tool allowing application users to search for particular values in the specified layers and fields."
            },
            {  
               "type":"boolean",
               "fieldName":"search",
               "label":"Address Finder"
            },
            {  
               "type":"boolean",
               "fieldName":"searchExtent",
               "label":"Prioritize search results in current extent."
            },{
               "type":"paragraph",
               "value": "When Location Search is true the search widget will allow users to search for addresses and locations using one or more locators and also search the layers and fields specified in the Search Layers configuration option. Unchecking the Location Search option will remove the locator search and only configured search layers will be displayed."
            },{
               "type": "boolean",
               "fieldName": "locationSearch",
               "label": "Location Search"
            },
            {  
               "label":"Select layers and fields",
               "fieldName":"searchLayers",
               "type":"multilayerandfieldselector",
               "tooltip":"Select layer and fields to search",
               "layerOptions":{  
                  "supportedTypes":[  
                     "FeatureLayer"
                  ],
                  "geometryTypes":[  
                     "esriGeometryPoint",
                     "esriGeometryLine",
                     "esriGeometryPolyline",
                     "esriGeometryPolygon"
                  ]
               },
               "fieldOptions":{  
                  "supportedTypes":[  
                     "esriFieldTypeString"
                  ]
               }
            }
         ]
      },
      {  
         "category":"Tools",
         "fields":[  
            {
               "type":"boolean",
               "fieldName":"edittoolbar",
               "label":"Display Edit Toolbar"
            },
           
            {
               "type": "paragraph",
               "value": "Enable the Locate Button to add a button to the map that allows users to identify thier current location. To track the users current location set Locate Button and Location Tracking to true."
            },
            {  
               "type":"boolean",
               "fieldName":"locate",
               "label":"Locate Button"
            },{
               "type": "boolean",
               "fieldName": "locatetrack",
               "label": "Location Tracking"
            },
            {  
               "type":"boolean",
               "fieldName":"home",
               "label":"Home Button"
            },
            {  
               "type":"boolean",
               "fieldName":"scale",
               "label":"Scalebar"
            },{
               "type": "paragraph",
               "value": "Enable the basemap toggle button. The button will use the web map's default basemap as the map main. Select an alternate basemap from the list to toggle."
            },{
               "type": "boolean",
               "fieldName": "basemap",
               "label": "Basemap Toggle"
            },{
               "type": "string",
               "fieldName": "alt_basemap",
               "tooltip": "Select the alternate basemap",
               "label": "Alternate Basmap",
               "options":[
                  {
                     "label": "Dark Gray",
                     "value": "dark-gray"
                  },{
                     "label": "Light Gray",
                     "value": "gray"
                  },{
                     "label": "Imagery with Labels",
                     "value": "hybrid"
                  },{
                     "label": "National Geographic",
                     "value": "national-geographic"
                  },{
                     "label": "Oceans",
                     "value": "oceans"
                  },{
                     "label": "Open Street Map",
                     "value": "osm"
                  },{
                     "label": "Imagery",
                     "value": "satellite"
                  },{
                     "label": "Streets",
                     "value": "streets"
                  },{
                     "label": "Terrain with Labels",
                     "value": "terrain"
                  },{
                     "label": "Topographic",
                     "value": "topo"
                  }
               ]
            }
         ]
      }
   ],
   "values":{  
      "color":"#4c4c4c",
      "theme":"#f7f8f8",
      "scale":true,
      "home":true,
      "edittoolbar": false,
      "locate":false,
      "locatetrack": false,
      "search":true,
      "searchExtent":false,
      "locationSearch": true,
      "basemap": false,
      "alt_basemap": "satellite"
   }
}
