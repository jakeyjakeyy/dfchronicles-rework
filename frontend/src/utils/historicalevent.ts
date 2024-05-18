// import loadSubregion from "./subregion";
// import getEntityData from "./entity";

function loadHistoricalEvent(
  id: number,
  legendsxml: any,
  legendsplusxml: any,
  histfigs: any
) {
  var event: any = {};
  const data: any = Array.from(
    legendsxml.historical_events.historical_event
  ).find((event: any) => {
    return event.id === id;
  });
  const dataplus: any = Array.from(
    legendsplusxml.historical_events.historical_event
  ).find((event: any) => {
    return event.id === id;
  });
  console.log(data);
  console.log(dataplus);
  if (!data && !dataplus) {
    return null;
  }
  if (data.id === id) {
    event.year = data.year;
    event.type = data.type;

    if (event.type === "hf died") {
      event.type = "target died";
    }

    if (event.type === "hf wounded") {
      event.type = "target wounded";
    }

    let subtype = data.subtype;
    if (subtype) {
      event.subtype = subtype;
    }

    if (data.hasOwnProperty("attacker_civ_id")) {
      let civid = data.attacker_civ_id;
      if (civid) {
        event.attackerCiv = getEntityData(civid, legendsxml, legendsplusxml);
        civid = data.defender_civ_id;
        event.defenderCiv = getEntityData(civid, legendsxml, legendsplusxml);
      }
    }

    let subregion = loadSubregion(data, legendsxml, legendsplusxml);
    if (subregion) {
      event.subregion = subregion;
    }

    if (data.hasOwnProperty("body_part")) {
      event.bodyPart = data.body_part;
    }

    if (data.hasOwnProperty("death_cause")) {
      event.deathCause = data.death_cause;
    }

    if (data.hasOwnProperty("group_1_hfid")) {
      var involvedFigures: any = {};
      involvedFigures[0] = getHistoricalFigureData(
        "group_1_hfid",
        data,
        legendsxml,
        histfigs
      );
    }
    if (data.hasOwnProperty("group_2_hfid")) {
      involvedFigures[1] = getHistoricalFigureData(
        "group_2_hfid",
        data,
        legendsxml,
        histfigs
      );
    }
    if (involvedFigures) {
      event.involvedFigures = involvedFigures;
    }

    if (data.hasOwnProperty("attacker_general_hfid")) {
      event.attackerGeneral = getHistoricalFigureData(
        "attacker_general_hfid",
        data,
        legendsxml,
        histfigs
      );
    }
    if (data.hasOwnProperty("defender_general_hfid")) {
      event.defenderGeneral = getHistoricalFigureData(
        "defender_general_hfid",
        data,
        legendsxml,
        histfigs
      );
    }

    const targetTagNames = ["woundee_hfid", "hfid"];
    for (let tagName of targetTagNames) {
      if (data.hasOwnProperty(tagName)) {
        event.targetFigure = getHistoricalFigureData(
          tagName,
          data,
          legendsxml,
          histfigs
        );
      }
    }
    const attackerTagNames = ["wounder_hfid", "slayer_hfid"];
    for (let tagName of attackerTagNames) {
      if (data.hasOwnProperty(tagName) && data[tagName] !== "-1") {
        event.attackerFigure = getHistoricalFigureData(
          tagName,
          data,
          legendsxml,
          histfigs
        );
      }
    }

    if (data.hasOwnProperty("cause")) {
      event.cause = data.getElementsByTagName("cause")[0].value;
    }

    if (data.hasOwnProperty("civ_id")) {
      event.civ = getEntityData(data.civ_id, legendsxml, legendsplusxml);
      if (data.hasOwnProperty("link")) {
        event.link = data.link;
      }
    }

    if (dataplus === undefined) {
      return event;
    }
    if (dataplus.hasOwnProperty("item_type")) {
      event.itemType = dataplus.item_type;
    }
    if (dataplus.hasOwnProperty("mat")) {
      event.item_material = dataplus.mat;
    }
    if (dataplus.hasOwnProperty("stashSite")) {
      const stashSite = dataplus.stashSite;
      if (stashSite !== "-1") {
        event.postStashSite = {
          name: legendsxml.sites.site[stashSite + 1].name,
          type: legendsxml.sites.site[stashSite + 1].type,
        };
      }
    }
    if (dataplus.hasOwnProperty("theftMethod")) {
      event.theftMethod = dataplus.theftMethod;
    }
    if (dataplus.hasOwnProperty("histfig")) {
      event.instigator = getHistoricalFigureData(
        "histfig",
        dataplus,
        legendsxml,
        histfigs
      );
    }
  }
  return event;
}

function getHistoricalFigureData(
  tagName: any,
  data: any,
  legendsxml: any,
  histfigs: any
) {
  console.log(data, tagName);
  let figureData = {};
  if (data.hasOwnProperty(tagName) && data[tagName] !== "-1") {
    const hfid = data[tagName];
    const figure = histfigs[hfid];
    if (figure.length === 0) {
      return null;
    }
    if (figure.id === hfid) {
      figureData = {
        id: figure.id,
        name: figure.name,
        race: figure.race,
        caste: figure.caste,
      };
    }
  }
  return figureData;
}

export default loadHistoricalEvent;
