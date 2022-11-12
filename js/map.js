class GondolaMap {


    constructor(globalAppState) {
        this.globalAppState = globalAppState
        this.towerData = globalAppState.towerData
        this.boulderData = globalAppState.boulderData

        this.drawInitMap(d3.select("#map"))

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
                stylers: [
                    { visibility: "off" }
                ],
            }
        ];

        // initialize map
        var map = new google.maps.Map(selection.node(), {
            zoom: 12.75,
            center: new google.maps.LatLng(40.574215, -111.715113),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControl: true,
            scaleControl: true,
            gestureHandling: "cooperative",
            styles: styling
        })

        // set on zoom changed listener to update data
        map.addListener('zoom_changed', () => {
            // this.drawTowers(map.getBounds(), map.getZoom(), map) 
        })

        this.drawTowers(this.towerData, map)
    }


    drawTowers(data, map) {

        // get an overlay layer to draw d3 elements onto
        const mapOverlay = new google.maps.OverlayView()

        mapOverlay.onAdd = function () {
            // overlayLayer doesn't receive DOM events
            // overlayMouseTarget receives DOM events
            const mapDiv = d3.select(this.getPanes().overlayMouseTarget).append('div')

            mapOverlay.draw = () => {

                // get current projection so lat and long can be converted to x and y coords
                var projection = this.getProjection()

                //  create an svg for each tower to plot the rect onto
                var towerSvgs = mapDiv.selectAll('svg')
                    .data(data)
                    .join('svg')
                    .style('left', d => calcXY(d).x + 'px')
                    .style('top', d => calcXY(d).y + 'px')
                    .attr("class", "mapsvg")
            
                // append rectangles to the svg's
                towerSvgs.append('rect')
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('class', 'tower')
                    .on("mouseover", function (event, d) {
                        console.log('mouse over tower')
                    })


                // convert the lat and long coordinates to x and y coordinates
                function calcXY(d){ 
                    d = projection.fromLatLngToDivPixel(new google.maps.LatLng(d.lat, d.long))
                    return {x : d.x, y : d.y}
                }

            }
        }
        mapOverlay.setMap(map)

    }

}