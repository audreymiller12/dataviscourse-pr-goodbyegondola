class InfoCard{
    constructor(globalAppState) {

        this.boulderData = globalAppState.boulderData.children;
        console.log(this.boulderData);

        // Margins for small charts
        this.margin = {left: 20, bottom: 20 , top:10};
        this.chart_height = 300 ; // Also check CSS
        this.chart_width = 350 ;

        // Call each of the views
        this.totalAffected();
        this.popularBoulders();
        this.affectedGrade();
        this.bouldersArea();

    }

    // Create the visual of total boulders affected
    totalAffected() {

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
            .padding(0.2)

        const xAxis = svg.select('#x-axis')
        .classed("axis", true)
        .attr('transform', `translate(0, ${this.chart_height - this.margin.bottom})`)
        .call(d3.axisBottom(xScale));


    }

    bouldersArea() {

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
            .padding(0.2)

        const xAxis = svg.select('#x-axis')
            .classed("axis", true)
            .attr('transform', `translate(0, ${this.chart_height - this.margin.bottom})`)
            .call(d3.axisBottom(xScale));

    }


}