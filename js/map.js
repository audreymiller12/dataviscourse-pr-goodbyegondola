class GondolaMap{


    constructor(globalAppState){

        const mapWidth = 800
        const mapHeight = 800
        const MARGIN = {
            top: 30,
            right: 30,
            left : 30,
            bottom: 30,
        }
        this.globalAppState = globalAppState

 
        // setup initial data
        var initData


        const mapSelection = d3.select("#map")

        // bound lat and long of init map to data
        var mapBounds = new google.maps.LatLngBounds()
    

        // loop to find the lat and long of the data.

        // draw initial map with bounds
        var map = this.drawInitMap(mapSelection, mapBounds)

        // draw initial data onto map
        this.drawInitData(initData, map)
    }

    drawInitMap(selection, mapBounds){
        return new google.maps.Map(selection.node(), {
            zoom: 15,
            // change to mapBounds
            center: new google.maps.LatLng(40.574215, -111.715113),
            mapTypeId: google.maps.MapTypeId.TERRAIN
          });
    }

    drawInitData(mapData, map){
        var overlay = new google.maps.OverlayView();

        // overlay.onAdd = function() {
        //     var layer = d3.select(this.getPanes().overlayLayer).append("div")
        //         .attr("class", ".tower .station");

        //         overlay.draw = function() {
        //             var projection = this.getProjection(),
        //                 padding = 10;
              
        //           }
        // }
         overlay.setMap(map)
    }
}