// ******* DATA LOADING *******
async function loadData () {
    const data = await d3.json('data/data.json');
    return { data };
}

async function loadGondolaData () {
  const gondolaData = await d3.csv('data/tower_data.csv');
  return { gondolaData };
}

const globalApplicationState = {
   mapData: null,
   gondolaData: null,
   map: null,
   info_svg: null,
   selectedData: []
  };


  //******* APPLICATION MOUNTING *******

  // Read in Gondola data
  loadGondolaData().then((loadedGondolaData) => {

    globalApplicationState.gondolaData = loadedGondolaData 

  })

// Read in boulder data and create new map and info card objects
loadData().then((loadedData) => {

    globalApplicationState.mapData = loadedData.data

    let map = new GondolaMap(globalApplicationState);
    globalApplicationState.map = map;
    
   
    // TODO add the info_svg connection here
    let infoCard = new InfoCard(globalApplicationState);


    

  });