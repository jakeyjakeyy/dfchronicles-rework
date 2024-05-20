import LinkSquads from "./linksquads";
import loadSubregion from "./subregion";
import getEntityData from "./entity";
import loadHistoricalEvent from "./historicalevent";

function loadHistoricalEventCollection(
  object: any,
  legendsxml: any,
  legendsplusxml: any
) {
  const json: any = {};
  const histfigs = legendsxml.historical_figures.historical_figure;
  json.world = {
    name: legendsplusxml.name,
    dwarvishname: legendsplusxml.altname,
  };
  json.id = object.id;
  json.startYear = object.start_year;
  json.endYear = object.end_year;

  if (object.hasOwnProperty("eventcol")) {
    const eventcolElements = Array.from(object.eventcol);
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

  if (object.hasOwnProperty("event")) {
    let eventElements = object.event;
    var events: any = [];
    if (!Array.isArray(eventElements)) eventElements = [eventElements];
    eventElements.forEach((event: any) => {
      events.push(
        loadHistoricalEvent(event, legendsxml, legendsplusxml, histfigs)
      );
    });
    json.events = events;
  }
  if (object.hasOwnProperty("type")) {
    json.type = object.type;
  }
  if (object.hasOwnProperty("name")) {
    json.name = object.name;
  }

  if (object.hasOwnProperty("war_eventcol")) {
    const warEventColElements = Array.from(object.war_eventcol);
    const isPartOfWar: any = {};
    const eventCollections =
      legendsxml.historical_event_collections.historical_event_collection;
    const data: any = Array.from(eventCollections).find(
      (eventCollection: any) => {
        let idElements = eventCollection.id;
        return idElements === warEventColElements;
      }
    );

    if (data) {
      isPartOfWar.name = data.name;
      isPartOfWar.id = data.id;
      isPartOfWar.startYear = data.start_year;
      isPartOfWar.endYear = data.end_year;
      let civid = data.aggressor_ent_id;
      isPartOfWar.agressorCivilization = getEntityData(
        civid,
        legendsxml,
        legendsplusxml
      );
      civid = data.defender_ent_id;
      isPartOfWar.defenderCivilization = getEntityData(
        civid,
        legendsxml,
        legendsplusxml
      );
    }
    json.isPartOfWar = isPartOfWar;
  }
  let subregion = loadSubregion(object, legendsxml, legendsplusxml);
  if (subregion) {
    json.subregion = subregion;
  }

  if (object.hasOwnProperty("feature_layer_id")) {
    let layer = object.feature_layer_id;
    let featureLayer: any = {};
    const undergroundRegionElements =
      legendsxml.underground_regions.underground_region;
    if (layer === -1) {
      layer = undefined;
    } else {
      let obj = undergroundRegionElements[Number(layer)];
      let subtype = obj.type;
      let subdepth = obj.depth;

      featureLayer = {
        type: subtype,
        depth: subdepth,
      };
      json.featureLayer = featureLayer;
    }
  }

  if (object.hasOwnProperty("site_id")) {
    let site = object.site_id;
    const siteElements = legendsxml.sites.site;
    if (site === -1) {
      site = undefined;
    } else {
      let obj = siteElements[site];
      let subname = obj.name;
      let subtype = obj.type;

      json.site = {
        name: subname,
        type: subtype,
      };
    }
  }

  if (object.hasOwnProperty("attacking_hfid")) {
    const attackinghfidElements = object.attacking_hfid;
    let attackingFigures: any = [];
    let index = 0;
    attackinghfidElements.forEach((attacker: any) => {
      let obj = histfigs[attacker];
      let subname = obj.name;
      let subrace = obj.race;
      let subcaste = obj.caste;
      let birthyear = obj.birth_year;

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

  if (object.hasOwnProperty("defending_hfid")) {
    const defendinghfidElements = object.defending_hfid;
    let defendingFigures: any = [];
    let index = 0;
    defendinghfidElements.forEach((defender: any) => {
      let obj = histfigs[defender];
      let subname = obj.name;
      let subrace = obj.race;
      let subcaste = obj.caste;
      let birthyear = obj.birth_year;

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
  if (attackingSquads) {
    json.attackingSquads = attackingSquads;
  }
  const defendingSquads = LinkSquads(
    object,
    legendsxml,
    legendsplusxml,
    "defending"
  );
  if (defendingSquads) {
    json.defendingSquads = defendingSquads;
  }

  if (object.hasOwnProperty("outcome")) {
    json.outcome = object.outcome;
  }

  if (object.hasOwnProperty("defending_enid")) {
    json.defenderCiv = getEntityData(
      object.defending_enid,
      legendsxml,
      legendsplusxml
    );
  }
  if (object.hasOwnProperty("attacking_enid")) {
    json.attackerCiv = getEntityData(
      object.attacking_enid,
      legendsxml,
      legendsplusxml
    );
  }
  return json;
}

export default loadHistoricalEventCollection;
