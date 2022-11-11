class GondolaMap {


    constructor(globalAppState) {
        this.globalAppState = globalAppState
        this.towerData = globalAppState.towerData
        this.boulderData = globalAppState.boulderData


        const mapSelection = d3.select("#map")
        // draw initial map with bounds
        var map = this.drawInitMap(mapSelection)

        // get initial bounds to use in drawing towers to know where to draw
        google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
            var bounds = map.getBounds()
            this.drawTowers(bounds, 13, map)
        })

    }

    /**
     * 
     * @param selection div selection to draw map onto 
     * @returns current map selection
     */
    drawInitMap(selection) {

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
            zoom: 13,
            center: new google.maps.LatLng(40.574215, -111.715113),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControl: true,
            scaleControl: true,
            gestureHandling: "cooperative",
            styles: styling
        })

        // set on zoom changed listener to update data
        map.addListener('zoom_changed', () => {
            this.drawTowers(map.getBounds(), map.getZoom(), map)
        })
        return map
    }


    drawTowers(bounds, zoom, map) {

        var currTowerData = this.towerData.filter(function (d) {
            return d.long > bounds.Ha.lo && d.long < bounds.Ha.hi
        })

        // var currTowerData = this.boulderData.filter(function (d) {
        //     if(d.long && d.lat){
        //         return d.long > bounds.Ha.lo && d.long < bounds.Ha.hi
        //     }else if(d.children.long && d.children.lat){
        //         return d.children.long > bounds.Ha.lo && d.children.long < bounds.Ha.hi
        //     }
        // })

        var width = parseInt(d3.select("#map").style("width"))
        var height = parseInt(d3.select("#map").style("height"))

        const overlay = new google.maps.OverlayView()

        overlay.onAdd = function () {
            const layer = d3.select(this.getPanes().overlayLayer).append('div').style('position', 'absolute')
                .attr('id', 'overlay')

            overlay.draw = function () {
                var projection = overlay.getProjection()
                var svg = layer.selectAll('svg')
                    .data(currTowerData)
                    .join('svg')
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('transform', d => 'translate('+ (convertToXY(d).x) + ',' + (convertToXY(d).y)+ ')')


                svg.append('rect')
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('class', 'tower')


                   
                function convertToXY(d) {
                    d = projection.fromLatLngToDivPixel(new google.maps.LatLng(d.lat,d.long))  

                    var coords = {
                        x: d.x,
                        y: d.y
                    }
                    return coords
                }
            }
        }
        overlay.setMap(map)

    }

}