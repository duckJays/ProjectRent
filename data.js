/* ============================================================
   YOUR LISTINGS — edit this file only.
   Put your photos in the /images folder and list 5 paths per listing.
   lat/lng: right-click the spot on Google Maps and click the coordinates to copy them.
   The map shows an APPROXIMATE area (a circle), not the exact pin.
   ============================================================ */
const LISTINGS = [
  {
    id: 1,
    name: "Prima Residences",                 // Name of listing
    location: "Quezon Avenue, Brgy. Tatalon, Quezon City, Metro Manila",       // Location
    lat: 14.62318904409303, lng: 121.01361318571527,
    price: 4250,                             // monthly rent (PHP)
    type: "Apartment",                           // Apartment | Condo | Studio | House
    occupants: 1,                             // max occupants
    amenities: ["WiFi", "Aircon", "Security"],
    rules: "No smoking. No pets. Quiet hours after 10 PM.",
    availability: "2026-11-01",
    owner: "Lena Cruz",
    contact: "0917-111-2222",
    description: "₱4,250 per month. Dormitory type. Fully furnished room with individual closets, 24/7 security, CCTV, fully air-conditioned and fire protection system.",   // Details
    landmarks: [                              // Landmark / nearest establishments, schools, universities
      "Near Sto. Domingo Church - 5 min walk",
      "Fisher Mall - 10 min ride",
      "UST, FEU and St. Jude College. - 20 min walk"
    ],
    link: "https://www.facebook.com/",        // Link of website or listing post
    photos: [                                 // 5 photos
      "images/listing1/Picture1.jpg", "images/listing1/Picture2.jpg", "images/listing1/Picture3.jpg",
      "images/listing1/Picture4.jpg", "images/listing1/Picture5.jpg"
    ]
  },
  {
    id: 2,
    name: "University Convenience Flats / Vista Taft Dorm Rooms",
    location: "Taft Avenue, Malate/Ermita, Manila",
    lat: 14.565266042220076, lng: 120.99386470861876,
    price: 4200, type: "Apartment", occupants: 4,
    amenities: ["Parking", "Aircon", "Pet-friendly", "Furnished"],
    rules: "Max 4 occupants.",
    availability: "2026-11-15", owner: "Rafael Tan", contact: "0917-333-4444",
    description: "Starts at ₱4,200 per month, per head. Student study lounge, 24/7 security, shower heater, high-speed elevators and commercial establishments at the ground floor.",
    landmarks: ["De La Salle University (DLSU) - 10 min walk", "DLS-College of Saint Benilde (CSB) - 7 min walk", "St. Scholastica's College (SSC), LRT-1 Vito Cruz Station."],
    link: "https://www.facebook.com/",
    photos: ["images/listing2/Picture6.jpg","images/listing2/Picture7.jpg","images/listing2/Picture8.jpg","images/listing2/Picture9.jpg","images/listing2/Picture10.jpg"]
  },
  {
    id: 3,
    name: ". Green Residences Student Suites ",
    location: "Taft Ave., Malate, Manila",
    lat: 14.565266042220076, lng: 120.99386470861876,
    price: 6500, type: "Condo", occupants: 3,
    amenities: ["Pool", "Security", "Elevator", "Furnished", "WiFi"],
    rules: "No overnight guests without notice.",
    availability: "2026-10-30", owner: "Ana Dizon", contact: "0917-555-6666",
    description: "Bedspace / shared condo sharing. ₱4,500–₱6,500 per month, per head. Study hall, swimming pool, game room, SM Hypermarket at the ground floor, 24/7 security",
    landmarks: ["DLSU, CSB, St. Scholastica's College - 6 min ride", "De La Salle-College of St. Benilde - 15 min ride"],
    link: "https://www.facebook.com/",
    photos: ["images/listing3/Picture11.jpg","images/listing3/Picture12.jpg","images/listing3/Picture13.jpg","images/listing3/1Picture4.jpg","images/listing3/5.jpg"]
  },
  {
    id: 4,                                    // must be a new number for every listing
    name: "Escopa III Apartments / Student Rooms ",
    location: "Katipunan Avenue Ext., Escopa III, Quezon City",
    lat: 14.629945819609151, lng: 121.07401217978428,              // right-click the spot on Google Maps and click the coordinates to copy
    price: 5500,                                 // numbers only, no ₱ or commas
    type: "Apartment",                        // Apartment | Condo | Studio | House
    occupants: 1,                             // max number of people
    amenities: ["WiFi", "Aircon", "Furnished"],            // pick from: WiFi, Parking, Aircon, Pet-friendly, Pool, Furnished, Security, Elevator
    rules: "No guest without notice",
    availability: "2026-11-01",               // year-month-day
    owner: "",
    contact: "",
    description: "",
    landmarks: [
      "Ateneo de Manila University (ADMU), Miriam College, UP Diliman",
      "LRT-2 Katipunan Station"
    ],
    link: "https://",                         // link to your website or listing post
    photos: [
      "images/listing4/Picture16.jpg", "images/listing4/Picture17.jpg", "images/listing4/Picture18.jpg",
      "images/listing4/Picture19.jpg", "images/listing4/Picture20.jpg"
    ]
  },
  {
    id: 5,                                    // must be a new number for every listing
    name: "Corbell Place / Corbell Flats ",
    location: "San Antonio Village & Bagong Ilog, Pasig City",
    lat: 14.577708032652458, lng: 121.06044360784898,              // right-click the spot on Google Maps and click the coordinates to copy
    price: 5000,                                 // numbers only, no ₱ or commas
    type: "Studio",                        // Apartment | Condo | Studio | House
    occupants: 1,                             // max number of people
    amenities: ["WiFi", "Parking", "Elevator"],            // pick from: WiFi, Parking, Aircon, Pet-friendly, Pool, Furnished, Security, Elevator
    rules: "Stay clean",
    availability: "2026-11-01",               // year-month-day
    owner: "",
    contact: "",
    description: "",
    landmarks: [
      "Rizal Technological University (RTU), University of Asia and the Pacific (UA&P)",
      "Capitol Commons, Megamall"
    ],
    link: "https://",                         // link to your website or listing post
    photos: [
      "images/listing5/Picture21.jpg", "images/listing5/Picture22.jpg", "images/listing5/Picture23.jpg",
      "images/listing5/Picture24.jpg", "images/listing5/Picture25.jpg"
    ]
  },
    {
    id: 6,                                    // must be a new number for every listing
    name: "JDJ Suites / Valenzuela St. Rooms ",
    location: "Rizal Village, Makati / J.P. Rizal St., Mandaluyong",
    lat: 14.570832100208532, lng: 121.02624481524465,              // right-click the spot on Google Maps and click the coordinates to copy
    price: 5500,                                 // numbers only, no ₱ or commas
    type: "Apartment",                        // Apartment | Condo | Studio | House
    occupants: 5,                             // max number of people
    amenities: ["WiFi", "Aircon", "Security"],            // pick from: WiFi, Parking, Aircon, Pet-friendly, Pool, Furnished, Security, Elevator
    rules: "",
    availability: "2026-11-01",               // year-month-day
    owner: "",
    contact: "",
    description: "₱2,300–₱5,500 per month. Air-conditioned and fan room options. Free water and Wi-Fi, smart TV in common areas, 24-hour security.",
    landmarks: [
      "Makati Coliseum, MAPUA Makati, Ateneo Graduate School of Business",
      "Century City Mall"
    ],
    link: "https://",                         // link to your website or listing post
    photos: [
      "images/listing6/Picture26.jpg", "images/listing6/Picture27.jpg", "images/listing6/Picture28.jpg",
      "images/listing4/Picture29.jpg", "images/listing6/Picture30.jpg"
    ]
  },
  
];
