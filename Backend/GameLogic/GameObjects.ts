import autoBind from "auto-bind";
import TownAPITypes from "../../_types/ringuniversus/TownAPITypes";

// const getCoordsString = (coords: WorldCoords): CoordsString => {
//   return `${coords.x},${coords.y}` as CoordsString;
// };

export class GameObjects {
  /**
   * Map from a stringified representation of an x-y coordinate to an object that contains some more
   * information about the world at that location.
   */
  // private readonly coordsToLocation: Map<CoordsString, WorldLocation>;

  private ringInfos: Map<any, any>;
  private ringContants: any;
  private ringNextId: any;

  private townInfos: Map<any, any>;

  /**
   * Cached index of all known planet data.
   *
   * Warning!
   *
   * This should NEVER be set to directly! Any time you want to update a planet, you must call the
   * {@link GameObjects#setPlanet()} function. Following this rule enables us to reliably notify
   * other parts of the client when a particular object has been updated. TODO: what is the best way
   * to do this?
   *
   * @todo extract the pattern we're using for the field tuples
   *   - {planets, myPlanets, myPlanetsUpdated, planetUpdated$}
   *   - {artifacts, myArtifacts, myArtifactsUpdated, artifactUpdated$}
   *
   *   into some sort of class.
   */
  // private readonly planets: Map<LocationId, Planet>;

  constructor() {
    autoBind(this);

    this.ringInfos = new Map();
    this.townInfos = new Map();
  }

  // returns an empty planet if planet is not in contract
  // returns undefined if this isn't a planet, according to hash and coords
  // public getPlanetWithCoords(coords: WorldCoords): LocatablePlanet | undefined {
  //   const str = getCoordsString(coords);

  //   const location = this.coordsToLocation.get(str);
  //   if (!location) {
  //     return undefined;
  //   }

  //   return this.getPlanetWithLocation(location) as LocatablePlanet;
  // }

  // - returns an empty planet if planet is not in contract
  // - returns undefined if this isn't a planet, according to hash and coords
  // - if this planet hasn't been initialized in the client yet, initializes it
  // public getPlanetWithLocation(
  //   location: WorldLocation | undefined
  // ): Planet | undefined {
  //   if (!location) return undefined;

  //   const planet = this.planets.get(location.hash);
  //   if (planet) {
  //     //   this.updatePlanetIfStale(planet);
  //     return planet;
  //   }

  //   // return a default unowned planet
  //   // const defaultPlanet = this.defaultPlanetFromLocation(location);
  //   // this.setPlanet(defaultPlanet);

  //   return undefined;
  // }

  //   private updatePlanetIfStale(planet: Planet): void {
  //     const now = Date.now();
  //     if (now / 1000 - planet.lastUpdated > 1) {
  //       updatePlanetToTime(
  //         planet,
  //         this.getPlanetArtifacts(planet.locationId),
  //         now,
  //         this.contractConstants,
  //         this.setPlanet
  //       );
  //     }
  //   }

  public replaceRingInfoFromContractData(rid, info, nextId, constants) {
    this.ringInfos.set(rid, info);
    this.ringContants = constants;
    this.ringNextId = nextId;
  }

  public replaceTownInfoFromContractData(tid, info) {
    this.townInfos.set(tid, TownAPITypes.transformTownInfo(info));
  }

  /**
   * Ring getter
   */
  public getRingInfo() {
    return this.ringInfos;
  }

  public getRingConfigs() {
    return { constants: this.ringContants, nextId: this.ringNextId };
  }

  public getTownInfo() {
    return this.townInfos;
  }
}
