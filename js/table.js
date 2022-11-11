// Program to build the table of bouldres

class Table {

    constructor(globalApplicationState){

        this.globalApplicationState = globalApplicationState;

        this.headerData = [
            {
                key: 'phrase',
                sorted: false,
                ascending: false,
            },
            {
                key: 'grade',
                sorted: false,
                ascending: false,
            },
            {
                key: 'rating',
                sorted: false,
                ascending: false,
            },
            {
                key: 'views',
                sorted: false,
                ascending: false,
            },
        ]

        this.ratingWidth = 150;
        this.viewWidth = 200;
        this.rowHeight = 20

        /* Set scales */
        this.ratingScaleX = d3.scaleLinear()
            .domain([0,5])
            .range([10,this.ratingWidth-10]) ;

        // Draw legend
        this.drawLegend();

        
    }

    /* Legend for frequency column */
    drawLegend(){

        const axisHeight = 20

        const drawRatingAxis = d3.select('#ratingAxis')
            .attr("height", axisHeight)
            .attr("width", this.ratingWidth)
            .call(d3.axisBottom(this.ratingScaleX)
                .tickValues([0,1,2,3,4,5])
                .tickFormat(d3.format(".0f"))
            ) ;

        //drawRatingAxis.selectAll("path").remove();

        // const drawPercAxis = d3.select('#percAxis')
        //     .attr("height", axisHeight)
        //     .attr("width", this.percWidth)
        //     .classed("axis", true)
        //     .call(d3.axisBottom(this.percScaleX)
        //         .tickValues([-100, -50, 0, 50, 100])
        //         .tickFormat(d => `${Math.abs(d)}`)
        //     ) ;

        //     drawPercAxis.selectAll("path").remove();

    }

    drawTable(data){

        // Set what is called in here as this.currentData so that it can be accessed in the sorting function
        this.currentData = data;

        let rowSelection = d3.select('#tableBody')
            .selectAll('tr')
            .data(this.currentData)
            .join('tr');

        // let tableSelection = rowSelection.selectAll('td')
        //     .data(this.rowToCellDataTransform)
        //     .join('td')
        //     .attr('class', d => d.class);

    }


    rowToCellDataTransform(d) {
        let phrase = {
            column: "phrase",
            type: 'text',
            value: d.phrase
        };

        let frequency = {
            column: "frequency",
            type: 'viz',
            value: {
                frequency: d.frequency,
                category: d.category
            } 
        };
        let percentages = {
            column: "percentages",
            type: 'viz',
            value: {
                dPerc: d.percent_of_d_speeches,
                rPerc: d.percent_of_r_speeches
            } 
        };
        let total = {
            column: "total",
            type: 'text',
            value: d.total
        };

        let dataList = [phrase, frequency, percentages, total];
        return dataList
    }



}