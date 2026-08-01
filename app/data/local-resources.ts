export type LocalResource = {
  title: string;
  organization: string;
  url: string;
  description: string;
  icon: "BadgeCheck" | "BookOpen" | "Bus" | "Car" | "CloudSun" | "ExternalLink" | "GraduationCap" | "Landmark" | "Mail" | "Recycle" | "ShieldAlert" | "Vote";
};

export type CountyResourceProfile = {
  emergencyManagement: LocalResource;
  library: LocalResource;
  residentServices: LocalResource;
  propertyAppraiser: LocalResource;
};

export const statewideMoveResources: LocalResource[] = [
  { title: "Change your mailing address", organization: "United States Postal Service", url: "https://moversguide.usps.com/", description: "Submit mail forwarding through the official USPS Movers Guide.", icon: "Mail" },
  { title: "Update your license or vehicle record", organization: "Florida Highway Safety and Motor Vehicles", url: "https://www.flhsmv.gov/name-and-address-changes/", description: "Review Florida address-change steps for driver and vehicle records.", icon: "Car" },
  { title: "Register or update your voter record", organization: "Florida Division of Elections", url: "https://dos.fl.gov/elections/for-voters/voter-registration/online-voter-registration", description: "Start from Florida's official elections page for online registration and record updates.", icon: "Vote" },
  { title: "Check flood risk", organization: "Federal Emergency Management Agency", url: "https://msc.fema.gov/portal/home", description: "Search the official FEMA Flood Map Service Center by address.", icon: "CloudSun" },
  { title: "Prepare for Florida hazards", organization: "Florida Division of Emergency Management", url: "https://www.floridadisaster.org/planprepare/", description: "Build a household plan for hurricanes, flooding, outages, and other hazards.", icon: "ShieldAlert" },
];

export const regionalCommunityResources: LocalResource[] = [
  { title: "Central Florida public transportation", organization: "LYNX", url: "https://www.golynx.com/", description: "Official bus and mobility information for Orange, Osceola, and Seminole counties.", icon: "Bus" },
  { title: "Volusia public transportation", organization: "Votran", url: "https://www.votran.org/", description: "Official routes, schedules, fares, and mobility services in Volusia County.", icon: "Bus" },
  { title: "Lake County public transportation", organization: "LakeXpress", url: "https://www.lakecountyfl.gov/departments/public_works/transit/", description: "Official routes, schedules, fares, and transit information for Lake County.", icon: "Bus" },
  { title: "Seminole County Public Schools", organization: "Seminole County Public Schools", url: "https://www.scps.k12.fl.us/", description: "Official school district information, enrollment, calendars, and family resources.", icon: "GraduationCap" },
  { title: "Orange County Public Schools", organization: "Orange County Public Schools", url: "https://www.ocps.net/", description: "Official school district information, enrollment, calendars, and family resources.", icon: "GraduationCap" },
  { title: "Volusia County Schools", organization: "Volusia County Schools", url: "https://www.vcsedu.org/", description: "Official school district information, enrollment, calendars, and family resources.", icon: "GraduationCap" },
  { title: "Lake County Schools", organization: "Lake County Schools", url: "https://www.lake.k12.fl.us/", description: "Official school district information, enrollment, calendars, and family resources.", icon: "GraduationCap" },
  { title: "Osceola County Schools", organization: "School District of Osceola County", url: "https://www.osceolaschools.net/", description: "Official school district information, enrollment, calendars, and family resources.", icon: "GraduationCap" },
];

export const countyResources: Record<string, CountyResourceProfile> = {
  Seminole: {
    emergencyManagement: { title: "Seminole County emergency management", organization: "Seminole County", url: "https://www.seminolecountyfl.gov/departments-services/prepare-seminole/emergency-management", description: "Preparedness, alerts, shelter information, and county emergency updates.", icon: "ShieldAlert" },
    library: { title: "Seminole County Public Library", organization: "Seminole County", url: "https://www.seminolecountyfl.gov/departments-services/parks-recreation/seminole-county-library/", description: "Find branches, library cards, digital services, and local programs.", icon: "BookOpen" },
    residentServices: { title: "Seminole County resident services", organization: "Seminole County", url: "https://www.seminolecountyfl.gov/departments-services/guide-to-county-services/for-residents", description: "Official starting point for recycling, parks, roads, water, and county services.", icon: "Landmark" },
    propertyAppraiser: { title: "Property and homestead information", organization: "Seminole County Property Appraiser", url: "https://www.scpafl.org/", description: "Search property records and review homestead-exemption information.", icon: "BadgeCheck" },
  },
  Orange: {
    emergencyManagement: { title: "Orange County emergency management", organization: "Orange County", url: "https://www.orangecountyfl.net/EmergencySafety/EmergencyManagement.aspx", description: "County emergency alerts, preparedness, shelters, and recovery information.", icon: "ShieldAlert" },
    library: { title: "Orange County Library System", organization: "Orange County Library System", url: "https://ocls.org/", description: "Find library locations, eligibility, learning tools, and community programs.", icon: "BookOpen" },
    residentServices: { title: "Orange County resident services", organization: "Orange County", url: "https://www.orangecountyfl.net/Residents.aspx", description: "Official county directory for waste, parks, roads, permits, and resident help.", icon: "Landmark" },
    propertyAppraiser: { title: "Property and homestead information", organization: "Orange County Property Appraiser", url: "https://www.ocpafl.org/", description: "Search property records and review homestead-exemption information.", icon: "BadgeCheck" },
  },
  Volusia: {
    emergencyManagement: { title: "Volusia County emergency management", organization: "Volusia County", url: "https://www.volusia.org/services/emergency-services/emergency-management/", description: "Preparedness, evacuation, shelter, flood, and county emergency information.", icon: "ShieldAlert" },
    library: { title: "Volusia County Public Library", organization: "Volusia County", url: "https://www.volusialibrary.org/", description: "Find branches, cards, digital collections, technology, and events.", icon: "BookOpen" },
    residentServices: { title: "Volusia County resident services", organization: "Volusia County", url: "https://www.volusia.org/services/", description: "Official directory for solid waste, public safety, parks, permits, and other services.", icon: "Landmark" },
    propertyAppraiser: { title: "Property and homestead information", organization: "Volusia County Property Appraiser", url: "https://vcpa.vcgov.org/", description: "Search property records and review homestead-exemption information.", icon: "BadgeCheck" },
  },
  Lake: {
    emergencyManagement: { title: "Lake County emergency management", organization: "Lake County", url: "https://c.lakecountyfl.gov/offices/emergency_management/", description: "Preparedness, hurricane guides, alerts, shelters, and emergency contacts.", icon: "ShieldAlert" },
    library: { title: "Lake County Library Services", organization: "Lake County", url: "https://c.lakecountyfl.gov/offices/", description: "Open the official county office directory and choose Library Services for locations, cards, and programs.", icon: "BookOpen" },
    residentServices: { title: "Lake County public services", organization: "Lake County", url: "https://gis.lakecountyfl.gov/MyPublicServices/", description: "Use the official address tool to find facilities and curbside or drop-off services.", icon: "Recycle" },
    propertyAppraiser: { title: "Property and homestead information", organization: "Lake County Property Appraiser", url: "https://www.lakecopropappr.com/", description: "Search property records and review homestead-exemption information.", icon: "BadgeCheck" },
  },
  Osceola: {
    emergencyManagement: { title: "Osceola County emergency management", organization: "Osceola County", url: "https://www.osceola.org/Services/Emergency-Management", description: "Alert Osceola, hurricane, flood, shelter, and preparedness information.", icon: "ShieldAlert" },
    library: { title: "Osceola Library System", organization: "Osceola County", url: "https://www.osceola.org/Community/Library", description: "Find branches, library cards, digital services, and local events.", icon: "BookOpen" },
    residentServices: { title: "Osceola County services", organization: "Osceola County", url: "https://www.osceola.org/Services", description: "Official directory for solid waste, parks, roads, animal services, and resident help.", icon: "Landmark" },
    propertyAppraiser: { title: "Property and homestead information", organization: "Osceola County Property Appraiser", url: "https://www.property-appraiser.org/", description: "Search property records and review homestead-exemption information.", icon: "BadgeCheck" },
  },
};

export const zipMoveOverviews: Record<string, string> = {
  "32114": "This Daytona Beach mailing area includes a mix of residential neighborhoods, apartments, and properties whose city-service eligibility must be confirmed by address. Start with the listed utilities, then check Volusia County and city boundaries before assuming who handles water or collection.",
  "32703": "Apopka-area addresses can cross municipal and unincorporated Orange County service arrangements. Confirm city limits before opening water or trash service, and use an official territory tool for electric service.",
  "32720": "This west DeLand area can include city and county jurisdictions with different utility and collection responsibilities. Verify the parcel before relying on the DeLand mailing name alone.",
  "32746": "Lake Mary mailing addresses do not all sit inside the city utility boundary. Treat water, sewer, trash, and electric records as official starting points and confirm the complete property address.",
  "32757": "Mount Dora-area service can depend on whether the property is inside municipal limits or in surrounding Lake County. Confirm each account separately, especially water, sewer, trash, and electric service.",
  "32771": "Sanford mailing addresses can span city and unincorporated Seminole County areas. City water, sewer, and solid-waste programs may apply to some properties while different arrangements apply nearby.",
  "32789": "Winter Park mailing addresses can extend beyond the city's utility boundaries. Confirm municipal electric, water, sewer, and collection eligibility using the complete address before scheduling service.",
  "32801": "Downtown Orlando addresses commonly start with OUC and city service resources, but property type and service territory still matter. Apartments and mixed-use buildings may also manage some services through the property.",
  "34711": "Clermont-area properties may use city, county, private, well, or septic arrangements depending on the parcel. Confirm both jurisdiction and each service before assuming the mailing city identifies the provider.",
  "34741": "Kissimmee-area addresses can involve KUA, Toho Water Authority, city or county collection, and building-specific internet choices. Confirm the exact address because these boundaries do not match the full ZIP.",
  "34748": "Leesburg-area utility service can vary between municipal, cooperative, county, and private arrangements. Use the provider actions below to verify the property instead of choosing from the city name alone.",
  "34769": "St. Cloud residents may use different organizations for electric service, water and sewer, and collection. Confirm each service independently and check whether the property or community manages any account.",
};

export function resourcesForCounty(county: string | null) {
  return county ? countyResources[county] : undefined;
}
