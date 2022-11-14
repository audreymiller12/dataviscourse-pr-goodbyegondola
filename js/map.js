class GondolaMap {


    constructor(globalAppState) {
        this.globalAppState = globalAppState
        this.towerData = globalAppState.towerData
        this.boulderData = globalAppState.boulderData
        this.boulderNames = globalAppState.boulderNames
        this.bouldersEnabled = true
        this.towersEnabled = true
        this.areasEnabled = true

        this.affectedBoulders = this.filterAffectedBoulders()

        this.climbingAreas = this.filterClimbingAreas()

        this.drawInitMap(d3.select("#map"))
        this.drawLegend(d3.select('#map'))
        this.drawLayerEnabler(d3.select('#map'))

    }

    drawLayerEnabler(map) {
        var height = parseFloat(map.style('height'))

        var layerEnabler = map.append('div')
            .style('width', '12vw')
            .style('height', '55px')
            .attr('class', 'legend')
            .style('top', (height - 100) + 'px')
            .style('left', '5px')

        layerEnabler.append('a')
            .style('width', '15px')
            .style('height', '15px')
            .style('transform', 'translate(15px,28px)')
            .attr('id', 'towerEnable')
            .append('i')
            .attr('class', 'fa-solid fa-eye')


        var enablerSvg = layerEnabler.append('svg')
            .attr('width', '12vw')
            .attr('class', 'mapsvg')
            .attr('height', '55')
            .attr('id', 'legend')

        enablerSvg.append('text')
            .text('Layers: ')
            .attr('class', 'h1')
            .attr('x', 10)
            .attr('y', 20)

        var towerG = enablerSvg.append('g')
            .attr('width', '50')
            .attr('height', '20')
            .attr('transform', 'translate(20,30)')

        towerG.append('text')
            .text('towers')
            .attr('transform', 'translate(5,13)')


        document.addEventListener('click', (event, map) => this.removeLayers(event, map))


    }

    removeLayers(event, map) {
        switch (event.path[1].id) {
            case 'towerEnable':
                this.towersEnabled = !this.towersEnabled
                this.drawTowers(this.towerData, map, this.towersEnabled)
            default:
                return
        }
    }

    drawLegend(map) {

        var width = parseFloat(map.style('width'))

        var legendDiv = map.append('div')
            .attr('class', 'legend')
            .style('left', (width - 120) + 'px')

        var legend = legendDiv.append('svg')
            .attr('width', '10vw')
            .attr('class', 'mapsvg')
            .attr('height', '130px')
            .attr('id', 'legend')

        legend
            .append('text')
            .text('Legend: ')
            .attr('class', 'h1')
            .attr('x', 10)
            .attr('y', 20)

        var gondolaG = legend.append('g')
            .attr('width', 165)
            .attr('height', 20)
            .attr('transform', 'translate(5,45)')

        gondolaG
            .append('rect')
            .attr('class', 'tower')
            .attr('width', 10)
            .attr('height', 10)
            .attr('transform', 'translate(13,-10)')

        gondolaG
            .append('text')
            .text('- Gondola Tower')
            .attr('class', 'h1')
            .attr('x', 30)

        var areaG = legend.append('g')
            .attr('width', 165)
            .attr('height', 20)
            .attr('transform', 'translate(5,80)')

        areaG
            .append('rect')
            .attr('class', 'area')
            .attr('width', 10)
            .attr('height', 10)
            .attr('transform', 'translate(13,-10)')

        areaG
            .append('text')
            .text('- Climbing Area')
            .attr('class', 'h1')
            .attr('x', 30)

        var boulderG = legend.append('g')
            .attr('width', 165)
            .attr('height', 20)
            .attr('transform', 'translate(5,115)')

        boulderG
            .append('circle')
            .attr('class', 'boulder')
            .attr('r', 6)
            .attr('transform', 'translate(18,-5)')

        boulderG
            .append('text')
            .text('- Boulder')
            .attr('class', 'h1')
            .attr('x', 30)


    }

    filterClimbingAreas() {
        // get all of the children of the main areas
        var children = this.boulderData.children
        var childrenAreas = []
        children.forEach(child => {
            if (child.children) {
                childrenAreas.push(child)
            }

        })

        return children
    }
    /**
     * 
     * @returns This method returns the affected boulders from the boulder data
     */
    filterAffectedBoulders() {
        var namelist = []
        this.boulderNames.forEach(d => {
            namelist.push(d.name)
        })

        // get all of the children of the main areas
        var children = this.boulderData.children
        var childrenAreas = []
        children.forEach(child => {
            if (child.children) {
                child.children.forEach(d => {
                    childrenAreas.push(d)
                    if (d.children) {
                        d.children.forEach(f => {
                            childrenAreas.push(f)
                        })
                    }
                })
            }

        })

        // filter if the name of the boulder matches an affected one
        var affectedBoulders = childrenAreas.filter(function (d) {
            return namelist.includes(d.name)
        })

        return affectedBoulders
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
            //this.drawArea(this.climbingAreas, map) 
        })
        this.drawArea(this.climbingAreas, map)
        this.drawTowers(this.towerData, map, true)
        this.drawBoulders(this.affectedBoulders, map)
    }


    drawTowers(towerData, map, enabled) {

        // get an overlay layer to draw d3 elements onto
        const mapOverlay = new google.maps.OverlayView()

        mapOverlay.onAdd = function () {
            // overlayLayer doesn't receive DOM events
            // overlayMouseTarget receives DOM events
            const mapDiv = d3.select(this.getPanes().overlayMouseTarget).append('div').attr('id', 'towerDiv')

            mapOverlay.draw = () => {
                // get current projection so lat and long can be converted to x and y coords
                var projection = this.getProjection()

                //  create an svg for each tower to plot the rect onto
                var towerSvgs = mapDiv.selectAll('svg')
                    .data(enabled ? towerData: [])
                    .join('svg')
                    .style('left', d => calcXY(d).x + 'px')
                    .style('top', d => calcXY(d).y + 'px')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr("class", "mapsvg")

                towerSvgs.selectAll('rect').remove()

                // Attach tooltip
                let tooltip = d3.select('#towertooltip')
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style('z-index', 120)
                    .style('display', 'none')


                // append rectangles to the svg's
                towerSvgs.append('rect')
                    .attr('width', 12)
                    .attr('height', 12)
                    .attr('class', 'tower')
                    .on("mouseover", function (event, d) {
                        // Black outline 
                        d3.select(this)
                            .style("stroke", "black")
                            .style("stroke-width", "3px")

                        // Make tooltip visible
                        tooltip
                            .style("opacity", 0.8)
                            .style('display', 'block')


                        tooltip
                            .html('Tower: ' + d.towerID)
                            .style("left", (event.pageX + 20) + "px")
                            .style("top", (event.pageY - 20) + "px")
                    })
                    .on("mouseleave", function (event, d) {
                        d3.select(this)
                            .style("stroke-width", "1px")

                        tooltip
                            .style("opacity", 0)
                            .style('display', 'none')

                    })
                    .on('click', function (event, d) {
                        map.setCenter(new google.maps.LatLng(d.lat, d.long))
                        map.setZoom(16)
                    })



                var lineSvgs = mapDiv.selectAll('svg')

                // convert the lat and long coordinates to x and y coordinates
                function calcXY(d) {
                    d = projection.fromLatLngToDivPixel(new google.maps.LatLng(d.lat, d.long))
                    return { x: d.x, y: d.y }
                }


            }
        }
        mapOverlay.setMap(map)

    }

    drawBoulders(boulderData, map) {

        // get an overlay layer to draw d3 elements onto
        const mapOverlay = new google.maps.OverlayView()

        mapOverlay.onAdd = function () {
            // overlayLayer doesn't receive DOM events
            // overlayMouseTarget receives DOM events
            const mapDiv = d3.select(this.getPanes().overlayMouseTarget).append('div')

            mapOverlay.draw = () => {

                // get current projection so lat and long can be converted to x and y coords
                var projection = this.getProjection()

                var boulderSvgs = mapDiv.selectAll('svg')
                    .data(boulderData)
                    .join('svg')
                    .style('left', d => calcXY(d).x + 'px')
                    .style('top', d => calcXY(d).y + 'px')
                    .attr('width', 15)
                    .attr('height', 15)
                    .attr("class", "mapsvg")

                boulderSvgs.selectAll('circle').remove()

                let tooltip = d3.select('#bouldertooltip')
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style('z-index', 120)
                    .style('display', 'none')
                // append rectangles to the svg's
                boulderSvgs.append('circle')
                    .attr('r', 7)
                    .attr('cx', 7.5)
                    .attr('cy', 7.5)
                    .attr('class', 'boulder')
                    .on("mouseover", function (event, d) {
                        // Black outline 
                        d3.select(this)
                            .style("stroke", "black")
                            .style("stroke-width", "3px")

                        // Make tooltip visible
                        tooltip
                            .style("opacity", 0.8)
                            .style('display', 'block')

                        tooltip
                            .html('Boulder: ' + d.name)
                            .style("left", (event.pageX + 20) + "px")
                            .style("top", (event.pageY - 20) + "px")
                    })
                    .on("mouseleave", function (event, d) {
                        d3.select(this)
                            .style("stroke-width", "1px")

                        tooltip
                            .style("opacity", 0)
                            .style('display', 'none')
                    })
                    .on('click', function (event, d) {
                        map.setCenter(new google.maps.LatLng(d.lat, d.long))
                        map.setZoom(16)
                    })


                // convert the lat and long coordinates to x and y coordinates
                function calcXY(d) {
                    d = projection.fromLatLngToDivPixel(new google.maps.LatLng(d.lat, d.long))
                    return { x: d.x, y: d.y }
                }

            }
        }
        mapOverlay.setMap(map)

    }



    drawArea(climbingAreas, map) {

        console.log(map.getZoom())
        // get an overlay layer to draw d3 elements onto
        const mapOverlay = new google.maps.OverlayView()

        mapOverlay.onAdd = function () {
            // overlayLayer doesn't receive DOM events
            // overlayMouseTarget receives DOM events
            const mapDiv = d3.select(this.getPanes().overlayMouseTarget).append('div').attr('id', 'areas')

            mapOverlay.draw = () => {

                // get current projection so lat and long can be converted to x and y coords
                var projection = this.getProjection()

                var areaSvgs = mapDiv.selectAll('svg')
                    .data(climbingAreas)
                    .join('svg')
                    .style('left', d => calcXY(d).x + 'px')
                    .style('top', d => calcXY(d).y + 'px')
                    .attr('width', (3 * map.getZoom()))
                    .attr('height', (2 * map.getZoom()))
                    .attr("class", "mapsvg")

                areaSvgs.selectAll('rect').remove()

                let tooltip = d3.select('#areatooltip')
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style('z-index', 120)
                    .style('display', 'none')
                // append rectangles to the svg's
                areaSvgs.append('rect')
                    .attr('width', (3 * map.getZoom()))
                    .attr('height', (2 * map.getZoom()))
                    .attr('class', 'area')
                    .on("mouseover", function (event, d) {
                        // Black outline 
                        d3.select(this)
                            .style("stroke", "black")
                            .style("stroke-width", "3px")

                        // Make tooltip visible
                        tooltip
                            .style("opacity", 0.8)
                            .style('display', 'block')

                        tooltip
                            .html('Area: ' + d.name)
                            .style("left", (event.pageX + 20) + "px")
                            .style("top", (event.pageY - 20) + "px")
                    })
                    .on("mouseleave", function (event, d) {
                        d3.select(this)
                            .style('stroke', 'rgba(95, 158, 160, 0.447')
                            .style('stroke-width', '3px')

                        tooltip
                            .style("opacity", 0)
                            .style('display', 'none')
                    })
                    .on('click', function (event, d) {
                        map.setCenter(new google.maps.LatLng(d.lat, d.long))
                        map.setZoom(16)
                    })



                // convert the lat and long coordinates to x and y coordinates
                function calcXY(d) {
                    d = projection.fromLatLngToDivPixel(new google.maps.LatLng(d.lat, d.long))
                    return { x: d.x, y: d.y }
                }

            }
        }
        mapOverlay.setMap(map)

    }

}