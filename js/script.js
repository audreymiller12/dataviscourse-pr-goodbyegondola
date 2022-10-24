// ******* DATA LOADING *******
async function loadData () {
    const data = await d3.json('data/data.json');
    return { data };
}

const globalApplicationState = {
   wordData: null,
   bubble_chart: null,
   table: null,
   selectedData: []
  };

  //******* APPLICATION MOUNTING *******
loadData().then((loadedData) => {
    globalApplicationState.wordData = loadedData.wordData

    let bubble_chart = new BubbleChart(globalApplicationState);
    bubble_chart.drawChart()

    let table = new Table(globalApplicationState)
    table.drawChart()

    globalApplicationState.bubble_chart = bubble_chart
    globalApplicationState.table = table
  });