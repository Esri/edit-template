/*global define,document */
/*jslint sloppy:true,nomen:true */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define(["dojo/_base/declare", "dojo/has", "dojo/_base/lang", "dojo/_base/kernel", "dojo/_base/Color", "dojo/_base/array", "dojo/on", "dijit/registry", "esri/arcgis/utils", "esri/lang", "dojo/dom", "dojo/dom-geometry", "dojo/dom-attr", "dojo/dom-style", "dojo/query", "dojo/dom-construct", "dojo/dom-class", "application/Drawer", "esri/layers/FeatureLayer", "esri/dijit/editing/Editor", "esri/dijit/AttributeInspector", "esri/tasks/query", "esri/domUtils", "application/SearchSources", "dojo/domReady!"], function (
  declare, has, lang, kernel, Color, array, on, registry, arcgisUtils, esriLang, dom, domGeometry, domAttr, domStyle, query, domConstruct, domClass, Drawer, FeatureLayer, Editor, AttributeInspector, esriQuery, domUtils, SearchSources) {
  return declare(null, {
    config: {},
    editor: null,
    editable: false,
    editableLayers: [],
    timeFormats: ["shortDateShortTime", "shortDateLEShortTime", "shortDateShortTime24", "shortDateLEShortTime24", "shortDateLongTime", "shortDateLELongTime", "shortDateLongTime24", "shortDateLELongTime24"],
    startup: function (config) {
      document.documentElement.lang = kernel.locale;
      // config will contain application and user defined info for the template such as i18n strings, the web map id
      // and application id
      // any url parameters and any application specific configuration information.
      if (config) {
        this.config = config;
        if (this.config.sharedThemeConfig && this.config.sharedThemeConfig.attributes && this.config.sharedThemeConfig.attributes.theme) {
          var sharedTheme = this.config.sharedThemeConfig.attributes;
          this.config.color = sharedTheme.theme.text.color;
          this.config.theme = sharedTheme.theme.body.bg;
        }
        // Apply custom layout css
        var customTheme = document.createElement("link");
        customTheme.setAttribute("rel", "stylesheet");
        customTheme.setAttribute("type", "text/css");
        customTheme.setAttribute("href", "css/theme/" + this.config.customLayout + ".css");
        document.head.appendChild(customTheme);


        // Create and add custom style sheet
        if (this.config.customstyle) {
          var style = document.createElement("style");
          style.appendChild(document.createTextNode(this.config.customstyle));
          document.head.appendChild(style);
        }
        this.config.color = this._setColor(this.config.color);
        this.config.theme = this._setColor(this.config.theme);

        // responsive drawer
        this._drawer = new Drawer({
          // Pixel size when the drawer is automatically opened
          borderContainer: "border_container",
          // border container node id
          contentPaneCenter: "cp_center",
          // center content pane node id
          contentPaneSide: "cp_left",
          // side content pane id
          toggleButton: "toggle_button",
          // button node to toggle drawer id
          config: this.config,
          direction: this.config.i18n.direction // i18n direction "ltr" or "rtl"
        });

        // startup drawer
        this._drawer.startup();



        //supply either the webmap id or, if available, the item info
        var itemInfo = this.config.itemInfo || this.config.webmap;
        this._createWebMap(itemInfo);
      } else {
        var error = new Error("Main:: Config is not defined");
        this.reportError(error);
      }
    },
    reportError: function (error) {
      // remove loading class from body
      domClass.remove(document.body, "app-loading");
      domClass.add(document.body, "app-error");
      // an error occurred - notify the user. In this example we pull the string from the
      // resource.js file located in the nls folder because we've set the application up
      // for localization. If you don't need to support multiple languages you can hardcode the
      // strings here and comment out the call in index.html to get the localization strings.
      // set message
      var node = dom.byId("loading_message");
      if (node) {
        if (this.config && this.config.i18n) {
          node.innerHTML = this.config.i18n.map.error + ": " + error.message;
        } else {
          node.innerHTML = "Unable to create map: " + error.message;
        }
      }

    },
    _addMapWidgets: function () {
      if (this.config.scale) {
        require(["esri/dijit/Scalebar"], lang.hitch(this, function (Scalebar) {
          var scalebar = new Scalebar({
            map: this.map,
            scalebarUnit: this.config.units
          });
        }));
      }
      if (this.config.home) {
        require(["esri/dijit/HomeButton"], lang.hitch(this, function (HomeButton) {
          if (!HomeButton) {
            return;
          }
          var home = new HomeButton({
            map: this.map
          }, domConstruct.create("div", {}, query(".esriSimpleSliderIncrementButton")[0], "after"));
          home.startup();

        }));
      }

      //add the location button if enabled.
      if (this.config.locate) {
        require(["esri/dijit/LocateButton"], lang.hitch(this, function (LocateButton) {
          if (!LocateButton) {
            return;
          }
          //add the location button as a child of the map div.
          var locateDiv = domConstruct.create("div", {
            id: "locateDiv"
          }, "mapDiv");
          var locationButton = new LocateButton({
            map: this.map,
            useTracking: this.config.locatetrack
          }, locateDiv);
          locationButton.startup();
        }));
      }

      //add the basemap toggle if enabled.
      if (this.config.basemap) {
        require(["esri/dijit/BasemapToggle", "esri/basemaps"], lang.hitch(this, function (BasemapToggle, basemaps) {
          if (!BasemapToggle && basemaps) {
            return;
          }

          var toggle_container = domConstruct.create("div", {}, "mapDiv"); /*Remove at JSAPI 4.0*/
          var bmLayers = [],
            mapLayers = this.map.getLayersVisibleAtScale(this.map.getScale());
          if (mapLayers) {
            for (var i = 0; i < mapLayers.length; i++) {
              if (mapLayers[i]._basemapGalleryLayerType) {
                var bmLayer = this.map.getLayer(mapLayers[i].id);
                if (bmLayer) {
                  bmLayers.push(bmLayer);
                }
              }
            }
          }
          on.once(this.map, "basemap-change", lang.hitch(this, function () {
            if (bmLayers && bmLayers.length) {
              for (var j = 0; j < bmLayers.length; j++) {
                bmLayers[j].setVisibility(false);
              }
            }
          })); /*End Remove*/

          var toggle = new BasemapToggle({
            map: this.map,
            basemap: this.config.alt_basemap || "satellite"
          }, toggle_container);
          if (this.config.response && this.config.response.itemInfo && this.config.response.itemInfo.itemData && this.config.response.itemInfo.itemData.baseMap) {
            var b = this.config.response.itemInfo.itemData.baseMap;
            if (b.title === "World Dark Gray Base") {
              b.title = "Dark Gray Canvas";
            }
            if (b.title) {
              for (var j in basemaps) {
                //use this to handle translated titles
                if (b.title === this._getBasemapName(j)) {
                  toggle.defaultBasemap = j;
                  //remove at 4.0
                  if (i === "dark-gray") {
                    if (this.map.layerIds && this.map.layerIds.length > 0) {
                      this.map.basemapLayerIds = this.map.layerIds.slice(0);
                      this.map._basemap = "dark-gray";
                    }
                  }
                  //end remove at 4.0
                  this.map.setBasemap(j);
                }
              }
            }
          }
          toggle.startup();
        }));
      }

      //Add the location search widget
      if (this.config.search) {

        require(["esri/dijit/Search", "esri/tasks/locator", "esri/lang"], lang.hitch(this, function (Search, Locator, esriLang) {
          if (!Search && !Locator) {
            return;
          }

          var searchOptions = {
            map: this.map,
            useMapExtent: this.config.searchExtent,
            itemData: this.config.response.itemInfo.itemData
          };

          if (this.config.searchConfig) {
            searchOptions.applicationConfiguredSources = this.config.searchConfig.sources || [];
          } else if (this.config.searchLayers) {
            var configuredSearchLayers = (this.config.searchLayers instanceof Array) ? this.config.searchLayers : JSON.parse(this.config.searchLayers);
            searchOptions.configuredSearchLayers = configuredSearchLayers;
            searchOptions.geocoders = this.config.locationSearch ? this.config.helperServices.geocode : [];
          }
          var searchSources = new SearchSources(searchOptions);
          var createdOptions = searchSources.createOptions();
          if (this.config.searchConfig && this.config.searchConfig.activeSourceIndex) {
            createdOptions.activeSourceIndex = this.config.searchConfig.activeSourceIndex;
          }
          createdOptions.enableButtonMode = true;
          createdOptions.expanded = false;


          var search = new Search(createdOptions, domConstruct.create("div", {
            id: "search"
          }, "mapDiv"));


          search.on("select-result", lang.hitch(this, function () {
            //if edit tool is enabled we'll have to delete/create
            //so info window behaves correctly.
            on.once(this.map.infoWindow, "hide", lang.hitch(this, function () {
              search.clearGraphics();
              if (this.editor) {
                this._destroyEditor();
                this._setupEditablePopup();
                this._createEditor();
              }
            }));

          }));

          search.startup();

        }));
      }
      this._updateTheme();

    },
    // create a map based on the input web map id
    _createWebMap: function (itemInfo) {
      itemInfo = this._setExtent(itemInfo);
      var mapOptions = {};
      mapOptions = this._setLevel(mapOptions);
      mapOptions = this._setCenter(mapOptions);
      var options = {
        mapOptions: mapOptions,
        usePopupManager: true,
        editable: this.config.editable,
        layerMixins: this.config.layerMixins || [],
        bingMapsKey: this.config.bingKey
      };
      if (this.config.orgInfo && this.config.orgInfo.user && this.config.orgInfo.user.privileges) {
        options.privileges = this.config.orgInfo.user.privileges;
        console.log("Privileges set", options.privileges);
      }

      arcgisUtils.createMap(itemInfo, "mapDiv", options).then(lang.hitch(this, function (response) {
        // Once the map is created we get access to the response which provides important info
        // such as the map, operational layers, popup info and more. This object will also contain
        // any custom options you defined for the template.
        this.map = response.map;
        this.config.response = response;
        domClass.add(this.map.infoWindow.domNode, "light");

        on(this.map.infoWindow, "show", this._updatePopup);
        on(this.map.infoWindow, "restore", this._updatePopup);
        var title = this.config.title || this.config.response.itemInfo.item.title;
        document.title = title;


        if (this.config.customLayout === "default") {
          domConstruct.create("h1", {
            id: "title",
            innerHTML: title
          }, "topBar", "last");

        } else {
          domConstruct.create("div", {
            className: "title-bar",
            innerHTML: "<h1 id='title'>" + title + "</h1>"
          }, "cp_left", "first");
        }


        //do we have any editable layers?
        this.editableLayers = this._getEditableLayers(response.itemInfo.itemData.operationalLayers);
        if (this.editableLayers.length > 0) {
          /* if (esriLang.isDefined(this.config.userPrivileges)) {
             if (array.indexOf(this.config.userPrivileges, "features:user:edit") === -1) {
               this.editable = false;
               this.config.i18n.map.noEditLayers = this.config.i18n.map.noEditPrivileges;
             }
           }*/
          this.editable = true;
          this._setupEditablePopup();
          this._createEditor();

        } else {
          // No editable layers
          this.config.editable = false;
          console.log("No Editable layers", this.config.editable);
          //add note that map doesn't contain editable layers
          registry.byId("cp_left").set("content", "<div style='padding:5px;'>" + this.config.i18n.map.noEditLayers + "</div>");
          this.map.setInfoWindowOnClick(true);
        }
        // remove loading class from body
        domClass.remove(document.body, "app-loading");
        this._addMapWidgets();

        // If you need map to be loaded, listen for it's load event.
      }), this.reportError);
    },
    _updatePopup: function (e) {
      var box = domGeometry.getContentBox(this.map.container);
      if (box && box.w && box.w < 600) {
        this.map.infoWindow.maximize();
      }
    },
    _setupEditablePopup: function () {
      var link = domConstruct.create("a", {
        "class": "action edit",
        "id": "editLink",
        "innerHTML": this.config.i18n.tools.edit,
        "href": "javascript: void(0);"
      }, query(".actionList", this.map.infoWindow.domNode)[0]);
      on(link, "click", lang.hitch(this, function () {
        var selectedFeature = this.map.infoWindow.getSelectedFeature();

        if (selectedFeature && selectedFeature._layer) {
          this._destroyEditor();
          this._createEditor();
          this.editor.attributeInspector.showFeature(selectedFeature, selectedFeature._layer)
          this.map.infoWindow.show();

        }
      }));

      on(this.map.infoWindow, "selection-change", function () {
        var selected = this.map.infoWindow.getSelectedFeature();
        if (selected && selected._layer && selected._layer.isEditable()) {
          // show editable link 
          domStyle.set(link, "visibility", "visible");
        } else { // hide editable link 
          domStyle.set(link, "visibility", "hidden");
        }
      });

    },
    _createEditor: function () {
      if (this.editable) {
        //add class we have a toolbar
        if (this.config.edittoolbar) {
          domClass.add(document.body, "edit-toolbar");
        }
        var settings = {
          map: this.map,
          layerInfos: this.editableLayers,
          toolbarVisible: this.config.edittoolbar
        };
        this.map.enableSnapping();
        this.editor = new Editor({
          settings: settings
        }, domConstruct.create("div"));
        domConstruct.place(this.editor.domNode, dom.byId("editorDiv"));

        this.editor.on("load", lang.hitch(this, function () {
          this.editor.templatePicker.on("selection-change", lang.hitch(this, function () {
            var sel = this.editor.templatePicker.getSelected();
            if (sel) {
              console.log("Prevent Popups so we can edit");
              this.map.setInfoWindowOnClick(false);
            }
          }));
        }));
        if (this.config.customLayout !== "default") {
          this.editor.on("load", function () {
            query(".esriDrawingToolbar").forEach(function (node) {
              domConstruct.place(node, dom.byId("editorDiv"), "before");
            });
          });
        }
        this.editor.startup();

        this._drawer.resize();
      }
    },
    _destroyEditor: function () {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
    },
    _getEditableLayers: function (layers) {
      var editableLayers = [];
      array.forEach(layers, lang.hitch(this, function (layer) {
        if (layer && layer.layerObject) {
          var eLayer = layer.layerObject;
          if (eLayer instanceof FeatureLayer) {
            if (eLayer.isEditable()) {
              editableLayers.push({
                "featureLayer": eLayer
              });
            } else {
              // setup event listener that enables popups when layer is clicked
              eLayer.on("click", lang.hitch(this, function () {
                this.map.setInfoWindowOnClick(true);
              }));
            }
          }
        }
      }));

      array.forEach(editableLayers, lang.hitch(this, function (hintLayer) {

        if (hintLayer.featureLayer && hintLayer.featureLayer.infoTemplate && hintLayer.featureLayer.infoTemplate.info && hintLayer.featureLayer.infoTemplate.info.fieldInfos) {
          //only display visible fields
          var fields = hintLayer.featureLayer.infoTemplate.info.fieldInfos;

          var fieldInfos = [];
          array.forEach(fields, lang.hitch(this, function (field) {

            //add date support
            if (field.format && field.format.dateFormat && array.indexOf(this.timeFormats, field.format.dateFormat) > -1) {
              field.format = {
                time: true
              };
            }
            if (field.visible) {
              fieldInfos.push(field);
            }
          }));
          hintLayer.fieldInfos = fieldInfos;
        }
      }));

      return editableLayers;
    },
    _updateTheme: function () {
      var styles = {
        theme: this.config.theme,
        color: this.config.color,
        buttonColor: this.config.buttonColor,
        buttonBg: this.config.buttonBg,
        bodyBg: this.config.bodyBg,
        bodyColor: this.config.bodyColor
      };
      var themeCss = esriLang.substitute(styles, ".bg{background-color:${theme}; color:${color};} .fc{color:${color};} .bc{color:${buttonColor}; !important}; .ac-container label:after{color:${buttonColor};}} .esriPopup .pointer{backgroundColor:${theme};} .esriPopup .titlePane{background-color:${theme};color:${color};} .esriPopup .titleButton{color:${color};} .ab{background-color:${buttonBg};}  .bb{background-color:${buttonBg}!important;} .panel_content{background-color:${bodyBg}; color:${bodyColor};} .content-pane-left{background:${bodyBg}; color:${bodyColor};} .ac-container label{color:${buttonColor} !important;}}");
      if (themeCss) {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(themeCss));
        document.head.appendChild(style);
      }
      this._drawer.resize();
      registry.byId("border_container").resize();
    },
    _setColor: function (value) {
      var colorValue = null,
        rgb;
      if (!value) {
        colorValue = new Color("transparent");
      } else {
        rgb = Color.fromHex(value).toRgb();
        if (has("ie") == 8) {
          colorValue = value;
        } else {
          rgb.push(0.9);
          colorValue = Color.fromArray(rgb);
        }
      }
      return colorValue;
    },

    _getBasemapName: function (name) {
      // We have to do this because of localized strings we need 
      // a better solution 
      var current = "Streets";
      if (name === "dark-gray" || name === "dark-gray-vector") {
        current = "Dark Gray Canvas";
      } else if (name === "gray" || name === "gray-vector") {
        current = "Light Gray Canvas";
      } else if (name === "hybrid") {
        current = "Imagery with Labels";
      } else if (name === "national-geographic") {
        current = "National Geographic";
      } else if (name === "oceans") {
        current = "Oceans";
      } else if (name === "osm") {
        current = "OpenStreetMap";
      } else if (name === "satellite") {
        current = "Imagery";
      } else if (name === "streets" || name === "streets-vector") {
        current = "Streets";
      } else if (name === "streets-navigation-vector") {
        current = "World Navigation Map";
      } else if (name === "streets-night-vector") {
        current = "World Street Map (Night)";
      } else if (name === "streets-relief-vector") {
        current = "World Street Map (with Relief)";
      } else if (name === "terrain") {
        current = "Terrain with Labels";
      } else if (name === "topo" || name === "topo-vector") {
        current = "Topographic";
      }
      return current;
    },

    _setLevel: function (options) {
      var level = this.config.level;
      //specify center and zoom if provided as url params
      if (level) {
        options.zoom = level;
      }
      return options;
    },

    _setCenter: function (options) {
      var center = this.config.center;
      if (center) {
        var points = center.split(",");
        if (points && points.length === 2) {
          options.center = [parseFloat(points[0]), parseFloat(points[1])];
        }
      }
      return options;
    },

    _setExtent: function (info) {
      var e = this.config.extent;
      //If a custom extent is set as a url parameter handle that before creating the map
      if (e) {
        var extArray = e.split(",");
        var extLength = extArray.length;
        if (extLength === 4) {
          info.item.extent = [
            [parseFloat(extArray[0]), parseFloat(extArray[1])],
            [parseFloat(extArray[2]), parseFloat(extArray[3])]
          ];
        }
      }
      return info;
    }
  });
});