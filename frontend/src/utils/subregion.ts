function loadSubregion(object: any, legendsxml: any, legendsplusxml: any) {
  let subregion = undefined;
  // Link to subregion
  if (object.hasOwnProperty("subregion_id")) {
    Array.from(object.subregion_id).forEach((region: any) => {
      if (region === -1) {
        region = undefined;
      } else {
        let obj = legendsxml.regions.region[region.value];
        let subname = obj.name;
        let subtype = obj.type;
        let objplus = legendsplusxml.regions.region[region.value];
        let evilness = objplus.evilness;

        subregion = {
          name: subname,
          type: subtype,
          evilness: evilness,
        };
      }
    });

    return subregion;
  }
}

export default loadSubregion;
