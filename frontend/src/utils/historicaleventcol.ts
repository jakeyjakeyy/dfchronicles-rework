// import LinkSquads from "./linksquads";
// import loadSubregion from "./subregion";
// import getEntityData from "./entity";
import loadHistoricalEvent from "./historicalevent";

function loadHistoricalEventCollection(
  object: any,
  legendsxml: any,
  legendsplusxml: any
) {
  console.log(legendsxml);
  const json: any = {};
  console.log(object);
  const histfigs = legendsxml.historical_figures.historical_figure;
  // json.world = {
  //   name: legendsplusxml.children[1].value,
  //   dwarvishname: legendsplusxml.children[0].value,
  // };
  json.id = object.id;
  json.startYear = object.start_year;
  json.endYear = object.end_year;

  const eventcolElements = Array.from(object.eventcol);
  if (eventcolElements.length > 0) {
    var eventCollections: any = [];
    var xmlEventCols =
      legendsxml.historical_event_collections.historical_event_collection;
    eventcolElements.forEach((eventcol: any) => {
      xmlEventCols.forEach((data: any) => {
        if (data.id === eventcol) {
          eventCollections.push(
            loadHistoricalEventCollection(data, legendsxml, legendsplusxml)
          );
        }
      });
    });
    json.eventCollections = eventCollections;
  }

  const eventElements = object.event;
  if (eventElements.length > 0) {
    var events: any = [];
    eventElements.forEach((event: any) => {
      events.push(
        loadHistoricalEvent(event, legendsxml, legendsplusxml, histfigs)
      );
    });
    json.events = events;
  }
  const eventTypeElements = object.getElementsByTagName("type");
  if (eventTypeElements.length > 0) {
    json.type = eventTypeElements[0].value;
  }
  const eventNameElements = object.getElementsByTagName("name");
  if (eventNameElements.length > 0) {
    json.name = eventNameElements[0].value;
  }

  const warEventColElements = object.getElementsByTagName("war_eventcol");
  if (warEventColElements.length > 0) {
    const isPartOfWar = {};
    const eventCollections = legendsxml.getElementsByTagName(
      "historical_event_collection"
    );
    warEventColElements.forEach((war) => {
      const data = Array.from(eventCollections).find((eventCollection) => {
        let idElements = eventCollection.getElementsByTagName("id");
        return idElements[0].value === war.value;
      });

      if (data) {
        isPartOfWar.name = data.getElementsByTagName("name")[0].value;
        isPartOfWar.id = data.getElementsByTagName("id")[0].value;
        isPartOfWar.startYear =
          data.getElementsByTagName("start_year")[0].value;
        isPartOfWar.endYear = data.getElementsByTagName("end_year")[0].value;
        let civid = data.getElementsByTagName("aggressor_ent_id")[0].value;
        isPartOfWar.agressorCivilization = getEntityData(
          civid,
          legendsxml,
          legendsplusxml
        );
        civid = data.getElementsByTagName("defender_ent_id")[0].value;
        isPartOfWar.defenderCivilization = getEntityData(
          civid,
          legendsxml,
          legendsplusxml
        );
      }
    });
    json.isPartOfWar = isPartOfWar;
  }
  let subregion = loadSubregion(object, legendsxml, legendsplusxml);
  if (subregion) {
    json.subregion = subregion;
  }

  const featurelayerElements = object.getElementsByTagName("feature_layer_id");
  if (featurelayerElements.length > 0) {
    const featureLayer = {};
    const undergroundRegionElements =
      legendsxml.getElementsByTagName("underground_region");
    featurelayerElements.forEach((layer) => {
      if (layer.value === "-1") {
        layer = undefined;
      } else {
        let obj = undergroundRegionElements[layer.value];
        let subtype = obj.children[1].value;
        let subdepth = obj.children[2].value;

        featureLayer = {
          type: subtype,
          depth: subdepth,
        };
        json.featureLayer = featureLayer;
      }
    });
  }

  const siteidElements = object.getElementsByTagName("site_id");
  if (siteidElements.length > 0) {
    const siteElements = legendsxml.getElementsByTagName("site");
    siteidElements.forEach((site) => {
      if (site.value === "-1") {
        site = undefined;
      } else {
        let obj = siteElements[site.value];
        let subname = obj.getElementsByTagName("name")[0].value;
        let subtype = obj.getElementsByTagName("type")[0].value;

        json.site = {
          name: subname,
          type: subtype,
        };
      }
    });
  }

  const attackinghfidElements = object.getElementsByTagName("attacking_hfid");
  if (attackinghfidElements.length > 0) {
    const attackingFigures = [];
    let index = 0;
    attackinghfidElements.forEach((attacker) => {
      let obj = histfigs[attacker.value];
      let subname = obj.getElementsByTagName("name")[0].value;
      let subrace = obj.getElementsByTagName("race")[0].value;
      let subcaste = obj.getElementsByTagName("caste")[0].value;
      let birthyear = obj.getElementsByTagName("birth_year")[0].value;

      attackingFigures[index] = {
        name: subname,
        race: subrace,
        sex: subcaste,
        birthYear: birthyear,
      };
      index++;
    });
    json.attackingFigures = attackingFigures;
  }

  const defendinghfidElements = object.getElementsByTagName("defending_hfid");
  if (defendinghfidElements.length > 0) {
    const defendingFigures = [];
    let index = 0;
    defendinghfidElements.forEach((defender) => {
      let obj = histfigs[defender.value];
      let subname = obj.getElementsByTagName("name")[0].value;
      let subrace = obj.getElementsByTagName("race")[0].value;
      let subcaste = obj.getElementsByTagName("caste")[0].value;
      let birthyear = obj.getElementsByTagName("birth_year")[0].value;

      defendingFigures[index] = {
        name: subname,
        race: subrace,
        sex: subcaste,
        birthYear: birthyear,
      };
      index++;
    });
    json.defendingFigures = defendingFigures;
  }
  const attackingSquads = LinkSquads(
    object,
    legendsxml,
    legendsplusxml,
    "attacking"
  );
  if (attackingSquads.length > 0) {
    json.attackingSquads = attackingSquads;
  }
  const defendingSquads = LinkSquads(
    object,
    legendsxml,
    legendsplusxml,
    "defending"
  );
  if (defendingSquads.length > 0) {
    json.defendingSquads = defendingSquads;
  }
  const outcome = object.getElementsByTagName("outcome")[0]?.value;
  if (outcome) {
    json.outcome = outcome;
  }

  const defendingenidElements = object.getElementsByTagName("defending_enid");
  if (defendingenidElements.length > 0) {
    let enid = defendingenidElements[0].value;
    json.defenderCiv = getEntityData(enid, legendsxml, legendsplusxml);
  }
  const attackingenidElements = object.getElementsByTagName("attacking_enid");
  if (attackingenidElements.length > 0) {
    let enid = attackingenidElements[0].value;
    json.attackerCiv = getEntityData(enid, legendsxml, legendsplusxml);
  }

  return json;
}

export default loadHistoricalEventCollection;
