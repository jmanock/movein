export type CountyProfile = {
  name: "Orange" | "Seminole" | "Lake" | "Volusia" | "Osceola";
  slug: string;
  description: string;
  overview: string;
  cities: string[];
};

export const countyProfiles: CountyProfile[] = [
  { name: "Orange", slug: "orange-county-utilities", description: "Find reviewed electric, water, sewer, internet, trash, emergency, and local-government starting points for Orange County ZIP codes.", overview: "Orange County combines municipal utilities, county services, OUC territory, private utilities, and address-specific internet networks. Orlando or another mailing city does not by itself establish the provider for a parcel.", cities: ["Orlando", "Winter Park", "Apopka", "Ocoee", "Windermere", "Winter Garden"] },
  { name: "Seminole", slug: "seminole-county-utilities", description: "Find reviewed utility and moving resources for Sanford, Lake Mary, and other Seminole County ZIP codes.", overview: "Seminole County ZIPs can cross city limits, unincorporated areas, electric territories, and municipal utility boundaries. Confirm each service separately with the complete address.", cities: ["Sanford", "Lake Mary", "Altamonte Springs", "Casselberry", "Winter Springs", "Longwood", "Oviedo"] },
  { name: "Lake", slug: "lake-county-utilities", description: "Find reviewed electric, water, sewer, trash, internet, and county resources for Lake County ZIP codes.", overview: "Lake County includes municipal utilities, cooperative and investor-owned electric territory, private systems, wells, and septic properties. A city name is only a starting point for service research.", cities: ["Leesburg", "Clermont", "Mount Dora", "Eustis", "Tavares", "Fruitland Park", "Groveland", "Mascotte"] },
  { name: "Volusia", slug: "volusia-county-utilities", description: "Find reviewed utility, outage, internet, collection, and local resources for Volusia County ZIP codes.", overview: "Volusia County contains several cities and electric territories, plus coastal, inland, municipal, and unincorporated service arrangements. Building type and parcel location can change the result.", cities: ["Daytona Beach", "DeLand", "Port Orange", "New Smyrna Beach", "Ormond Beach"] },
  { name: "Osceola", slug: "osceola-county-utilities", description: "Find reviewed KUA, Toho, collection, internet, emergency, and local resources for Osceola County ZIP codes.", overview: "Osceola County utility service can involve KUA, OUC, Toho Water Authority, municipalities, county programs, private systems, and community-managed services. Verify the territory and property independently.", cities: ["Kissimmee", "St. Cloud", "Kenansville"] },
];

export const countiesByName = new Map(countyProfiles.map((county) => [county.name, county]));

export function countyPath(county: string | null | undefined) {
  const profile = countyProfiles.find((candidate) => candidate.name === county);
  return profile ? `/${profile.slug}` : "/florida-utilities";
}
