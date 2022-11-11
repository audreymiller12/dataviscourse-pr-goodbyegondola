class InfoCard{
    constructor(globalAppState) {

        this.boulderData = globalAppState.boulderData;

        // Margins for small charts
        this.margin = {left: 20, bottom: 20 , top:10};
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
        this.popularBoulders();
        this.affectedGrade();
        this.bouldersArea();


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
            .text("Total Boulders: ")
            .attr("x", 0)
            .attr("y", 50)
            .attr("font-size", "30");

        svg.append("text")
            .text(numBoulders)
            .attr("x", 220)
            .attr("y", 50)
            .attr("font-size", "30");

        svg.append("text")
            .text("Affected Boulders: ")
            .attr("x", 0)
            .attr("y", 100)
            .attr("font-size", "30");




    }

    // Create the visual showing popular boulders in the area
    popularBoulders() {

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

        // Roll up the data to get a count of the number of boulders by grade
        const byGrade = d3.rollup(this.boulders, v => v.length, d => d.grade)
        console.log(byGrade)

        let max = d3.max(byGrade, d => d.value)
        console.log(max)

        const svg = d3.select('#area-barchart')
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

        

        // const byGrade = d3.group(this.boulders, d => d.grade)
        // console.log(byGrade)

        


    }


}