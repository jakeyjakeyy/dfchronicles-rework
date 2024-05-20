function getEntityData(civid: number, legendsxml: any, legendsplusxml: any) {
  let data = {};
  let civ = legendsplusxml.entities.entity[civid];
  let civname = legendsxml.entities.entity[civid];
  if (civname) {
    data = {
      race: civ.race,
      type: civ.type,
      name: civname.name,
    };
    return data;
  } else {
    return null;
  }
}

export default getEntityData;
