import loadSubregion from "./subregion";
import getEntityData from "./entity";

function loadHistoricalEvent(
  id: number,
  legendsxml: any,
  legendsplusxml: any,
  histfigs: any
) {
  var event: any = {};
  console.log(legendsxml.historical_events.historical_event);
  const data = Array.from(
    legendsxml.getElementsByTagName("historical_event")
  ).find((event) => {
    return event.getElementsByTagName("id")[0].value === id;
  });
  const dataplus = Array.from(
    legendsplusxml.getElementsByTagName("historical_event")
  ).find((event) => {
    return event.getElementsByTagName("id")[0].value === id;
  });
  console.log(data);
  console.log(dataplus);
  if (!data && !dataplus) {
    return null;
  }
  if (data.getElementsByTagName("id")[0].value === id) {
    event.year = data.getElementsByTagName("year")[0].value;
    event.type = data.getElementsByTagName("type")[0].value;

    if (event.type === "hf died") {
      event.type = "target died";
    }

    if (event.type === "hf wounded") {
      event.type = "target wounded";
    }

    let subtype = data.getElementsByTagName("subtype")[0]?.value;
    if (subtype) {
      event.subtype = subtype;
    }

    if (data.getElementsByTagName("attacker_civ_id").length > 0) {
      let civid = data.getElementsByTagName("attacker_civ_id")[0].value;
      if (civid) {
        event.attackerCiv = getEntityData(civid, legendsxml, legendsplusxml);
        civid = data.getElementsByTagName("defender_civ_id")[0].value;
        event.defenderCiv = getEntityData(civid, legendsxml, legendsplusxml);
      }
    }

    let subregion = loadSubregion(data, legendsxml, legendsplusxml);
    if (subregion) {
      event.subregion = subregion;
    }

    if (data.getElementsByTagName("body_part").length > 0) {
      event.bodyPart = data.getElementsByTagName("body_part")[0].value;
    }

    if (data.getElementsByTagName("death_cause").length > 0) {
      event.deathCause = data.getElementsByTagName("death_cause")[0].value;
    }

    if (data.getElementsByTagName("group_1_hfid").length > 0) {
      var involvedFigures = {};
      involvedFigures[0] = getHistoricalFigureData(
        "group_1_hfid",
        data,
        legendsxml,
        histfigs
      );
    }
    if (data.getElementsByTagName("group_2_hfid").length > 0) {
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

    if (data.getElementsByTagName("attacker_general_hfid").length > 0) {
      event.attackerGeneral = getHistoricalFigureData(
        "attacker_general_hfid",
        data,
        legendsxml,
        histfigs
      );
    }
    if (data.getElementsByTagName("defender_general_hfid").length > 0) {
      event.defenderGeneral = getHistoricalFigureData(
        "defender_general_hfid",
        data,
        legendsxml,
        histfigs
      );
    }

    const targetTagNames = ["woundee_hfid", "hfid"];
    for (let tagName of targetTagNames) {
      if (data.getElementsByTagName(tagName).length > 0) {
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
      if (
        data.getElementsByTagName(tagName).length > 0 &&
        data.getElementsByTagName(tagName)[0].value !== "-1"
      ) {
        event.attackerFigure = getHistoricalFigureData(
          tagName,
          data,
          legendsxml,
          histfigs
        );
      }
    }

    if (data.getElementsByTagName("cause").length > 0) {
      event.cause = data.getElementsByTagName("cause")[0].value;
    }

    if (data.getElementsByTagName("civ_id").length > 0) {
      event.civ = getEntityData(
        data.getElementsByTagName("civ_id")[0].value,
        legendsxml,
        legendsplusxml
      );
      if (data.getElementsByTagName("link").length > 0) {
        event.link = data.getElementsByTagName("link")[0].value;
      }
    }

    if (dataplus === undefined) {
      return event;
    }
    const itemtype = dataplus.getElementsByTagName("item_type");
    if (itemtype.length > 0) {
      event.itemType = dataplus.getElementsByTagName("item_type")[0].value;
    }
    const mat = dataplus.getElementsByTagName("mat");
    if (mat.length > 0) {
      event.item_material = mat[0].value;
    }
    const stashSite = dataplus.getElementsByTagName("stash_site");
    if (stashSite.length > 0) {
      if (stashSite[0].value !== "-1") {
        event.postStashSite = {
          name: legendsxml
            .getElementsByTagName("site")
            [stashSite[0].value].getElementsByTagName("name")[0].value,
          type: legendsxml
            .getElementsByTagName("site")
            [stashSite[0].value].getElementsByTagName("type")[0].value,
        };
      }
    }
    const theftMethod = dataplus.getElementsByTagName("theft_method");
    if (theftMethod.length > 0) {
      event.theftMethod = theftMethod[0].value;
    }
    const plushfid = dataplus.getElementsByTagName("histfig");
    if (plushfid.length > 0) {
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

function getHistoricalFigureData(tagName, data, legendsxml, histfigs) {
  console.log(data, tagName);
  let figureData = {};
  if (
    data.getElementsByTagName(tagName).length > 0 &&
    data.getElementsByTagName(tagName)[0].value !== "-1"
  ) {
    const hfid = data.getElementsByTagName(tagName)[0].value;
    const figure = histfigs[hfid];
    if (figure.length === 0) {
      return null;
    }
    if (figure.getElementsByTagName("id")[0].value === hfid) {
      figureData = {
        id: figure.getElementsByTagName("id")[0].value,
        name: figure.getElementsByTagName("name")[0].value,
        race: figure.getElementsByTagName("race")[0].value,
        caste: figure.getElementsByTagName("caste")[0].value,
      };
    }
  }
  return figureData;
}

export default loadHistoricalEvent;
