class GondolaMap {


    constructor(globalAppState) {

        const mapWidth = 800
        const mapHeight = 800
        const MARGIN = {
            top: 30,
            right: 30,
            left: 30,
            bottom: 30,
        }
        this.globalAppState = globalAppState


        // setup initial data
        var initData

        const mapSelection = d3.select("#map")

        // bound lat and long of init map to data
        var mapBounds = new google.maps.LatLngBounds()



        // draw initial map with bounds
        var map = this.drawInitMap(mapSelection)

        // get initial bounds to use in drawing towers to know where to draw
        google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
            var bounds = map.getBounds()
            this.drawTowers(globalAppState.towerData, map, bounds)
        })


        // draw initial data onto map
        this.drawInitData(initData, map)
    }

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

        map.addListener('zoom_changed', () => {
            var latBound = map.getBounds().eb
            var longBound = map.getBounds().Ha
            var bounds = {
                latBound: latBound,
                longBound: longBound
            }
            this.onZoomChanged(bounds)
        })
        return map
    }

    drawInitData(mapData, map) {
        var overlay = new google.maps.OverlayView();

        // overlay.onAdd = function() {
        //     var layer = d3.select(this.getPanes().overlayLayer).append("div")
        //         .attr("class", ".tower .station");

        //         overlay.draw = function() {
        //             var projection = this.getProjection(),
        //                 padding = 10;

        //           }
        // }
        // overlay.setMap(map)
    }

    drawTowers(towerData, map, bounds) {

        console.log(bounds)

        var overlay = new google.maps.OverlayView();

        overlay.onAdd = function () {

            overlay.draw = function () {

                function projCalc(projection) {
                    return (lnglat) => {
                        var ret = projection.fromLatLngToDivPixel(new google.maps.LatLng(lnglat[1], lnglat[0]))
                        return [ret.x, ret.y]
                    };
                }

                var projection = projCalc(overlay.getProjection())

                var northWest = projection([bounds.Ha.lo, bounds.eb.lo])
                var southEast = projection([bounds.Ha.hi, bounds.eb.hi])
                var width = Math.abs(southEast[0]) - Math.abs(northWest[0])
                var height = Math.abs(southEast[1]) - Math.abs(northWest[1])

                console.log(northWest)
                console.log(southEast)

                var towerSvg = d3.select(overlay.getPanes().overlayMouseTarget)
                    .append("svg")
                    .style("position", "absolute")
                    .style("top", northWest[1])
                    .style("left", northWest[0])
                    .attr("height", 863)
                    .attr("width", 800);

                towerSvg.selectAll('rect')
                    .data(towerData)
                    .enter()
                    .append("rect")
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr('x', function(d) {console.log(d.long); return projection([d.long, d.lat])[0]})
                    .attr('y', function(d) {return projection([d.long, d.lat])[1]})
            }
        }
        overlay.setMap(map)
    }

    

    onZoomChanged(bounds) {
        console.log(bounds)

    }
}