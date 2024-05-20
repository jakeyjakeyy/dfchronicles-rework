import getEntityData from "./entity";

function LinkSquads(
  object: any,
  legendsxml: any,
  legendsplusxml: any,
  type: any
) {
  let squadRaceTag =
    type === "attacking" ? "attacking_squad_race" : "defending_squad_race";
  let squadEntityTag =
    type === "attacking"
      ? "attacking_squad_entity_pop"
      : "defending_squad_entity_pop";
  let squadNumberTag =
    type === "attacking" ? "attacking_squad_number" : "defending_squad_number";
  let squadDeathsTag =
    type === "attacking" ? "attacking_squad_deaths" : "defending_squad_deaths";
  let squadSiteTag =
    type === "attacking" ? "attacking_squad_site" : "defending_squad_site";

  const squadNumbers = object[squadNumberTag];
  const squadDeaths = object[squadDeathsTag];
  const squadSites = object[squadSiteTag];
  const sites = legendsplusxml.sites.site;
  const squadRaces = object[squadRaceTag];
  const squadCivs = object[squadEntityTag];

  if (!squadNumbers) {
    return;
  }
  // Create an array with a separate object for each squad
  let attackingSquads = Array(squadNumbers.length)
    .fill(null)
    .map(() => <any>{});

  for (let i = 0; i < squadNumbers.length; i++) {
    attackingSquads[i].number = squadNumbers[i];

    if (squadDeaths[i]) {
      attackingSquads[i].deaths = squadDeaths[i];
    }

    if (squadSites[i] && sites[squadSites[i]]) {
      let obj = legendsxml.sites.site[squadSites[i] - 1];
      let subname = obj.name;
      let subtype = obj.type;
      attackingSquads[i].fromSite = {
        name: subname,
        type: subtype,
      };
    }
    if (squadRaces[i]) {
      attackingSquads[i].race = squadRaces[i];
    }
    if (squadCivs[i]) {
      const fromCiv = getEntityData(squadCivs[i], legendsxml, legendsplusxml);
      if (fromCiv) {
        attackingSquads[i].fromCiv = fromCiv;
      } else {
        continue;
      }
    }
  }
  return attackingSquads;
}

export default LinkSquads;
