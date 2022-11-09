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

        var width = parseInt(d3.select("#map").style("width"))
        var height = parseInt(d3.select("#map").style("height"))

        var map = d3.select('#map')
        var svg = map.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('top', map.style('top'))
            .attr('left', map.style('left'))
            .attr('class', 'mapsvg')

        svg.selectAll('rect')
            .data(towerData)
            .enter()
            .append('rect')
            .attr('x', d => convertToXY(d).y)
            .attr('y', d => convertToXY(d).x)
            .attr('width', 10)
            .attr('height', 10)
            .attr('class', 'tower')

        function convertToXY(d) {

            var width = parseInt(d3.select("#map").style("width"))
            var height = parseInt(d3.select("#map").style("height"))

            var xDiff = Math.abs(bounds.eb.hi - bounds.eb.lo)
            var yDiff = Math.abs(bounds.Ha.hi - bounds.Ha.lo)

            var xScale = height / xDiff
            var yScale = width / yDiff

            var xLatDiff = Math.abs(d.lat - bounds.eb.hi) * xScale
            var yLongDiff = Math.abs(d.long - bounds.Ha.lo) * yScale

            var coords = {
                x: xLatDiff,
                y: yLongDiff
            }
            return coords
        }

    }



    onZoomChanged(bounds) {
        console.log(bounds)

    }
}