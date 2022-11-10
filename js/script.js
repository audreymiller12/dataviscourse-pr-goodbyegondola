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

  //******* APPLICATION MOUNTING *******
loadData().then((loadedData) => {
    globalApplicationState.boulderData = loadedData.boulderData
    globalApplicationState.towerData = loadedData.towerData
    

    let map = new GondolaMap(globalApplicationState);
    let infoCard = new InfoCard(globalApplicationState);
   
  // TODO add the info_svg connection here



    globalApplicationState.map = map

  });