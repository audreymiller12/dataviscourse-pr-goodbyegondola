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


        
            
    }

    /* Legend for frequency column */
    drawLegend(data){

        const axisHeight = 20

        /* Rating scale and axis */
        this.ratingScaleX = d3.scaleLinear()
            .domain([0,5])
            .range([10,this.ratingWidth-10]) ;        

        const drawRatingAxis = d3.select('#ratingAxis')
            .attr("height", axisHeight)
            .attr("width", this.ratingWidth)
            .call(d3.axisBottom(this.ratingScaleX)
                .tickValues([0,1,2,3,4,5])
                .tickFormat(d3.format(".0f"))
            ) ;

        drawRatingAxis.selectAll("path").remove();

        /* Page views scale and axis */

        // Max value for views
        let maxviews = d3.max(data.map(d => d.totalViews))

        this.viewsScaleX = d3.scaleLinear()
            .domain([0,maxviews])
            .range([10,this.viewWidth-10]) ;    

        const drawViewsAxis = d3.select('#viewsAxis')
            .attr("height", axisHeight)
            .attr("width", this.viewWidth)
            .classed("axis", true)
            .call(d3.axisBottom(this.viewsScaleX)
                .ticks(5)
                .tickFormat(d => `${d}`)
            ) ;

        drawViewsAxis.selectAll("path").remove();

    }

    drawTable(data){

        // Draw legend
        this.drawLegend(data);

        // Set what is called in here as this.currentData so that it can be accessed in the sorting function
        this.currentData = data;

        let rowSelection = d3.select('#tableBody')
            .selectAll('tr')
            .data(this.currentData)
            .join('tr');

        let tableSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
        //     .attr('class', d => d.class);

        // Add text
        let textSelection = tableSelection.filter(d => d.type === 'text');
        textSelection.text(d => d.value);

        // Rating
        let ratingSelection = tableSelection.filter(d => d.column === 'rating');

        let ratingSvgSelect = ratingSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.ratingWidth)
            .attr('height', this.rowHeight);

        this.addRatingRects(ratingSvgSelect);

        // Views
        let viewSelection = tableSelection.filter(d => d.column === 'views');

        let viewSvgSelect = viewSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.viewWidth)
            .attr('height', this.rowHeight);

        this.addViewsRects(viewSvgSelect);

    }


    rowToCellDataTransform(d) {
        let name = {
            column: "name",
            type: 'text',
            value: d.name
        };

        let grade = {
            column: "grade",
            type: 'text',
            value: d.grade
        };
        let rating = {
            column: "rating",
            type: 'viz',
            value: d.avgRating
        };
        let views = {
            column: "views",
            type: 'viz',
            value: d.totalViews
        };

        let dataList = [name, grade, rating, views];
        return dataList
    }


    // Add rectangles for the rating column
    addRatingRects(svg) {

        let drawRect = svg.selectAll('rect')

        drawRect
            .data(d => [d])
            .join('rect')
            .attr('x', 10)
            .attr('y', 0)
            .attr('width', (d) => this.ratingScaleX(d.value))
            .attr('height', this.rowHeight)
            //.attr('fill', (d) => this.catColor(d.value.category))
            .attr('opacity', "1")
    }

    // Add rectangles for the views column
    addViewsRects(svg) {

        let drawRect = svg.selectAll('rect')

        drawRect
            .data(d => [d])
            .join('rect')
            .attr('x', 10)
            .attr('y', 0)
            .attr('width', (d) => this.viewsScaleX(d.value))
            .attr('height', this.rowHeight)
            //.attr('fill', (d) => this.catColor(d.value.category))
            .attr('opacity', "1")
    }



}