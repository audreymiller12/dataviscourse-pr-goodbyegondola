// ******* DATA LOADING *******
async function loadData () {
    const boulderData = await d3.json('data/data.json');
    const towerData = await d3.csv('data/tower_data.csv');
    const boulderNames = await d3.csv('data/boulder_names.csv');
    return { boulderData, towerData, boulderNames };
}



const globalApplicationState = {
   boulderData: null,
   towerData: null,
   boulderNames: null,
   map: null,
   infoInstance: null,
   tableViz: null,
   selectedData: []
  };

// Read in boulder data and create new map and info card objects
loadData().then((loadedData) => {
    globalApplicationState.boulderData = loadedData.boulderData
    globalApplicationState.towerData = loadedData.towerData
    globalApplicationState.boulderNames = loadedData.boulderNames
    

    let map = new GondolaMap(globalApplicationState);
    globalApplicationState.map = map;

    const tableViz = new Table(globalApplicationState);
    globalApplicationState.tableViz = tableViz;
    
   
    // TODO add the info_svg connection here
    let infoCard = new InfoCard(globalApplicationState);
    globalApplicationState.infoInstance = infoCard

  });