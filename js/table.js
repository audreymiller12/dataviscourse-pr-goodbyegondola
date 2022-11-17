// Program to build the table of bouldres

class Table {

    constructor(globalApplicationState){

        this.globalApplicationState = globalApplicationState;

        // Initiatlize this.currentData
        this.currentData = null;

        this.headerData = [
            {
                key: 'name',
                secondKey: 'avgRating',
                sorted: false,
                ascending: false,
            },
            {
                key: 'gradeNumber',
                secondKey: 'avgRating',
                sorted: false,
                ascending: false,
            },
            {
                key: 'avgRating',
                secondKey: 'totalViews',
                sorted: false,
                ascending: false,
            },
            {
                key: 'totalViews',
                secondKey: 'avgRating',
                sorted: false,
                ascending: false,
            },
        ]

        this.ratingWidth = 150;
        this.viewWidth = 200;
        this.rowHeight = 20

        // Attach column sort handlers with current data
        this.attachSortHandlers();

            
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
            .call(d3.axisBottom(this.viewsScaleX)
                .ticks(8)
                .tickFormat((d) => d<10001 ? d3.format(".0s")(d) : d3.format(".2s")(d))
            ) ;

        drawViewsAxis.selectAll("path").remove();

    }

    drawTable(data){

        // Draw legend
        this.drawLegend(data);

        // Set what is called in here as this.currentData so that it can be accessed in the sorting function
        this.currentData = data;
        this.currentData.map(d => d.gradeNumber = parseInt(d.grade.substring(1))) ;

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
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(300)
            .attr('x', 10)
            .attr('y', this.rowHeight/2)
            .attr('width', (d) => this.ratingScaleX(d.value))
            .attr('height', 1) 
            //.attr('fill', (d) => this.catColor(d.value.category))
            .attr('opacity', "1")
            

        let drawCircles = svg.selectAll('circle')
            .data(d => [d])
            .join('circle')
            .transition()
            .duration(300)
            .attr('cx', (d) => this.ratingScaleX(d.value) + 10)
            .attr('cy', this.rowHeight/2)
            .attr('r', 6)

   
    }

    // Add rectangles for the views column
    addViewsRects(svg) {

        let drawRect = svg.selectAll('rect')

        drawRect
            .data(d => [d])
            .join('rect')
            .transition()
            .duration(300)
            .attr('x', 10)
            .attr('y', 0)
            .attr('width', (d) => this.viewsScaleX(d.value))
            .attr('height', this.rowHeight)
            //.attr('fill', (d) => this.catColor(d.value.category))
            .attr('opacity', "1")
    }


    // Function to sort columns
    attachSortHandlers() {

        

        let headerSelection = d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .join('th') ;

        headerSelection.on('click', (event, d) => {
            
            // Change the sorted value to be true for the selected column, false for all else
            this.headerData.filter(s => s !== d).forEach(col => col.sorted = false);
            this.headerData.filter(s => s === d).forEach(col => col.sorted = true);

            // Sort ascending or descending and re draw table. Each column as a secondary column to sort on, called secondKey
            if (d.ascending === false) {
                this.currentData.sort((a,b) => {
                    if (a[d.key] === b[d.key]) {
                        return (a[d.secondKey]) < (b[d.secondKey]) ? -1 : 1 ;
                    } else {
                        return (a[d.key]) < (b[d.key]) ? -1 : 1 ;
                    }
                });
                this.headerData.filter(s => s === d).forEach(col => col.ascending = true);
                this.drawTable(this.currentData);
            }
            else if (d.ascending === true) {
                this.currentData.sort((a,b) => {
                    if (a[d.key] === b[d.key]) {
                        return (a[d.secondKey]) > (b[d.secondKey]) ? -1 : 1
                    } else {
                        return (a[d.key]) > (b[d.key]) ? -1 : 1
                    }
                });
                this.headerData.filter(s => s === d).forEach(col => col.ascending = false);
                this.drawTable(this.currentData);
            }

        })

    }



}