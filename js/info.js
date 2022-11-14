class InfoCard{
    constructor(globalAppState) {

        this.globalAppState = globalAppState;
        this.boulderData = globalAppState.boulderData;

        // Margins for small charts
        this.margin = {left: 30, bottom: 20 , top:10};
        this.chart_height = 300 ; // Also check CSS
        this.chart_width = 350 ;

        this.pullBoulders(this.boulderData);

        

    }

    // Create infocard
    pullBoulders(areaData) {

        // Create a list of boulders from the nested area/boulder object
        this.boulders = [] ;
        this.recursiveBoulderPull(areaData);


        // Call each of the views on the boulder dataset
        this.totalAffected();
        //this.affectedGrade();
        this.bouldersArea();

        // Call table with boulder data
        this.globalAppState.tableViz.drawTable(this.boulders);


    }

    // Function that creates an object containing all boulder problems from the nested area/boulder object
    recursiveBoulderPull(data){

        if (data.hasOwnProperty('children')) {
            data.children.forEach(level => {
                this.recursiveBoulderPull(level);
            })
        }
        else {
            this.boulders.push(data);
        }
        

    }



    // Create the visual of total boulders affected
    totalAffected() {
        const numBoulders = Object.keys(this.boulders).length ;

        const svg = d3.select('#card-1')
            .append("svg")
            .attr("height", this.chart_height)
            .attr("width", this.chart_width);

        svg.append("text")
            .text("Total Boulders: " + numBoulders)
            .attr("x", 0)
            .attr("y", 50)
            .attr("font-size", "30");

        svg.append("text")
            .text("Affected Boulders: ")
            .attr("x", 0)
            .attr("y", 100)
            .attr("font-size", "30");




    }


    // Visual of boulders affected by grade
    affectedGrade() {

        const svg = d3.select('#grade-barchart')
            .attr("height", this.chart_height)
            .attr("width", this.chart_width);

        // Y Scale
        const yScale = d3.scaleLinear()
            .domain([0, 20]) //CHANGE WITH REAL DATA
            .range([this.chart_height - this.margin.bottom, this.margin.top])
            .nice() ;

        const yAxis = svg.select('#y-axis')
            .classed("axis", true)
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        // X Scale
        const xScale = d3.scaleBand()
            .domain(['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12']) //data.map(d => d.name)
            .range([this.margin.left, this.chart_width])
            .padding(0.2) ;

        const xAxis = svg.select('#x-axis')
        .classed("axis", true)
        .attr('transform', `translate(0, ${this.chart_height - this.margin.bottom})`)
        .call(d3.axisBottom(xScale));


    }

    bouldersArea() {

        const svgHeight = 350;
        const svgWidth = 400;

        // Roll up the data to get a count of the number of boulders by grade
        const byGrade = Array.from(d3.rollup(this.boulders, v => v.length, d => d.grade))

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

        // Bars
        let bars = svg.selectAll("rect")
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
                    .style("opacity", 0.8);

                tooltip
                    .html(d[1] + " " + d[0] + (d[1]===1 ? "" : "s"))
                    .style("left", (event.pageX+15)+"px")
                    .style("top", (event.pageY-40)+"px")
            })
            .on("mouseleave", function(event,d){
                d3.select(this)
                    .style("stroke-width", "1px")

                tooltip
                    .style("opacity", 0)
            })
            .transition()
            .duration(300)
            .attr("x", (d) => xScale(d[0]))
            .attr("y", (d)=> yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => svgHeight - this.margin.bottom  - yScale(d[1]))
            .attr("stroke", "black")
            .style("stroke-width", "1px") 


    }


}