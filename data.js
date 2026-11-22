/* ============================================================
   YOUR LISTINGS — edit this file only.
   Put your photos in the /images folder and list 5 paths per listing.
   lat/lng: right-click the spot on Google Maps and click the coordinates to copy them.
   The map shows an APPROXIMATE area (a circle), not the exact pin.
   ============================================================ */
const LISTINGS = [
  {
    id: 1,
    name: "KingCess Dormitory",                 // Name of listing
    location: "2057a Road 7, Sampaloc/Sta. Mesa Border, Manila",       // Location
    lat: 14.5993312, lng: 121.0075061,
    price: 7000,                             // monthly rent (PHP)
    type: "Dormitory",                           // Apartment | Condo | Studio | House
    occupants: 1,                             // max occupants
    amenities: ["WiFi", "Aircon", "Security"],
    rules: "No smoking. No pets. Quiet hours after 10 PM.",
    availability: "2026-11-01",
    owner: "Lena Cruz",
    contact: "0917-111-2222",
    description: "Around ₱7,000 per month for Solo Lady Rooms. Exclusively for women. Rent includes electricity, water, Wi-Fi, and a single bed with a foam mattress. An air conditioner is available but billed separately via an individual submeter (₱15 per kWh).",   // Details
    landmarks: [                              // Landmark / nearest establishments, schools, universities
      ": Positioned midway between the PUP Main Campus and the PUP College of Communication (COC), near Teresa Street."
      
    ],
    link: "https://www.facebook.com/search/top/?q=KingCess%20Dormitory%20Facebook%20Page",        // Link of website or listing post
    photos: [                                 // 5 photos
      "images/listing1/Picture1.jpg", "images/listing1/Picture2.jpg", "images/listing1/Picture3.jpg",
      "images/listing1/Picture4.jpg", "images/listing1/Picture5.jpg"
    ]
  },
  {
    id: 2,
    name: "Pureza Station Dormitory",
    location: "329 C. De Dios St., Barangay 632, Sta. Mesa, Manila",
    lat: 14.6004776, lng: 121.0002049,
    price: 2000, type: "Dormitory", occupants: 4,
    amenities: ["Parking", "Aircon", "Pet-friendly", "Furnished"],
    rules: "Max 4 occupants.",
    availability: "2026-11-15", owner: "Rafael Tan", contact: "0917-333-4444",
    description: "Starts at ₱2,000 to ₱3,500 per month per slot. Offers separate male and female shared options (both fan and nighttime air-conditioned rooms). Amenities include privacy curtains, in-room refrigerators, shower heaters, private cabinets, and a curfew policy from 11:00 PM to 5:00 AM.",
    landmarks: ["Within walking distance of the LRT-2 Pureza Station, SM Savemore, and EARIST."],
    link: "https://www.facebook.com/search/top/?q=Pureza%20Station%20Dormitory%20Facebook%20Info",
    photos: ["images/listing2/Picture6.jpg","images/listing2/Picture7.jpg","images/listing2/Picture8.jpg","images/listing2/Picture9.jpg","images/listing2/Picture10.jpg"]
  },
  {
    id: 3,
    name: "V House Road 2 Bedspace ",
    location: "4786 Road 2, St. V. Mapa, Sta. Mesa, Manila",
    lat: 14.6022312, lng: 121.0152258,
    price: 4200, type: "Bedspace", occupants: 3,
    amenities: ["Security", "Aircon", "Furnished", "WiFi"],
    rules: "No overnight guests without notice.",
    availability: "2026-10-30", owner: "Ana Dizon", contact: "0917-555-6666",
    description: "₱4,200 per month (all-inclusive). Requires a standard 1-month advance and 1-month deposit with a minimum 5-month stay commitment. Rent includes timed air conditioning (8:00 PM to 8:00 AM), Wi-Fi access, water, utility storage containers, and pre-installed Uratex foam mattress double decks. Protected by security cameras.",
    landmarks: ["Just a 3-minute journey from SM City Santa Mesa (Centerpoint) and walking distance to the LRT-2 V.Mapa Station."],
    link: "https://www.facebook.com/search/top/?q=V%20House%20Road%202%20Bedspace%20PUP%20Dorm",
    photos: ["images/listing3/Picture11.jpg","images/listing3/Picture12.jpg","images/listing3/Picture13.jpg","images/listing3/Picture14.jpg","images/listing3/Picture15.jpg"]
  },
  {
    id: 4,                                    // must be a new number for every listing
    name: "Morningside Terrace Gated Bedspace ",
    location: "Aliw-iw St., Morningside Terrace Subdivision, Sta. Mesa, Manila",
    lat: 14.5969306, lng: 121.0200638,              // right-click the spot on Google Maps and click the coordinates to copy
    price: 5500,                                 // numbers only, no ₱ or commas
    type: "Bedspace",                        // Apartment | Condo | Studio | House
    occupants: 3,                             // max number of people
    amenities: ["WiFi", "Aircon", "Furnished"],            // pick from: WiFi, Parking, Aircon, Pet-friendly, Pool, Furnished, Security, Elevator
    rules: "No guest without notice",
    availability: "2026-11-01",               // year-month-day
    owner: "",
    contact: "",
    description: "Competitive communal house rates (inquire directly via contact). Tailored exclusively for male boarders (students/professionals) inside a secure, 3-floor gated apartment layout. Boarders get full apartment privileges, including use of a washing machine, refrigerator, stove, lounge television, built-in cabinets, and PLDT Wi-Fi.",
    landmarks: [
      "Positioned safely inside a residential subdivision near Our Lady of Lourdes Hospital and Shakey’s Lourdes"
    ],
    link: "https://www.facebook.com/photo/?fbid=26452320791021002&set=pcb.26452321854354229",                         // link to your website or listing post
    photos: [
      "images/listing4/Picture16.jpg", "images/listing4/Picture17.jpg", "images/listing4/Picture18.jpg",
      "images/listing4/Picture19.jpg", "images/listing4/Picture20.jpg"
    ]
  },
  {
    id: 5,                                    // must be a new number for every listing
    name: "Suzy 443 Shared Housing ",
    location: "Old Sta. Mesa Street, Manila",
    lat: 14.5998972, lng: 121.0134273,              // right-click the spot on Google Maps and click the coordinates to copy
    price: 3200,                                 // numbers only, no ₱ or commas
    type: "Apartment",                        // Apartment | Condo | Studio | House
    occupants: 2,                             // max number of people
    amenities: ["WiFi", "Parking", "Elevator"],            // pick from: WiFi, Parking, Aircon, Pet-friendly, Pool, Furnished, Security, Elevator
    rules: "Stay clean",
    availability: "2026-11-01",               // year-month-day
    owner: "",
    contact: "",
    description: "₱3,200 per month all-in (promotional 1-month deposit). Brand new modern building featuring a dedicated student study hub. Includes free electricity, water, and Wi-Fi. Rooms host a private bathroom (CR) with a shower and an individual kitchen nook with dining setups. Cooking and light laundry are fully permitted.",
    landmarks: [
      "A short 5-minute walk to SM Centerpoint and the V.Mapa LRT Station."
    ],
    link: "https://www.suzyrent.com/for-rent/metro-manila/studio/studio-unit-near-dlsu-manila-across-henry-sy-bldg-manila-metro-manila-kqz6/suzy-1146",                         // link to your website or listing post
    photos: [
      "images/listing5/Picture22.jpg", "images/listing5/Picture23.jpg", "images/listing5/Picture24.jpg",
      "images/listing5/Picture25.jpg", "images/listing5/Picture26.jpg"
    ]
  },
    {
    id: 6,                                    // must be a new number for every listing
    name: "Dreiven Residences Sta Mesa",
    location: "21 Ruiloba St., Sta. Mesa, Manila",
    lat: 14.598635, lng: 120.999508,              // right-click the spot on Google Maps and click the coordinates to copy
    price: 2300,                                 // numbers only, no ₱ or commas
    type: "Apartment",                        // Apartment | Condo | Studio | House
    occupants: 3,                             // max number of people
    amenities: ["WiFi", "Aircon", "Security"],            // pick from: WiFi, Parking, Aircon, Pet-friendly, Pool, Furnished, Security, Elevator
    rules: "",
    availability: "2026-11-01",               // year-month-day
    owner: "",
    contact: "",
    description: "₱2,300 per month. Budget-friendly transient and short-term co-living options. Operates as a budget partner accommodation (RedPartner) featuring compact 7-square-meter private or shared bunk-bed setups. Safe, straightforward, no-frills arrangement focused on students or out-of-town academic testers.",
    landmarks: [
      "Situated perfectly for students alternating between the PUP Main Campus and the EARIST campus."
    ],
    link: "https://www.facebook.com/search/top/?q=Dreiven%20Residences%20Official%20Page.",                         // link to your website or listing post
    photos: [
      "images/listing6/Picture27.jpg", "images/listing6/Picture28.jpg", "images/listing6/Picture29.jpg",
      "images/listing4/Picture30.jpg", "images/listing6/Picture31.jpg"
    ]
  },
  
];
