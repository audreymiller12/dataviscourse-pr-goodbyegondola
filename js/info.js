class InfoCard{
    constructor(globalAppState) {

        this.globalAppState = globalAppState;
        this.boulderData = globalAppState.boulderData;

        // Affected bouldering areas
        this.affectedBoulderAreas = this.filterAffectedBoulders();

        // Flattened list of affected boulder problems
        this.affectedBoulders = [];
        this.affectedBoulderAreas.forEach(level => {
            this.flattenAffectedBoulders(level);
        })
        
        
        // Margins for small charts
        this.margin = {left: 30, bottom: 20 , top:10};
        this.chart_height = 250 ; // Also check CSS
        this.chart_width = 500 ;

        // Create the info card
        this.drawInfoCard(this.boulderData);

        // Create drop down menu of areas and attach event listener
        this.createDropDown();
        this.selectAreas();
        this.toggle();


    }

    // Create infocard
    drawInfoCard(areaData) {

        // Create a list of boulders from the nested area/boulder object
        this.boulders = [] ;
        this.flattenBoulders(areaData);

        // Add property on whether each boulder problem is in the affected list
        this.boulders.map(boulder => {
            boulder.affected = this.affectedBoulders.includes(boulder) ? true : false
        }) 


        // Call each of the views on the boulder dataset
        this.totalAffected();
        this.bouldersArea();

        // Sort data by rating (default sort) and call table with boulder data
        this.boulders.sort((a,b) => {
            if (a.avgRating === b.avgRating) {
                return (a.totalViews) > (b.totalViews) ? -1 : 1
            } else {
                return (a.avgRating) > (b.avgRating) ? -1 : 1
            }
        })

        // Draw table
        this.globalAppState.tableViz.drawTable(this.boulders);

    }

    // Function that creates an object containing all boulder problems from the nested area/boulder object
    flattenBoulders(data){

        if (data.hasOwnProperty('children')) {
            data.children.forEach(level => {
                this.flattenBoulders(level);
            })
        }
        else {
            this.boulders.push(data);
        }

    }



    // Create the visual of total boulders affected
    totalAffected() {
        const numBoulders = Object.keys(this.boulders).length ;
        const numAffected = Object.keys(this.boulders.filter(b => b.affected===true)).length ;

        const svg = d3.select('#card1-svg')
            .attr("height", this.chart_height)
            .attr("width", this.chart_width-50);

        svg.selectAll("text").remove();

        svg
            .append("text")
            .text("Total boulders problems: ")
            .attr("x", 150)
            .attr("y", 100)
            .attr("font-size", "24")
            .attr('text-anchor', "middle");

        svg
            .append("text")
            .text(numBoulders)
            .attr("x", 150)
            .attr("y", 150)
            .attr("font-size", "30")
            .attr('text-anchor', "middle");

        svg
            .append("text")
            .text("Affected boulders problems: ")
            .attr("x", 150)
            .attr("y", 200)
            .attr("font-size", "24")
            .attr('text-anchor', "middle") 
            .attr('fill', 'darkred');

        svg
            .append("text")
            .text(numAffected)
            .attr("x", 150)
            .attr("y", 250)
            .attr("font-size", "30")
            .attr('text-anchor', "middle")
            .attr('fill', 'darkred') ;




    }

    ////////////
    // Bar Chart Visual of boulders by grade
    ////////////

    bouldersArea() {

        const svgHeight = this.chart_height;
        const svgWidth = this.chart_width;

        // Roll up the data to get a count of the number of boulders by grade
        let byGrade = Array.from(d3.rollup(this.boulders, v => v.length, d => d.grade))
        byGrade.map(b => b.grade = b[0])
        byGrade.map(b => b.boulders = b[1])
        

        const affectedByGrade = d3.rollup(this.boulders.filter(b => b.affected===true), v => v.length, d => d.grade)
        byGrade.map(b => b.affected = affectedByGrade.get(b.grade) || 0);


        // Max value for axis
        let maxval = d3.max(byGrade.map(d => d[1]))

        const svg = d3.select('#area-barchart')
            .attr("height", svgHeight)
            .attr("width", svgWidth);

        // Y Scale
        const yScale = d3.scaleLinear()
            .domain([0, maxval]) 
            .range([svgHeight - this.margin.bottom, this.margin.top])
            .nice() ;

        const yAxis = svg.select('#y-axis')
            .classed("axis", true)
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        // X Scale
        const xScale = d3.scaleBand()
            .domain(['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16']) //data.map(d => d.name)
            .range([this.margin.left, svgWidth])
            .padding(0.2) ;

        const xAxis = svg.select('#x-axis')
            .classed("axis", true)
            .attr('transform', `translate(0, ${svgHeight - this.margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Attach tooltip
        let tooltip = d3.select('#tooltipdiv')
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style('display', 'none')


        // Bars
        let bars = svg.select('#all-boulders').selectAll("rect")

        // Bars for total boulders
        bars
            .data(byGrade)
            .join("rect")
            .on("mouseover", function(event, d) 
        {
            // Black outline 
            d3.select(this)
                .attr("stroke", "black")
                .style("stroke-width", "3px") 


            // Make tooltip visible
            tooltip
                .style("opacity", 0.8)
                .style('display', 'block')


            tooltip
                .html(d.boulders + " total " + d.grade + (d.boulders===1 ? "" : "'s")
                    + "<br>" + d.affected + " affected " + d.grade + (d.boulders===1 ? "" : "'s"))
                .style("left", (event.pageX+15)+"px")
                .style("top", (event.pageY-40)+"px")
        })
        .on("mouseleave", function(event,d){
            d3.select(this)
                .style("stroke-width", "1px")

            tooltip
                .style("opacity", 0)
                .style('display', 'none')

        })
            .transition()
            .duration(300)
            .attr("x", (d) => xScale(d.grade))
            .attr("y", (d)=> yScale(d.boulders))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => svgHeight - this.margin.bottom  - yScale(d.boulders))
            .attr("class", "bars-boulders")

        
        // Bars for affected boulders
        let barsaffected = svg.select('#affected-boulders').selectAll("rect")

        barsaffected
            .data(byGrade)
            .join("rect")
            .on("mouseover", function(event, d) 
        {
            // Black outline 
            d3.select(this)
                .attr("stroke", "black")
                .style("stroke-width", "3px") 


            // Make tooltip visible
            tooltip
                .style("opacity", 0.8)
                .style('display', 'block')


            tooltip
                .html(d.boulders + " total " + d.grade + (d.boulders===1 ? "" : "'s")
                    + "<br>" + d.affected + " affected " + d.grade + (d.boulders===1 ? "" : "'s"))
                .style("left", (event.pageX+15)+"px")
                .style("top", (event.pageY-40)+"px")
        })
        .on("mouseleave", function(event,d){
            d3.select(this)
                .style("stroke-width", "1px")

            tooltip
                .style("opacity", 0)
                .style('display', 'none')

        })
            .transition()
            .duration(300)
            .attr("x", (d) => xScale(d.grade))
            .attr("y", (d)=> yScale(d.affected))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => svgHeight - this.margin.bottom  - yScale(d.affected))
            .attr("class", "bars-affected ")
        


    }


    /*******
     * Create drop down menu to attach selection options of the areas
     */
    createDropDown() {

        let arealist = this.boulderData.children.map(d => d.name)
        arealist.unshift("All Areas")

        d3.select('#selectButton')
            .selectAll('myOptions')
     	    .data(arealist)
            .enter()
    	    .append('option')
            .text((d) => d) 
            .attr("value", (d) => d)
            //.property("selected", function(d){ return d === defaultOptionName }) ;
    }


    /*******
     * Select Area button - re-run map and info chart when a new area is selected
     */
    selectAreas() {

        // New name for this. data so we can access it in the function below
        let boulderData = this.boulderData;
        let appState = this.globalAppState;
        let toggle = d3.select('#toggle')
        const drawInfoCard = this.drawInfoCard;

        d3.select('#selectButton').on("change", function(event) {
            
            // Selected value
            var selectedArea = d3.select(this).property("value") ;

            // Change selection menu to black
            d3.select(this).attr("class", "selecter-active") ;

            // Change toggle to grey
            toggle.property("checked", "true")

            // Subset data to selected area and re-draw info card
            if (selectedArea === "All Areas") {
                appState.infoInstance.drawInfoCard(boulderData);

                // Call map on original view
                appState.map.selectArea(40.574215, -111.715113, 12.75);

            } else {
                let areaData = boulderData.children.filter(d => d.name === selectedArea)[0];
                appState.infoInstance.drawInfoCard(areaData);

                // Call map
                appState.map.selectArea(areaData.lat, areaData.long, 16);
            }
  

        })


    }
    /*****
     * Toggle switch
     */
    toggle() {

        
        let toggle = d3.select('#toggle')
        let selectButton = d3.select('#selectButton')
        
        toggle.on("change", function(event){

            // When toggle is off and turned back on
            if (toggle.property("checked") === false) {

                // Grey out selection menu
                selectButton.attr("class", "selecter-inactive");
        
                // TODO: change back to map view
            }
            // when toggle is on and turned off, turn on selection menu
            else if (toggle.property("checked") === true) {
                selectButton.attr("class", "selecter-active");
                //TODO: get value from selection menu and re-run info. Right now it works fine because the map view isn't active

            }
        })

    }


    /**
     * 
     * @returns This method returns the affected boulders from the boulder data
     */
     filterAffectedBoulders() {
        var towerLatLongList = []
        this.globalAppState.towerData.forEach(d => {
            towerLatLongList.push({ lat: d.lat, long: d.long })
        })

        // get all of the children of the main areas
        var children = this.boulderData.children
        var childrenAreas = []
        children.forEach(child => {
            if (child.children) {
                child.children.forEach(d => {
                    if (d.children) {
                        childrenAreas.push(d)
                    }
                })
            }
        })

        var affectedBoulders = []
        // check if the boulder is in the bounds of a tower
        childrenAreas.forEach(function (d) {
            towerLatLongList.forEach(t => {
                if (Number(d.lat).toPrecision(6) > (Number(parseFloat(t.lat)).toPrecision(6) - 0.0005) && Number(d.lat).toPrecision(6) < (Number(parseFloat(t.lat)).toPrecision(6) + 0.0005)) {
                    if (Number(d.long).toPrecision(6) > (Number(parseFloat(t.long)).toPrecision(6) - 0.0005) && Number(d.long).toPrecision(6) < (Number(parseFloat(t.long)).toPrecision(6) + 0.0005)) {
                        if (affectedBoulders.indexOf(d) === -1) {
                            affectedBoulders.push(d)
                        }
                    }
                }
            })
        })        
        return affectedBoulders
    }

    /****
     * Function that creates an object containing all boulder problems from the nested area/boulder object
     */
    flattenAffectedBoulders(data){

        if (data.hasOwnProperty('children')) {
            data.children.forEach(level => {
                this.flattenAffectedBoulders(level);
            })
        }
        else {
            this.affectedBoulders.push(data);
        }

    }


}