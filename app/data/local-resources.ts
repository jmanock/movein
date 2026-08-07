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
  "32117": "North Daytona Beach ZIP 32117 includes city and county service contexts. Use the possible-provider records as a shortlist, then confirm electric territory, municipal utility eligibility, collection responsibility, and building-level internet with the complete address.",
  "32118": "Coastal ZIP 32118 includes homes, condos, rentals, and other buildings that may manage services differently. Confirm city utility eligibility, electric territory, collection, and any building-specific internet or account arrangement before scheduling service.",
  "32119": "South Daytona Beach-area ZIP 32119 can cross local service responsibilities. The reviewed records identify official starting points, but the mailing city alone does not establish electric, water, sewer, trash, or internet availability.",
  "32127": "Port Orange ZIP 32127 has entered the verification queue with a confirmed Volusia County relationship. City service eligibility, electric territory, and collection responsibility still require source review.",
  "32129": "For Port Orange ZIP 32129, MoveIn begins with jurisdiction rather than assumptions about the mailing city. The county and internet tools are published as safe starting points while core utility research continues.",
  "32168": "New Smyrna Beach ZIP 32168 spans a substantial inland area in Volusia County. Wells, septic systems, municipal connections, and collection responsibility can vary, so this page is held from indexing during research.",
  "32174": "Ormond Beach ZIP 32174 is being documented using official provider and government records. Until that work is complete, movers should verify the parcel and avoid choosing a utility solely from the ZIP.",
  "32701": "Altamonte Springs ZIP 32701 is entirely within Seminole County as a Census tabulation area, but that does not establish the service provider for a home. Begin with county resources while MoveIn verifies electric, water, sewer, and collection records.",
  "32707": "Casselberry ZIP 32707 is queued for a full utility review. Residents should use Seminole County resources for jurisdiction questions and enter the complete address in official provider tools before starting any account.",
  "32708": "Winter Springs ZIP 32708 has a confirmed Seminole County geography record, while provider research remains open. City limits, utility infrastructure, and postal boundaries can produce different answers for nearby properties.",
  "32714": "For an Altamonte Springs mailing address in 32714, first determine whether the parcel is inside a municipality or unincorporated Seminole County. MoveIn keeps this page out of search indexing until every core category is sourced.",
  "32724": "East DeLand ZIP 32724 can include properties inside and outside municipal service boundaries. Confirm City water, sewer, and collection eligibility, check the electric territory, and verify whether a parcel uses sewer or septic.",
  "32726": "Eustis ZIP 32726 has joined the Lake County pilot as a pending record. The exact property must be checked for city limits, utility connections, collection service, and building-level internet options.",
  "32750": "Longwood ZIP 32750 is part of the Seminole County research expansion. The county link is available now; electric, water, sewer, and collection details will appear only after official territory evidence is documented.",
  "32765": "Oviedo ZIP 32765 is being reviewed service by service instead of inheriting providers from the city name. Use the official county starting point and provider address checks until the local verification checklist is complete.",
  "32766": "The 32766 Oviedo mailing area includes properties where wells, septic systems, municipal service, or county responsibilities may differ. MoveIn is researching those distinctions before publishing a provider shortlist.",
  "32773": "South Sanford ZIP 32773 spans city and unincorporated Seminole County contexts. City water, sewer, and collection may apply to eligible addresses, while electric territory and every service still require a complete-address check.",
  "32778": "Tavares ZIP 32778 now offers official Lake County and broadband starting points. MoveIn has not yet completed the evidence needed to name electric, water, sewer, or trash providers for the area.",
  "32803": "Orlando ZIP 32803 includes established neighborhoods and properties whose city-service eligibility still depends on the parcel. OUC and City resources are official starting points; confirm water, sewer, collection, electric, and internet for the complete address.",
  "32804": "For Orlando ZIP 32804, building type and municipal boundaries can affect water, sewer, trash, and internet setup. Verify that the property is inside the relevant service area before opening or transferring an account.",
  "32806": "Orlando ZIP 32806 has reviewed OUC, City of Orlando, Orange County, and address-level internet starting points. These records remain possible providers rather than a ZIP-wide guarantee because local boundaries can divide the mailing area.",
  "32809": "ZIP 32809 uses Orlando as its mailing city, but city boundaries and OUC service territory do not cover every mailing address identically. Confirm electric, water, sewer, trash, and internet separately for the property.",
  "34715": "Clermont-area ZIP 34715 can include municipal, county, private, well, or septic arrangements. The reviewed City, electric-territory, county, and internet links narrow the search, but each service must be confirmed for the parcel.",
  "34731": "Fruitland Park ZIP 34731 is in the Lake County verification queue. Movers can use the county tools today, but the page will not become indexable until every core category has useful official information.",
  "34736": "Groveland ZIP 34736 covers a broad Lake County area where city services may not reach every mailing address. Provider research will distinguish municipal, county, cooperative, and property-specific arrangements.",
  "34739": "Kenansville ZIP 34739 is a rural Osceola County area where private wells, septic systems, and address-specific service may be especially important. MoveIn will not substitute countywide assumptions for parcel evidence.",
  "34743": "Kissimmee ZIP 34743 can involve KUA, Toho Water Authority, city or county collection, and building-specific internet options. Confirm authority territory and municipal jurisdiction independently before opening service.",
  "34744": "For Kissimmee ZIP 34744, the reviewed KUA, Toho, City, county, and internet resources provide a practical shortlist. Exact-address confirmation remains essential because those service boundaries do not match the full postal area.",
  "34746": "Kissimmee ZIP 34746 includes varied residential, rental, and visitor-area properties where a building or community may manage some services. Confirm electric, water, sewer, collection, and internet directly for the property.",
  "34747": "ZIP 34747 is associated with Kissimmee mailing addresses and includes large planned communities. Property management may control some services, making exact-address confirmation more useful than a broad ZIP assertion.",
  "34753": "Mascotte ZIP 34753 is a research-stage location rather than a completed utility result. MoveIn is checking local government, provider contacts, start-service actions, and source dates before promoting the page.",
  "34758": "Kissimmee ZIP 34758 has been added without copying providers from the already-reviewed 34741 page. MoveIn is collecting official evidence for each utility category and local jurisdiction.",
  "34761": "Ocoee ZIP 34761 is in the pilot research queue for Orange County. Municipal limits matter for water and collection, while electric territory and internet availability require their own official checks.",
  "34771": "St. Cloud ZIP 34771 may involve OUC electric service, Toho water or sewer, City collection, Osceola County responsibilities, and property-managed arrangements. Confirm every service for the complete address.",
  "34772": "St. Cloud ZIP 34772 has reviewed OUC, Toho, City, county, and provider-owned internet starting points. Exact-address confirmation remains essential because City and utility boundaries do not follow the full postal area.",
  "34786": "Windermere ZIP 34786 includes a postal identity that may extend beyond town limits. This research-stage page directs movers to official sources without treating the mailing city as proof of utility jurisdiction.",
  "34787": "Winter Garden ZIP 34787 covers a large and growing Orange County area where one ZIP-level answer would be misleading. MoveIn will publish provider findings only after address-sensitive boundaries and sources are reviewed.",
  "34788": "Leesburg ZIP 34788 includes municipal and Lake County contexts where electric, water, sewer, and collection responsibility can differ. Use the reviewed official links as possible starting points and verify the complete property address.",
};

export function resourcesForCounty(county: string | null) {
  return county ? countyResources[county] : undefined;
}
