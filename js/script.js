// ******* DATA LOADING *******
async function loadData () {
    const data = await d3.json('data/data.json');
    return { data };
}

const globalApplicationState = {
   mapData: null,
   map: null,
   info_svg: null,
   selectedData: []
  };

  //******* APPLICATION MOUNTING *******
loadData().then((loadedData) => {
    globalApplicationState.mapData = loadedData.data

    let map = new GondolaMap(globalApplicationState);
    let infoCard = new InfoCard(globalApplicationState);
   
  // TODO add the info_svg connection here

  

    globalApplicationState.map = map

  });