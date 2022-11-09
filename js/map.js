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
        this.towerData = globalAppState.towerData



        // setup initial data
        var initData

        const mapSelection = d3.select("#map")
        // draw initial map with bounds
        var map = this.drawInitMap(mapSelection)

        // get initial bounds to use in drawing towers to know where to draw
        google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
            var bounds = map.getBounds()
            this.drawTowers(bounds, 13)
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
            this.onZoomChanged(map.getBounds(), map.getZoom())
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

    drawTowers(bounds, zoom) {

        var currData = this.towerData.filter(function (d) {
            return d.long > bounds.Ha.lo && d.long < bounds.Ha.hi
        })

        var width = parseInt(d3.select("#map").style("width"))
        var height = parseInt(d3.select("#map").style("height"))

        var map = d3.select('#map')

        map.selectAll('svg').remove()

        var svg = map.append('svg')
            .attr('width', width)
            .attr('height', height - 100)
            .attr('top', map.style('top'))
            .attr('left', map.style('left'))
            .attr('class', 'mapsvg')

        var transition = svg.transition().duration(10000)

        svg.selectAll('rect')
            .data(currData)
            .join(
                enter => enter.append('rect'),
                update => update,
                exit => exit
                    .call(d => d.transition(transition).remove())
                    .attr("y", 41))
            .attr('x', d => convertToXY(d).y)
            .attr('y', d => convertToXY(d).x)
            .call(d => d.transition(transition))
            .attr('width', (zoom * 0.7))
            .attr('height', (zoom * 0.7))
            .attr('class', 'tower')


        function convertToXY(d) {

            var width = parseFloat(d3.select("#map").style("width"))
            var height = parseFloat(d3.select("#map").style("height"))

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



    onZoomChanged(bounds, zoom) {
        this.drawTowers(bounds, zoom)

    }
}