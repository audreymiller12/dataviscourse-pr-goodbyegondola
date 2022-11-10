// ******* DATA LOADING *******
async function loadData () {
    const boulderData = await d3.json('data/data.json');
    const towerData = await d3.csv('data/tower_data.csv');
    return { boulderData, towerData };
}



const globalApplicationState = {
   boulderData: null,
   towerData: null,
   map: null,
   info_svg: null,
   selectedData: []
  };

// Read in boulder data and create new map and info card objects
loadData().then((loadedData) => {
    globalApplicationState.boulderData = loadedData.boulderData
    globalApplicationState.towerData = loadedData.towerData
    

    let map = new GondolaMap(globalApplicationState);
    globalApplicationState.map = map;
    
   
    // TODO add the info_svg connection here
    let infoCard = new InfoCard(globalApplicationState);



    globalApplicationState.map = map

  });