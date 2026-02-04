export const DESTINATIONS = [
    // --- COUNTRIES ---
    {
        id: 'india',
        name: 'India',
        type: 'country',
        description: 'High preparation, administrative friction, and regional variance.',
        intelligence: {
            hurricaneWarning: 'Cyclone Season: April-June & Oct-Dec (Bay of Bengal).',
            culturalWarning: 'High Context: "Yes" often means "I hear you," not agreement. Remove shoes before entering homes/temples. Right hand for eating.'
        }
    },
    {
        id: 'japan',
        name: 'Japan',
        type: 'country',
        description: 'Structure-heavy systems, expectation alignment, and precision planning.',
        intelligence: {
            hurricaneWarning: 'Typhoon Season: June-October. Peak in August/September.',
            culturalWarning: 'Silence is communication. Do not tip. Queue discipline is absolute. Avoid walking while eating. Business cards are exchanged with two hands.'
        }
    },
    {
        id: 'usa',
        name: 'United States',
        type: 'country',
        description: 'Macro layer for city-level planning across a large, decentralized country.',
        intelligence: {
            hurricaneWarning: 'Atlantic Hurricane Season: June 1 - Nov 30. Gulf Coast/East Coast vulnerable.',
            culturalWarning: 'Tipping is mandatory (20%+). Personal space bubble is large. Direct eye contact is expected. Small talk is common.'
        }
    },
    {
        id: 'brazil',
        name: 'Brazil',
        type: 'country',
        description: 'Regional variance, entry considerations, and preparation depth.',
        intelligence: {
            hurricaneWarning: 'South Atlantic Tropical Cyclones are rare but possible (Nov-March).',
            culturalWarning: 'Physical touch is common during conversation. "OK" hand sign is offensive. Punctuality is flexible for social events.'
        }
    },
    {
        id: 'portugal',
        name: 'Portugal',
        type: 'country',
        description: 'Atlantic access, regional variance, and expectation alignment.',
        intelligence: {
            hurricaneWarning: 'Post-tropical storms occasional in late autumn (Oct-Nov).',
            culturalWarning: 'Dinner is late (8-9 PM). Titles matter (Sr./Dra.). "Sim" (yes) is direct. Do not compare to Spain.'
        }
    },
    {
        id: 'colombia',
        name: 'Colombia',
        type: 'country',
        description: 'High-contrast regions, altitude and infrastructure variance.',
        intelligence: {
            hurricaneWarning: 'San Andrés/Providencia: Hurricane belt (June-Nov). Mainland mostly immune.',
            culturalWarning: 'Indirect communication is preferred to avoid conflict. "No dar papaya" (don\'t make yourself a target). Formal greetings are valued.'
        }
    },
    // --- CITIES ---
    {
        id: 'nyc',
        name: 'New York City',
        type: 'city',
        description: 'High-density urban compression and pacing realism.',
        intelligence: {
            hurricaneWarning: 'Remnant storms/Nor\'easters (Aug-Oct). Subway flooding risk.',
            culturalWarning: 'Fast pace: Do not block sidewalks. Time is currency. Directness is not rudeness. Tipping 20-25% standard.'
        }
    },
    {
        id: 'tampa-bay',
        name: 'Tampa Bay',
        type: 'city',
        description: 'Spread-out metro, car dependence, and climate-driven pacing.',
        intelligence: {
            hurricaneWarning: 'High Risk: Direct hits possible (June-Nov). Storm surge vulnerability.',
            culturalWarning: 'Casual dress code everywhere. Car-centric culture. "Snowbirds" impact traffic in winter.'
        }
    },
    {
        id: 'las-vegas',
        name: 'Las Vegas',
        type: 'city',
        description: 'High-compression environment with time and cost distortion.',
        intelligence: {
            hurricaneWarning: 'No direct risk. Flash flooding possible during Monsoon (July-Sept).',
            culturalWarning: 'Tipping culture is aggressive (valet, dealers, maids). Smoking allowed in casinos. 24/7 economy.'
        }
    },
    {
        id: 'bogota',
        name: 'Bogotá',
        type: 'city',
        description: 'Altitude, neighborhood friction, and high-context decision planning.',
        intelligence: {
            hurricaneWarning: 'None. Altitude (2640m) is the primary weather factor.',
            culturalWarning: 'Formal dress ("Rolo" culture). Weather is "eternal autumn." Political discussions can be sensitive.'
        }
    },
    {
        id: 'villamaria-caldas',
        name: 'Villamaría, Caldas',
        type: 'city',
        description: 'Coffee Region mobility, terrain realism, and expectation alignment.',
        intelligence: {
            hurricaneWarning: 'None. Volcanic activity nearby (Nevado del Ruiz).',
            culturalWarning: 'Paisas are highly hospitable. Coffee culture is central. steep terrain requires fitness.'
        }
    },
    {
        id: 'lisbon',
        name: 'Lisbon',
        type: 'city',
        description: 'Walkable density, hills, seasonality, and district-based planning.',
        intelligence: {
            hurricaneWarning: 'Atlantic storms can bring heavy rain/wind (Oct-March).',
            culturalWarning: 'Fado music demands silence. Cobblestones are slippery. Lunch is long (1-3 PM).'
        }
    },
    {
        id: 'algarve',
        name: 'Algarve',
        type: 'city',
        description: 'Seasonal crowd dynamics, mobility planning, and coastal logistics.',
        intelligence: {
            hurricaneWarning: 'Rare tropical remnants. Winter storms (Dec-Feb).',
            culturalWarning: 'Resort culture vs local culture divide. Siesta applies in smaller towns. Topless sunbathing is common on beaches.'
        }
    },
    {
        id: 'rome',
        name: 'Rome',
        type: 'city',
        description: 'Mid-friction historical density and seasonal crowd pressure.',
        intelligence: {
            hurricaneWarning: 'None. "Medicane" (Mediterranean Hurricane) possible but rare (Sept-Jan).',
            culturalWarning: 'Cover shoulders in churches. Espresso is drunk standing at the bar. Dinner is late (8:30 PM+).'
        }
    },
    {
        id: 'rio',
        name: 'Rio de Janeiro',
        type: 'city',
        description: 'Situational awareness city with neighborhood-driven outcomes.',
        intelligence: {
            hurricaneWarning: 'Rare. Heavy summer rains (Jan-Mar) cause landslides.',
            culturalWarning: 'Body positivity is high. Beach culture is social life. "Cariocas" are informal. Safety awareness is crucial in all zones.'
        }
    },
    {
        id: 'caracas',
        name: 'Caracas',
        type: 'city',
        description: 'High-variance environment requiring local context and preparation.',
        intelligence: {
            hurricaneWarning: 'Caribbean hurricanes pass north; tail effects possible.',
            culturalWarning: 'Hyper-inflation awareness. Safety is paramount; do not display wealth. Local contacts are essential for logistics.'
        }
    },
    {
        id: 'dubai',
        name: 'Dubai',
        type: 'city',
        description: 'Heat management, transit access, and high-contrast comfort planning.',
        intelligence: {
            hurricaneWarning: 'Cyclones in Arabian Sea rare but can impact (May-June/Oct-Nov).',
            culturalWarning: 'PDA is illegal. Dress modestly in malls/public. Friday is the holy day. Alcohol only in licensed hotels.'
        }
    },
    {
        id: 'toronto',
        name: 'Toronto',
        type: 'city',
        description: 'Weather-driven planning, neighborhood scale, and transit-versus-car tradeoffs.',
        intelligence: {
            hurricaneWarning: 'Post-tropical storm remnants (Hurricane Hazel legacy).',
            culturalWarning: 'Multicultural mosaic. "Sorry" is used for everything. Lineups are orderly. Tipping 18-20%.'
        }
    },
];
