/**************************************************
 * This class represents the map portion of the
 * Goodbye Gondola Visualization. It utilizes a
 * google maps API for Javascript to plot the
 * data on the map.
 *
 * Written by: Marni Epstein, Audrey Miller and
 * Michael Eyer
 *
 * Date: Novemeber 2022
 *
 * Course: Introduction to Data Visualization
 *                  (CS5630/CS6630)
 *
 * Code for map overlay data addition adapated from
 * Mike Bostock's example found here:
 *                    ||||
 * https://bl.ocks.org/mbostock/899711
 *                    ||||
 * Utilized in plotting boulders, areas, and towers.
 *
 **************************************************/

class GondolaMap {
  constructor(globalAppState) {
    // set global variables to use throughout the code
    this.globalAppState = globalAppState;
    this.towerData = globalAppState.towerData;
    this.boulderData = globalAppState.boulderData;

    // get the affected boulders and climbing areas
    this.affectedBoulders = this.filterAffectedBoulders();
    this.climbingAreas = this.filterClimbingAreas();

    // draw map and legend
    this.drawInitMap(d3.select("#map"));
    this.drawLegend(d3.select("#map"));
  }

  /***
   * Create a legend to categorize each data point
   */
  drawLegend(map) {
    var width = parseFloat(map.style("width"));

    var legendDiv = map
      .append("div")
      .attr("class", "legend")
      .style("left", width - 400 + "px");

    var legend = legendDiv
      .append("svg")
      .attr("width", "12vw")
      .attr("class", "mapsvg")
      .attr("height", "130px")
      .attr("id", "legend");

    legend
      .append("text")
      .text("Legend: ")
      .attr("class", "h1")
      .attr("x", 10)
      .attr("y", 20);

    var gondolaG = legend
      .append("g")
      .attr("width", 165)
      .attr("height", 20)
      .attr("transform", "translate(5,45)");

    gondolaG
      .append("circle")
      .attr("r", 10)
      .attr("transform", "translate(19,-4)")
      .attr("opacity", 0.5)
      .attr("class", "tower");

    gondolaG
      .append("rect")
      .attr("class", "tower")
      .attr("width", 12)
      .attr("height", 12)
      .attr("transform", "translate(13,-10)");

    gondolaG
      .append("text")
      .text("- Gondola Tower")
      .attr("class", "h1")
      .attr("x", 30);

    var areaG = legend
      .append("g")
      .attr("width", 165)
      .attr("height", 20)
      .attr("transform", "translate(5,80)");

    areaG
      .append("rect")
      .attr("class", "area")
      .attr("width", 10)
      .attr("height", 10)
      .attr("transform", "translate(13,-10)");

    areaG
      .append("text")
      .text("- Climbing Area")
      .attr("class", "h1")
      .attr("x", 30);

    var boulderG = legend
      .append("g")
      .attr("width", 165)
      .attr("height", 20)
      .attr("transform", "translate(5,115)");

    boulderG
      .append("circle")
      .attr("class", "boulder")
      .attr("r", 6)
      .attr("transform", "translate(18,-5)");

    boulderG
      .append("text")
      .text("- Affected Boulder")
      .attr("class", "h1")
      .attr("x", 30);
  }

  /***
   * Method to filter out climbing areas from total data
   */
  filterClimbingAreas() {
    // get all of the children of the main areas
    var children = this.boulderData.children;
    var childrenAreas = [];
    children.forEach((child) => {
      if (child.children) {
        childrenAreas.push(child);
      }
    });

    return children;
  }

  /**
   *
   * @returns This method returns the affected boulders from the boulder data based on lat and long
   * coordinates, and their proximity to condola towers
   */
  filterAffectedBoulders() {
    // get lat and long of towers
    var towerLatLongList = [];
    this.towerData.forEach((d) => {
      towerLatLongList.push({ lat: d.lat, long: d.long });
    });

    // get all of the children of the main areas
    var children = this.boulderData.children;
    var childrenAreas = [];
    children.forEach((child) => {
      if (child.children) {
        child.children.forEach((d) => {
          if (d.children) {
            childrenAreas.push(d);
          }
        });
      }
    });

    var affectedBoulders = [];
    // check if the boulder is in the bounds of a tower
    childrenAreas.forEach(function (d) {
      towerLatLongList.forEach((t) => {
        if (
          Number(d.lat).toPrecision(6) >
            Number(parseFloat(t.lat)).toPrecision(6) - 0.0005 &&
          Number(d.lat).toPrecision(6) <
            Number(parseFloat(t.lat)).toPrecision(6) + 0.0005
        ) {
          if (
            Number(d.long).toPrecision(6) >
              Number(parseFloat(t.long)).toPrecision(6) - 0.0005 &&
            Number(d.long).toPrecision(6) <
              Number(parseFloat(t.long)).toPrecision(6) + 0.0005
          ) {
            if (affectedBoulders.indexOf(d) === -1) {
              affectedBoulders.push(d);
            }
          }
        }
      });
    });
    return affectedBoulders;
  }

  /**
   *
   * @param selection div selection to draw map onto
   * @returns current map selection
   */
  drawInitMap(selection) {
    // Styling to remove some of the google maps interest points
    var styling = [
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
    ];

    // initialize map
    const map = new google.maps.Map(selection.node(), {
      zoom: 12,
      center: new google.maps.LatLng(40.574215, -111.715113),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoomControl: true,
      scaleControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: "cooperative",
      styles: styling,
    });

    this.map = map;

    // draw graphic on the map
    this.drawArea(this.climbingAreas, map);
    this.drawTowers(this.towerData, map);
    this.drawBoulders(this.affectedBoulders, map);

    // extract initial settings for resetting to all areas
    this.initCenter = map.getCenter();
    this.initZoom = map.getZoom();

    const boulderData = this.boulderData;
    const appState = this.globalAppState;

    this.attachDragEnd(boulderData, appState, map);
    // when drag is started, we must turn toggle and disable area selection
    google.maps.event.addListener(map, "drag", function () {
      appState.infoInstance.changeToggle();
    });

    this.attachZoomChanged(boulderData, appState, map);
  }

  /***
   * Attaches an event listener for panning on the map
   * Once the data is filtered to the pan selection, the info
   * panel is reloaded with the new data
   */
  attachDragEnd(boulderData, appState, map) {
    // add listener to the zoom button to detect user zoom
    google.maps.event.addListener(map, "dragend", function () {
      var children = boulderData.children;
      var secondChildren = [];
      var bounds = map.getBounds();
      var inBoundData = [];

      children.forEach((child) => {
        secondChildren.push(child);
      });
      secondChildren.forEach((d) => {
        if (d.lat > bounds.getSouthWest().lat() && d.lat < bounds.getNorthEast().lat()) {
            if (d.long > bounds.getSouthWest().lng() && d.long < bounds.getNorthEast().lng()) {
              inBoundData.push(d);
            }
          }
      });

      // get all of the boulders in the in bounds areas, need to un-nest
      var childrenAreas = [];
      inBoundData.forEach((child) => {
        if (child.children) {
          child.children.forEach((d) => {
            if (d.children) {
              d.children.forEach((childsChild) => {
                if (childsChild.children) {
                  childsChild.children.forEach((thirdChild) => {
                    if (thirdChild.children) {
                      thirdChild.children.forEach((fourthChild) => {
                        childrenAreas.push(fourthChild);
                      });
                    } else {
                      childrenAreas.push(thirdChild);
                    }
                  });
                } else {
                  childrenAreas.push(childsChild);
                }
              });
            } else {
              childrenAreas.push(d);
            }
          });
        } else {
          childrenAreas.push(child);
        }
      });

      appState.infoInstance.drawInfoFlattened(childrenAreas);
    });
  }

  /***
   * Attaches an event listener for zooming on the map
   * Once the data is filtered to the pan selection, the info
   * panel is reloaded with the new data
   */
  attachZoomChanged(boulderData, appState, map) {
    // attach zoom after map is loaded to avoid initial load zoom
    google.maps.event.addListener(map, "tilesloaded", function () {
      google.maps.event.addListener(map, "zoom_changed", function () {
        if (map.getZoom() != 19) {
          var children = boulderData.children;
          var secondChildren = [];
          var bounds = map.getBounds();

          var inBoundData = [];

          children.forEach((child) => {
            secondChildren.push(child);
          });
          secondChildren.forEach((d) => {
            if (d.lat > bounds.getSouthWest().lat() && d.lat < bounds.getNorthEast().lat()) {
              if (d.long > bounds.getSouthWest().lng() && d.long < bounds.getNorthEast().lng()) {
                inBoundData.push(d);
              }
            }
          });

          // get all of the boulders in the in bounds areas, need to un-nest
          var childrenAreas = [];
          inBoundData.forEach((child) => {
            if (child.children) {
              child.children.forEach((d) => {
                if (d.children) {
                  d.children.forEach((childsChild) => {
                    if (childsChild.children) {
                      childsChild.children.forEach((thirdChild) => {
                        if (thirdChild.children) {
                          thirdChild.children.forEach((fourthChild) => {
                            childrenAreas.push(fourthChild);
                          });
                        } else {
                          childrenAreas.push(thirdChild);
                        }
                      });
                    } else {
                      childrenAreas.push(childsChild);
                    }
                  });
                } else {
                  childrenAreas.push(d);
                }
              });
            } else {
              childrenAreas.push(child);
            }
          });

          if(map.getZoom() != 12){
            appState.infoInstance.changeToggleInit();
          }
          appState.infoInstance.drawInfoFlattened(childrenAreas);
        }
      });
    });
  }

  /***
   * Draw the tower graphics on the map overlay
   */
  drawTowers(towerData, map) {
    // get an overlay layer to draw d3 elements onto
    const mapOverlay = new google.maps.OverlayView();
    mapOverlay.setMap(null);

    mapOverlay.onAdd = function () {
      // overlayLayer doesn't receive DOM events
      // overlayMouseTarget receives DOM events
      const mapDiv = d3
        .select(this.getPanes().overlayMouseTarget)
        .append("div")
        .attr("id", "towerDiv");

      mapOverlay.draw = () => {
        // get current projection so lat and long can be converted to x and y coords
        var projection = this.getProjection();

        //  create an svg for each tower to plot the rect onto
        var towerSvgs = mapDiv
          .selectAll("svg")
          .data(towerData)
          .join("svg")
          .style("left", (d) => calcXY(d).x + "px")
          .style("top", (d) => calcXY(d).y + "px")
          .attr("width", 20)
          .attr("height", 20)
          .attr("class", "mapsvg");

        towerSvgs.selectAll("rect").remove();
        towerSvgs.selectAll("circle").remove();

        // Attach tooltip
        let tooltip = d3
          .select("#towertooltip")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("z-index", 120)
          .style("display", "none");

        towerSvgs
          .append("circle")
          .attr("r", 10)
          .attr("cx", 10)
          .attr("cy", 10)
          .attr("opacity", 0.5)
          .attr("class", "tower");

        // append rectangles to the svg's
        towerSvgs
          .append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("x", 4)
          .attr("y", 4)
          .attr("class", "tower")
          .on("mouseover", function (event, d) {
            // Black outline
            d3.select(this)
              .style("stroke", "black")
              .style("stroke-width", "3px");

            // Make tooltip visible
            tooltip.style("opacity", 0.8).style("display", "block");

            tooltip
              .html(
                "Gondola Tower: " +
                  d.towerID +
                  "<br>" +
                  "Location: (" +
                  d.lat +
                  ", " +
                  d.long +
                  ")"
              )
              .style("left", event.pageX + 20 + "px")
              .style("top", event.pageY - 20 + "px");
          })
          .on("mouseleave", function (event, d) {
            d3.select(this).style("stroke-width", "1px");

            tooltip.style("opacity", 0).style("display", "none");
          })
          .on("click", function (event, d) {
            map.setCenter(new google.maps.LatLng(d.lat, d.long));
            map.setZoom(16);
          });

        // convert the lat and long coordinates to x and y coordinates
        function calcXY(d) {
          d = projection.fromLatLngToDivPixel(
            new google.maps.LatLng(d.lat, d.long)
          );
          return { x: d.x, y: d.y };
        }
      };
    };
    mapOverlay.setMap(map);
  }

  /***
   * Draws boulders on the map overlay
   */
  drawBoulders(boulderData, map) {
    // get an overlay layer to draw d3 elements onto
    const mapOverlay = new google.maps.OverlayView();

    mapOverlay.onAdd = function () {
      // overlayLayer doesn't receive DOM events
      // overlayMouseTarget receives DOM events
      const mapDiv = d3
        .select(this.getPanes().overlayMouseTarget)
        .append("div")
        .attr("id", "areasDiv");

      mapOverlay.draw = () => {
        // get current projection so lat and long can be converted to x and y coords
        var projection = this.getProjection();

        var boulderSvgs = mapDiv
          .selectAll("svg")
          .data(boulderData)
          .join("svg")
          .style("left", (d) => calcXY(d).x + "px")
          .style("top", (d) => calcXY(d).y + "px")
          .attr("width", 15)
          .attr("height", 15)
          .attr("class", "mapsvg");

        boulderSvgs.selectAll("circle").remove();

        let tooltip = d3
          .select("#bouldertooltip")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("z-index", 120)
          .style("display", "none");
        // append rectangles to the svg's
        boulderSvgs
          .append("circle")
          .attr("r", 7)
          .attr("cx", 7.5)
          .attr("cy", 7.5)
          .attr("class", "boulder")
          .on("mouseover", function (event, d) {
            // Black outline
            d3.select(this)
              .style("stroke", "black")
              .style("stroke-width", "3px");

            // Make tooltip visible
            tooltip.style("opacity", 0.8).style("display", "block");

            tooltip
              .html(
                "Boulder Name: " +
                  d.name +
                  "<br>" +
                  "Location: (" +
                  d.lat +
                  ", " +
                  d.long +
                  ")" +
                  "<br>" +
                  "Total Boulder Views: " +
                  d.totalViews
              )
              .style("left", event.pageX + 20 + "px")
              .style("top", event.pageY - 20 + "px");
          })
          .on("mouseleave", function (event, d) {
            d3.select(this).style("stroke-width", "1px");

            tooltip.style("opacity", 0).style("display", "none");
          })
          .on("click", function (event, d) {
            map.setCenter(new google.maps.LatLng(d.lat, d.long));
            map.setZoom(16);
          });

        // convert the lat and long coordinates to x and y coordinates
        function calcXY(d) {
          d = projection.fromLatLngToDivPixel(
            new google.maps.LatLng(d.lat, d.long)
          );
          return { x: d.x, y: d.y };
        }
      };
    };
    mapOverlay.setMap(map);
  }

  /***
   * Draws areas on the map overlay
   */
  drawArea(climbingAreas, map, areaName) {
    const appState = this.globalAppState;

    // get an overlay layer to draw d3 elements onto
    const mapOverlay = new google.maps.OverlayView();

    mapOverlay.onAdd = function () {
      // overlayLayer doesn't receive DOM events
      // overlayMouseTarget receives DOM events
      const mapDiv = d3
        .select(this.getPanes().overlayMouseTarget)
        .append("div")
        .attr("id", "areas");

      mapOverlay.draw = () => {
        // get current projection so lat and long can be converted to x and y coords
        var projection = this.getProjection();

        var areaSvgs = mapDiv
          .selectAll("svg")
          .data(climbingAreas)
          .join("svg")
          .style("left", (d) => calcXY(d).x + "px")
          .style("top", (d) => calcXY(d).y + "px")
          .attr("width", 3 * map.getZoom())
          .attr("height", 2 * map.getZoom())
          .attr("class", "mapsvg");

        areaSvgs.selectAll("rect").remove();

        let tooltip = d3
          .select("#areatooltip")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("z-index", 120)
          .style("display", "none");

        // append rectangles to the svg's
        areaSvgs
          .append("rect")
          .attr("width", 3 * map.getZoom())
          .attr("height", 2 * map.getZoom())
          .attr("class", (d) => (d.name === areaName ? "selectedArea" : "area"))
          .on("mouseover", function (event, d) {
            // Black outline
            d3.select(this)
              .style("stroke", "black")
              .style("stroke-width", "3px");

            // Make tooltip visible
            tooltip.style("opacity", 0.8).style("display", "block");

            tooltip
              .html(
                "Area Name: " +
                  d.name +
                  "<br>" +
                  "Location: (" +
                  d.lat +
                  ", " +
                  d.long +
                  ")" +
                  "<br>" +
                  "Total Area Views: " +
                  d.totalViews
              )
              .style("left", event.pageX + 20 + "px")
              .style("top", event.pageY - 20 + "px");
          })
          .on("mouseleave", function (event, d) {
            d3.select(this)
              .style("stroke", "rgba(95, 158, 160, 0.447")
              .style("stroke-width", "3px");

            tooltip.style("opacity", 0).style("display", "none");
          })
          .on("click", function (event, d) {
            map.setCenter(new google.maps.LatLng(d.lat, d.long));
            map.setZoom(19);
            appState.infoInstance.areaSelected(d);
          });

        // convert the lat and long coordinates to x and y coordinates
        function calcXY(d) {
          d = projection.fromLatLngToDivPixel(
            new google.maps.LatLng(d.lat, d.long)
          );
          return { x: d.x, y: d.y };
        }
      };
    };
    mapOverlay.setMap(map);
  }

  /***
   * Method used by info to snap to an area on the map
   * when the selection is changed in the menu
   */
  selectArea(area) {
    this.map.setCenter(new google.maps.LatLng(area.lat, area.long));
    this.map.setZoom(19);
  }

  /***
   * Reset the map view back to the original settings so that all areas
   * are within the view
   */
  resetMap() {
    this.map.setCenter(this.initCenter);
    this.map.setZoom(this.initZoom);
  }

  /***
   * If the toggle is switched back to map view,
   * get the data in the view window and resend it
   * to the info panel
   */
  changeBackToMapView() {
    var children = this.boulderData.children;
    var secondChildren = [];
    var bounds = this.map.getBounds();
    var inBoundData = [];

    children.forEach((child) => {
      secondChildren.push(child);
    });
    secondChildren.forEach((d) => {
      if (d.lat > bounds.Za.lo && d.lat < bounds.Za.hi) {
        if (d.long > bounds.Ia.lo && d.long < bounds.Ia.hi) {
          inBoundData.push(d);
        }
      }
    });

    // get all of the boulders in the in bounds areas, need to un-nest
    var childrenAreas = [];
    inBoundData.forEach((child) => {
      if (child.children) {
        child.children.forEach((d) => {
          if (d.children) {
            d.children.forEach((childsChild) => {
              if (childsChild.children) {
                childsChild.children.forEach((thirdChild) => {
                  if (thirdChild.children) {
                    thirdChild.children.forEach((fourthChild) => {
                      childrenAreas.push(fourthChild);
                    });
                  } else {
                    childrenAreas.push(thirdChild);
                  }
                });
              } else {
                childrenAreas.push(childsChild);
              }
            });
          } else {
            childrenAreas.push(d);
          }
        });
      } else {
        childrenAreas.push(child);
      }
    });

    this.globalAppState.infoInstance.drawInfoFlattened(childrenAreas);
  }
}
