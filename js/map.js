class Map{
    constructor(globalAppState){
        this.globalAppState = globalAppState

        // Create the Google Map…

        let center = new google.maps.LatLng(37.76487, -122.41948)
        const overlay = new google.maps.OverlayView();

        let map = new google.maps.Map(d3.select("#map").node(), {
            zoom: 10,
            center: center, 
            draggable: true,  
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });
    }
}