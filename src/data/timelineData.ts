export interface TimelineMilestone {
  year: string;
  title: string;
  siteName: string;
  city: string;
  significance: string;
}

export interface ComparativeElement {
  title: string;
  mughal: string;
  sikh: string;
  colonial: string;
  modern: string;
}

export interface EraTriviaItem {
  id: string;
  category: string;
  title: string;
  fact: string;
  significance: string;
  monumentReference: string;
}

export interface ArchitecturalEraDetail {
  id: string;
  name: string;
  dates: string;
  periodSpan: string;
  color: string;
  accentBg: string;
  borderHighlight: string;
  tagline: string;
  summary: string;
  evolutionaryShift: {
    originAndInfluences: string;
    structuralBreakthrough: string;
    shiftFromPrevious: string;
    legacyLeftToNext: string;
  };
  tectonicElements: {
    arches: { title: string; description: string; signatureForm: string };
    domesAndRoofing: { title: string; description: string; signatureForm: string };
    materialsAndMasonry: { title: string; description: string; signatureForm: string };
    facadesAndOrnament: { title: string; description: string; signatureForm: string };
  };
  civicFunction: string;
  keyCanons: string[];
  milestones: TimelineMilestone[];
  benchmarkSiteId: string;
  photoUrl: string;
  photoAttribution: string;
  trivia: EraTriviaItem[];
}

export const TIMELINE_ERAS: ArchitecturalEraDetail[] = [
  {
    id: "mughal",
    name: "Mughal Empire",
    dates: "c. 1526 – 1857 CE",
    periodSpan: "331 Years of Imperial Grandeur",
    color: "#059669",
    accentBg: "bg-emerald-500/10",
    borderHighlight: "border-emerald-500",
    tagline: "Imperial Symmetry, Double Domes & Monumental Stonecraft",
    summary:
      "The zenith of Islamic monumental architecture in South Asia. Emerging under Babur and reaching tectonic perfection under Shah Jahan and Aurangzeb, Mughal architecture synthesized Persian Timurid geometry with indigenous subcontinental stonemasonry.",
    evolutionaryShift: {
      originAndInfluences:
        "Synthesized Persian Safavid/Timurid axial design, geometric symmetry, and charbagh (four-quadrant) garden plans with local red sandstone craft from the Salt Range and Rajasthan.",
      structuralBreakthrough:
        "Engineering of elevated bulbous marble double-domes—allowing monumental exterior height and skyline presence while maintaining intimate, acoustically balanced interior prayer halls.",
      shiftFromPrevious:
        "Transitioned away from the heavy, fortress-like, low-domed Delhi Sultanate and Lodhi tombs toward towering, light-filled, richly decorated axial complexes with expansive courtyards.",
      legacyLeftToNext:
        "Provided the foundational vocabulary of arches, chattris, decorative niches, and domes that both the Sikh Empire and later British colonial architects would reappropriate."
    },
    tectonicElements: {
      arches: {
        title: "Multi-Cusped Foliated Arches & Peshtaqs",
        description: "Expansive multi-foil cusped arches framed by towering central peshtaq gateways adorned with geometric framing bands.",
        signatureForm: "9-to-11 cusped arches with recessed iwans"
      },
      domesAndRoofing: {
        title: "High-Drum Bulbous Double Domes",
        description: "Constricted neck bulbous domes clad in Makrana white marble, crowned with inverted lotus finials and brass spires.",
        signatureForm: "Hemispherical bulbous profile on octagonal base"
      },
      materialsAndMasonry: {
        title: "Red Sandstone, White Marble & Kashi Tiles",
        description: "Polished red sandstone facing, pure white marble cladding, kankar lime plaster, and vibrant glazed ceramic tile mosaics (Kashi-kari).",
        signatureForm: "Sandstone ashlar masonry with white marble inlay"
      },
      facadesAndOrnament: {
        title: "Pietra Dura & Floral Arabesques",
        description: "Intricate parchin kari semi-precious stone inlay, Quranic thuluth calligraphy, carved marble jaali screens, and stalactite muqarnas squinches.",
        signatureForm: "Strict bilateral symmetry & floral micro-carvings"
      }
    },
    civicFunction: "Imperial dynastic mosques, royal defensive palatial fortresses, mausoleums, and royal pleasure gardens.",
    keyCanons: [
      "Rigid Bilateral Axial Symmetry",
      "Bulbous Double Domes on Elevated Drums",
      "Pietra Dura Inlay & Kashi Ceramic Tilework",
      "Charbagh Quadripartite Water Gardens",
      "Corner Minarets with Domed Chattris"
    ],
    milestones: [
      {
        year: "1566 CE",
        title: "Fort Expansion",
        siteName: "Lahore Fort (Akbar's Gateways)",
        city: "Lahore",
        significance: "Akbar replaces mud fort with red burnt-brick ramparts."
      },
      {
        year: "1634 CE",
        title: "Kashi Tile Masterpiece",
        siteName: "Wazir Khan Mosque",
        city: "Walled City, Lahore",
        significance: "Peak of Persian-influenced glazed polychrome tile mosaics."
      },
      {
        year: "1673 CE",
        title: "World's Largest Courtyard",
        siteName: "Badshahi Mosque",
        city: "Lahore",
        significance: "Aurangzeb's monumental red sandstone congregational mosque."
      }
    ],
    benchmarkSiteId: "badshahi-mosque",
    photoUrl: "/monuments/mughal_badshahi.jpg",
    photoAttribution: "Badshahi Mosque, Lahore (1673 CE) • Muhammad Bilal / Wikimedia Commons (CC BY-SA 3.0)",
    trivia: [
      {
        id: "mughal-whispering-vault",
        category: "Acoustic Engineering",
        title: "The Subterranean Acoustic Whispering Vault",
        monumentReference: "Badshahi Mosque & Lahore Fort Shish Mahal",
        fact: "The curved masonry squinches and vaulted pendentives inside the prayer bays of Badshahi Mosque were mathematically calibrated so a soft whisper uttered into one corner niche travels along the vaulted ceiling ribbing and emerges crystal-clear at the opposite diagonal pier over 50 meters away.",
        significance: "This allowed court guards and senior imams to relay subtle liturgical cues and security warnings across crowded imperial congregations without raising their voices."
      },
      {
        id: "mughal-double-dome-trick",
        category: "Optical Illusion & Climate Control",
        title: "The Double-Dome Thermal & Skyline Trick",
        monumentReference: "Badshahi Mosque & Jahangir's Mausoleum",
        fact: "Badshahi Mosque's exterior white marble domes swell dramatically to dominate the Lahore skyline, but entering the prayer hall reveals a ceiling tens of feet lower. A hollow double-dome structure creates a dead air cavity of several meters between the interior and exterior shells.",
        significance: "Mughal engineers achieved two breakthroughs: monumental exterior skyline majesty without creating an intimidating, cold interior cavern, while the sealed air pocket acts as natural thermal insulation against Punjab's 48°C summer heat."
      },
      {
        id: "mughal-kashi-tile-glaze",
        category: "Material Science",
        title: "Indestructible Kashi-Kari Glass Tile Glaze",
        monumentReference: "Wazir Khan Mosque & Lahore Fort Picture Wall",
        fact: "The glowing cobalt blue, yellow, and turquoise tiles of Wazir Khan Mosque have remained vibrant for almost 400 years without fading under intense monsoon rains and scorching sun. Mughal tile-masters (kashigars) fused crushed quartz stone with plant ash and cobalt ore imported from Badakhshan, vitrifying the glaze at over 900°C.",
        significance: "Unlike modern enamel paints, this vitrified glass layer is chemically impervious to ultraviolet solar degradation and subsurface salt efflorescence."
      },
      {
        id: "mughal-seismic-minarets",
        category: "Structural Breakthrough",
        title: "Hydraulic Floating Wells Beneath 54-Meter Minarets",
        monumentReference: "Badshahi Mosque Corner Minarets",
        fact: "The four colossal 54-meter octagonal corner minarets of Badshahi Mosque sit on deep underground hydraulic 'floating wells'. Master mason Nawab Fidai Khan Koka excavated down to the Ravi River water table and sank timber rafts pinned into stone-filled cylindrical masonry caissons.",
        significance: "During earthquakes, these subterranean wells act as hydraulic friction dampeners, dissipating lateral vibrations through ground friction rather than shearing the stone towers."
      },
      {
        id: "mughal-picture-wall-exception",
        category: "Secret Craft & Imperial Law",
        title: "The Royal Aniconism Exemption of the Picture Wall",
        monumentReference: "Lahore Fort (Pictured Wall of Jahangir & Shah Jahan)",
        fact: "Stretching nearly 450 meters, Lahore Fort's Picture Wall features over 1,000 individual glazed tile panels portraying living figures—dancing fairies, caparisoned war elephants, galloping horses, and royal polo matches. It is the only surviving palace facade in the Mughal world with extensive figural imagery.",
        significance: "Because the palace exterior was sovereign imperial space rather than a consecrated mosque, emperors Jahangir and Shah Jahan relaxed orthodox aniconism to dazzle approaching diplomatic envoys."
      }
    ]
  },
  {
    id: "sikh",
    name: "Sikh Empire",
    dates: "c. 1799 – 1849 CE",
    periodSpan: "50 Years of Regional Sovereignty",
    color: "#eab308",
    accentBg: "bg-yellow-500/10",
    borderHighlight: "border-yellow-500",
    tagline: "Ribbed Lotus Cupolas, Gilded Sheeting & Havelis",
    summary:
      "A dynamic regional synthesis forged under Maharaja Ranjit Singh across the Punjab plains. Blended existing Mughal imperial forms with intimate Punjabi vernacular haveli craft, narrative fresco painting, and sacred gurdwara architecture.",
    evolutionaryShift: {
      originAndInfluences:
        "Grew directly from the fertile architectural soil of Lahore and Punjab, assimilating Mughal masonry while integrating Rajput curved roofs, Kashmiri timber carving, and Sikh spiritual identity.",
      structuralBreakthrough:
        "Development of the ribbed, fluted lotus-bud dome with an inverted kalasa vase finial, accompanied by cantilevered multi-story timber jharokhas with pierced wooden screens.",
      shiftFromPrevious:
        "Humanized the scale of architecture: moved away from vast imperial military bastions toward sacred communal gurdwaras with open four-sided entrances (signifying welcome to all castes) and vertical residential havelis.",
      legacyLeftToNext:
        "The distinctive multi-tier chattris, decorative brackets, and ornamental jharokhas were subsequently studied and adopted by British Indo-Saracenic architects like Bhai Ram Singh."
    },
    tectonicElements: {
      arches: {
        title: "Multi-Foil Cusped & Ogee Arches with Wooden Trim",
        description: "Gentle multi-cusped and ogee arches frequently supported by slender paired columns and carved timber lintels.",
        signatureForm: "Nine-cusped arches framed by floral architraves"
      },
      domesAndRoofing: {
        title: "Fluted Lotus-Bud Domes & Curved Bangla Eaves",
        description: "Distinctive segmented or fluted bulbous cupolas, ribbed like lotus petals, complemented by Bengali-style curved bangla eaves (chhajjas).",
        signatureForm: "Ribbed melon/lotus cupola with gilt copper sheathing"
      },
      materialsAndMasonry: {
        title: "Nanakshahi Bricks, Gold Leaf & Carved Deodar",
        description: "Small kiln-fired Nanakshahi bricks bonded in lime surkhi, gilded copper plates, carved deodar wood ceilings, and reflective glass shisha-gari.",
        signatureForm: "Slender Nanakshahi brickwork with stucco veneer"
      },
      facadesAndOrnament: {
        title: "Naqqashi Frescoes & Pierced Jaali Jharokhas",
        description: "Intricate tempera frescoes depicting flora, birds, and Sikh historical figures, with elaborately carved cantilevered timber balconies.",
        signatureForm: "Projecting timber jharokhas with jaali latticework"
      }
    },
    civicFunction: "Sacred gurdwaras, samadhis (memorial shrines), civic town havelis, and garden baradaris.",
    keyCanons: [
      "Fluted Ribbed Lotus Cupolas",
      "Gilded Brass Plates & Gold Leaf Sheeting",
      "Projecting Wooden Jharokha Balconies",
      "Curved Bangla (Bengali) Chhajja Roofs",
      "Vibrant Naqqashi Frescoes & Shisha-Gari Mirrorwork"
    ],
    milestones: [
      {
        year: "1818 CE",
        title: "Royal Pleasure Pavilion",
        siteName: "Hazuri Bagh Baradari",
        city: "Lahore",
        significance: "White marble pavilion built by Ranjit Singh between Fort and Mosque."
      },
      {
        year: "1839 CE",
        title: "Imperial Samadhi",
        siteName: "Samadhi of Maharaja Ranjit Singh",
        city: "Lahore",
        significance: "Culmination of Sikh memorial architecture with gilded cupola."
      },
      {
        year: "1840 CE",
        title: "Aristocratic Haveli",
        siteName: "Haveli of Nau Nihal Singh",
        city: "Lahore",
        significance: "Finest preserved multi-story Sikh haveli with carved wood jharokhas."
      }
    ],
    benchmarkSiteId: "samadhi-ranjit-singh",
    photoUrl: "/monuments/sikh_samadhi.jpg",
    photoAttribution: "Samadhi of Maharaja Ranjit Singh, Lahore (1839 CE) • Guilhem Vellut / Wikimedia Commons (CC BY-SA 2.0)",
    trivia: [
      {
        id: "sikh-bangaldar-curve",
        category: "Vernacular Genius",
        title: "The Bangaldar Curved Cornice Adaptation",
        monumentReference: "Samadhi of Ranjit Singh & Gurdwara Dera Sahib",
        fact: "Sikh architects popularized the dramatic 'Bangaldar' curved eaves on rooftop pavilions and chattris—a roofline curve originally developed for rural Bengali bamboo thatch huts to shed heavy monsoon downpours.",
        significance: "By sheathing this organic Bengali curve in beaten copper and brass leaf, Punjabi Sikh builders created a dynamic, wave-like skyline contour that broke away from rigid Persian rectilinear parapets."
      },
      {
        id: "sikh-spolia-reclamation",
        category: "Political Symbolism",
        title: "Spolia Palimpsest: Reclaiming Imperial Marble",
        monumentReference: "Hazuri Bagh Baradari & Gurdwara Janam Asthan",
        fact: "The Hazuri Bagh Baradari in Lahore was built by Maharaja Ranjit Singh using carved white marble pillars, cusped arches, and balustrades reclaimed from Mughal pavilions across Shahdara and Jahangir's tomb.",
        significance: "This was an intentional architectural statement known as spolia. Repurposing Mughal imperial stonework into Sikh royal pavilions visually proclaimed to citizens that sovereignty over Punjab had decisively changed hands."
      },
      {
        id: "sikh-shisha-gari-mirrors",
        category: "Secret Craft & Optics",
        title: "Gach-Gilmkar & The Shimmering Tukri Mirrors",
        monumentReference: "Haveli of Nau Nihal Singh & Ranjit Singh Samadhi",
        fact: "Interiors were lined with Tukri work (convex micro-mirrors) set into quicklime gach plaster at precise 15-degree angles. When a single brass oil lamp or candle was lit in the center of the dark chamber, the faceted mirrors cast thousands of moving reflections across the walls, resembling a star-studded midnight galaxy.",
        significance: "This optical craft maximized illumination in dense pre-electric urban mansions while keeping interior rooms insulated against winter drafts."
      },
      {
        id: "sikh-pinjra-kari-aerodynamics",
        category: "Thermal Physics & Privacy",
        title: "Pinjra-Kari Woodwork & Aerodynamic Jharokhas",
        monumentReference: "Walled City of Lahore Havelis (Bhati & Kashmiri Gates)",
        fact: "The elaborate projecting wooden balconies (jharokhas) on Sikh-period havelis were crafted from Himalayan deodar cedar using pinjra-kari—interlocking wooden micro-lattices joined entirely without iron nails or glue.",
        significance: "The tiny pinhole apertures accelerated incoming breezes via the Venturi effect for natural cooling, while allowing women to observe public street life and bustling bazaars below in total privacy (purdah)."
      },
      {
        id: "sikh-fortress-sanctuaries",
        category: "Defensive Engineering",
        title: "Self-Sustaining Fortress-Gurdwaras",
        monumentReference: "Gurdwara Rori Sahib & Rural Punjab Gurdwaras",
        fact: "Due to relentless frontier raids and regional conflicts, Sikh Gurdwaras in 19th-century Punjab were designed with fortified perimeter ramparts, blind defensive ground floors, internal freshwater stepwells (baolis), and massive grain storage silos beneath prayer halls.",
        significance: "A religious sanctuary could immediately convert into a community fortress capable of withstanding a multi-week siege while nourishing hundreds of refugees."
      }
    ]
  },
  {
    id: "colonial",
    name: "British Colonial",
    dates: "c. 1858 – 1947 CE",
    periodSpan: "89 Years of Raj Institutions",
    color: "#ef4444",
    accentBg: "bg-red-500/10",
    borderHighlight: "border-red-500",
    tagline: "Indo-Saracenic Synthesis, Red Facing Brick & Clocktowers",
    summary:
      "Following the 1857 war, the British Raj erected vast administrative, educational, and transport infrastructures. Architects synthesized Victorian Gothic, Edwardian Baroque, and industrial steel trusses with Mughal and Rajasthani ornamentation to create the 'Indo-Saracenic' style.",
    evolutionaryShift: {
      originAndInfluences:
        "Imported European civic planning, British administrative needs, and industrial materials (rolled iron, plate glass, clock mechanisms) married to indigenous Islamic decorative canons.",
      structuralBreakthrough:
        "Integration of industrial structural steel trusses, load-bearing red-brick masonry, and deep shaded verandahs engineered to withstand subcontinental monsoon and heat.",
      shiftFromPrevious:
        "Shifted emphasis from private royal courtyards and shrines to monumental public civic utilities: post offices, railway terminals, museums, high courts, and colonial colleges.",
      legacyLeftToNext:
        "Established the civic scale, municipal boulevard planning (The Mall, Lahore), and exposed burnt-brick masonry tradition that architects like Nayyar Ali Dada would modernize after 1947."
    },
    tectonicElements: {
      arches: {
        title: "Gothic Lancet & Neo-Saracenic Pointed Arches",
        description: "Pointed Gothic lancet arches, trefoil arches, and heavy segmental brick relieving arches combined with deep shaded arcades.",
        signatureForm: "Lancet arches with carved sandstone keystones"
      },
      domesAndRoofing: {
        title: "Iron-Framed Hybrid Domes & Sloped Pitched Roofs",
        description: "Structural iron/steel-supported central domes, roof parapets with decorative battlements, and terracotta-tiled pitched roofs.",
        signatureForm: "Colonial clocktowers flanked by miniature Mughal chattris"
      },
      materialsAndMasonry: {
        title: "Kiln-Fired Red Facing Brick & Buff Sandstone",
        description: "Uniform machine-pressed red clay bricks with meticulous lime-surkhi tuck-pointing, cast iron railings, and contrasting buff sandstone dressings.",
        signatureForm: "Exposed polychrome red brickwork with stone banding"
      },
      facadesAndOrnament: {
        title: "Civic Clock Towers & Deep Shaded Verandahs",
        description: "Monumental central clocktowers asserting imperial standard time, louvered teak jhilmil shutters, and deep double-height peripheral arcades.",
        signatureForm: "Bymmetrical institutional facade with central clocktower"
      }
    },
    civicFunction: "Imperial railway stations, general post offices, universities, high courts, museums, and municipal halls.",
    keyCanons: [
      "Exposed Finely Pointed Red Brickwork",
      "Monumental Civic Clock Towers",
      "Indo-Saracenic Hybridization (Kipling & Bhai Ram Singh)",
      "Deep Shaded Verandahs & Louvered Jhilmils",
      "Gothic Lancet Fenestration with Islamic Chattris"
    ],
    milestones: [
      {
        year: "1860 CE",
        title: "Fortified Terminal",
        siteName: "Lahore Junction Railway Station",
        city: "Lahore",
        significance: "Pioneering defensible post-1857 railway architecture with crenellations."
      },
      {
        year: "1894 CE",
        title: "Indo-Saracenic Crown",
        siteName: "Lahore Museum",
        city: "The Mall, Lahore",
        significance: "Bhai Ram Singh and Lockwood Kipling's celebrated institutional synthesis."
      },
      {
        year: "1910 CE",
        title: "Edwardian Red Brick",
        siteName: "General Post Office (GPO)",
        city: "The Mall, Lahore",
        significance: "Sir Ganga Ram's masterpiece uniting clocktower and red brick masonry."
      }
    ],
    benchmarkSiteId: "lahore-museum",
    photoUrl: "/monuments/colonial_museum.jpg",
    photoAttribution: "Lahore Museum, The Mall, Lahore (1894 CE) • Moazzam / Wikimedia Commons (CC BY-SA 4.0)",
    trivia: [
      {
        id: "colonial-thermal-mass",
        category: "Thermal Physics & Ventilation",
        title: "The 3-Foot Thermal Mass & Solar Chimneys",
        monumentReference: "Lahore High Court & General Post Office (GPO)",
        fact: "Without electric fans or air conditioning, British engineers built institutional walls with solid burnt-brick masonry up to 36 inches (nearly 1 meter) thick, paired with 18-to-24-foot soaring ceilings.",
        significance: "The massive thermal inertia delayed peak noon heat from reaching interior rooms until nightfall. Operable high-level clerestory louvers acted as natural solar chimneys, constantly sucking cooler air through shaded perimeter verandas."
      },
      {
        id: "colonial-indo-saracenic-politics",
        category: "Political Symbolism",
        title: "The 'Imperial Compromise': Why Indo-Saracenic was Born",
        monumentReference: "Lahore Museum & Aitchison College",
        fact: "Indo-Saracenic architecture was spearheaded after the 1857 war by figures like John Lockwood Kipling (Rudyard Kipling's father) and master Punjabi architect Bhai Ram Singh. It deliberately fused Victorian Gothic brickwork with Mughal cusped arches, chattris, and jaalis.",
        significance: "The British government deliberately commissioned this style to visually portray the British Crown not as foreign conquerors, but as the legitimate, natural successors of the great Mughal emperors."
      },
      {
        id: "colonial-gizri-marine-stone",
        category: "Material Science",
        title: "Gizri Sandstone: Karachi's Self-Hardening Marine Rock",
        monumentReference: "Frere Hall & Empress Market, Karachi",
        fact: "Karachi's grandest colonial landmarks were built from local 'Gizri stone' quarried along the Clifton ridge. When freshly quarried, the golden-buff sandstone was soft enough to be sculpted into delicate Gothic traceries and Venetian arches with hand chisels.",
        significance: "Remarkably, upon long-term exposure to the humid, salt-laden Arabian Sea air, the calcium carbonate within Gizri stone undergoes carbonation and actually hardens over decades, naturally resisting coastal corrosion."
      },
      {
        id: "colonial-clocktower-discipline",
        category: "Civic Social Engineering",
        title: "The Clocktower as a Tool of Imperial Civic Discipline",
        monumentReference: "Faisalabad (Lyallpur) Clock Tower & Sukkur Clock Tower",
        fact: "Before British colonization, life across the Indus basin followed agrarian daylight rhythms and Muslim azan prayer intervals. The British erected monumental clock towers at the center of 8 radiating bazaar streets (like Sir James Lyall's Union Jack city plan for Lyallpur).",
        significance: "Clock towers were not merely ornamental; they were vital instruments of imperial social engineering designed to enforce industrial shift work, railway timetables, and colonial bureaucratic punctuality on urban populations."
      },
      {
        id: "colonial-ganga-ram-mortar",
        category: "Structural Breakthrough",
        title: "Sir Ganga Ram's Rapid Hydraulic Mortar Secret",
        monumentReference: "Lahore Model Town, Aitchison College & Mayo Hospital",
        fact: "Renowned civil engineer Sir Ganga Ram developed a proprietary hydraulic lime mortar formula utilizing surkhi (crushed burnt brick dust) and organic jaggery (raw cane sugar syrup) called gur-chuna.",
        significance: "This organic binder catalyzed crystalline calcium-silicate hydrate bonds that set underwater, allowing massive brick masonry spans to cure with incredible compressive strength in rainy monsoon conditions."
      }
    ]
  },
  {
    id: "modern",
    name: "Modern / Post-1947",
    dates: "1947 – Present",
    periodSpan: "Independence to Contemporary Era",
    color: "#38bdf8",
    accentBg: "bg-sky-500/10",
    borderHighlight: "border-sky-500",
    tagline: "Structural Concrete, Geometric Abstraction & National Identity",
    summary:
      "Following independence in 1947, Pakistani architecture sought a sovereign national identity divorced from colonial imperial motifs. The creation of Islamabad and subsequent decades fostered modernist abstraction, reinforced concrete shells, and regional brutalism.",
    evolutionaryShift: {
      originAndInfluences:
        "Global modernism (Le Corbusier, Doxiadis, Vedat Dalokay) intersecting with Islamic geometric symbolism and regional response to climate.",
      structuralBreakthrough:
        "Reinforced concrete (RCC) folded plates, hyperbolic paraboloids, pre-stressed cantilevers, and curtain wall engineering that abandoned traditional load-bearing brick walls.",
      shiftFromPrevious:
        "Conscious rejection of British imperial historicism. Replaced decorative applique and Victorian clocktowers with minimalist structural purity, monumental geometry, and symbolic national metaphors.",
      legacyLeftToNext:
        "Established contemporary Pakistani architecture—balancing global minimalist steel-and-glass towers with regional contextual brutalism (exemplified by Nayyar Ali Dada's red brick civic spaces)."
    },
    tectonicElements: {
      arches: {
        title: "Abstracted Parabolic & Catena Openings",
        description: "Arches reinterpreted as sculptural parabolic portals, angled reinforced concrete frames, or replaced entirely by horizontal lintel spans.",
        signatureForm: "Sweeping parabolic marble/concrete arches without mouldings"
      },
      domesAndRoofing: {
        title: "Hyperbolic Concrete Shells & Petal Vaults",
        description: "Replacement of masonry hemispherical domes with multi-faceted hyperbolic paraboloid shells (Bedouin tent) or blossoming petal-vault canopies.",
        signatureForm: "Eight-sided triangular concrete tent shell / Petal vaults"
      },
      materialsAndMasonry: {
        title: "Fair-Face Concrete, White Marble & Architectural Steel",
        description: "Exposed shutter-board architectural concrete, pristine indigenous white marble cladding, structural steel frames, and solar tinted glazing.",
        signatureForm: "Monolithic white marble panels and exposed cast concrete"
      },
      facadesAndOrnament: {
        title: "Geometric Purity & Monumental Minimalism",
        description: "Total elimination of surface historicist ornament in favor of volumetric massing, stark shadows, and pure geometric proportions.",
        signatureForm: "Sleek needle minarets, massive folded planes & diagonal buttresses"
      }
    },
    civicFunction: "National assembly halls, sovereign memorials, monumental national mosques, universities, and commercial skyscrapers.",
    keyCanons: [
      "Hyperbolic Concrete Shells & Tensile Forms",
      "Pure Volumetric Geometry (Cubes, Pyramids, Petals)",
      "Minimalist Indigenous White Marble Cladding",
      "Elimination of Historicist Surface Carvings",
      "Regional Modernist Brick Brutalism (Nayyar Ali Dada)"
    ],
    milestones: [
      {
        year: "1960–68 CE",
        title: "Monument to Independence",
        siteName: "Minar-e-Pakistan",
        city: "Iqbal Park, Lahore",
        significance: "Tower combining Mughal base crescents with modern unfolding tower."
      },
      {
        year: "1971 CE",
        title: "Founding Father's Mausoleum",
        siteName: "Mazar-e-Quaid",
        city: "Karachi",
        significance: "Yahya Merchant's pure white marble cube with parabolic arches."
      },
      {
        year: "1986 CE",
        title: "Modernist Islamic Icon",
        siteName: "Faisal Mosque",
        city: "Islamabad",
        significance: "Vedat Dalokay's Bedouin tent concrete shell with four pencil minarets."
      }
    ],
    benchmarkSiteId: "faisal-mosque",
    photoUrl: "/monuments/modern_faisal.jpg",
    photoAttribution: "Faisal Mosque, Islamabad (1986 CE) • Saqib Qayyum / Wikimedia Commons (CC BY-SA 4.0)",
    trivia: [
      {
        id: "modern-faisal-tent",
        category: "Structural Breakthrough",
        title: "Faisal Mosque's Non-Euclidean Concrete Feat",
        monumentReference: "Faisal Mosque, Islamabad",
        fact: "Turkish architect Vedat Dalokay discarded traditional hemispherical domes entirely, modeling Faisal Mosque after an 8-sided nomadic Bedouin desert tent and the cubic Kaaba. Its soaring 40-meter triangular roof was cast as a thin-shell post-tensioned reinforced concrete structure.",
        significance: "By eliminating internal pillars completely, the sanctuary creates an uninterrupted 5,000-square-meter column-free prayer floor—one of the largest single-span structural shells in the world, holding over 10,000 worshippers under one roof."
      },
      {
        id: "modern-minar-stone-strata",
        category: "Political Symbolism",
        title: "The 4-Layer Stone Metaphor of Minar-e-Pakistan",
        monumentReference: "Minar-e-Pakistan, Iqbal Park Lahore",
        fact: "Designed by Russian-born architect Nasreddin Murat-Khan, the plinth of the 70-meter monument rises in four distinct concentric tiers of stone: starting with rough, unhewn stone from Taxila at the base, followed by hammer-dressed stone, chisel-dressed stone, and finishing with flawless polished white marble at the apex.",
        significance: "The four stones literally symbolize the evolution of the Pakistan Movement: from raw, unorganized grassroots struggle at the bottom, through disciplined shaping, to pure sovereign fruition at the top."
      },
      {
        id: "modern-mazar-entasis",
        category: "Optical Illusion",
        title: "Mazar-e-Quaid's Optical Perspective Taper",
        monumentReference: "Mazar-e-Quaid (Jinnah's Mausoleum), Karachi",
        fact: "Architect Yahya Merchant clad Quaid-e-Azam's mausoleum in pure white marble quarried from Swat. To the human eye, the massive 75-foot cube appears perfectly plumb and square from ground level, but the four sheer exterior walls actually taper inward by exactly 2 degrees as they rise.",
        significance: "This subtle optical correction (entasis) prevents the building from appearing top-heavy when viewed from the terraced approach below, imparting an aura of majestic serenity and timeless stillness."
      },
      {
        id: "modern-windcatchers-reimagined",
        category: "Thermal Physics & Regionalism",
        title: "Sindhi Windcatchers Reimagined in Brick",
        monumentReference: "Alhamra Arts Council, Lahore & Sindh Rural Architecture",
        fact: "Aga Khan Award-winning architect Nayyar Ali Dada reimagined Hyderabad's centuries-old traditional Sindhi mangh (rooftop scoops that channel coastal breezes) into Alhamra's polygonal red-brick geometric pavilions.",
        significance: "By utilizing double-skin red brick cavity walls, acoustic baffle ceilings, and angled solar shading louvers, the complex achieves world-class concert hall acoustics and natural cooling with minimal mechanical loads."
      },
      {
        id: "modern-pakistan-monument-satellite",
        category: "Secret Craft & Geometry",
        title: "The Satellite-View Crescent & Petal Geometry",
        monumentReference: "Pakistan Monument, Shakarparian Islamabad",
        fact: "Designed by architect Arif Masood, the monument's four large granite petals symbolize Pakistan's four major cultures, while three smaller petals represent the northern and federated territories. When viewed from above by satellite or aircraft, the petals and central spire form the exact geometry of the national crescent and five-pointed star.",
        significance: "The interior curves of each petal are hand-carved with high-relief stone murals depicting national milestones, turning structural engineering into a permanent historical narrative in granite."
      }
    ]
  }
];

export const COMPARATIVE_TECTONICS: ComparativeElement[] = [
  {
    title: "Arch Form & Profiles",
    mughal: "Multi-cusped foliated arches (9-11 cusps) with deep central peshtaq iwans and stone stalactite squinches.",
    sikh: "Pointed & multi-foil cusped arches framed by carved deodar timber mouldings and paired lotus columns.",
    colonial: "Gothic lancet arches, heavy semicircular Romanesque arches, and deep shaded verandah arcades.",
    modern: "Sculptural parabolic concrete portals, catenary curves, or eliminated in favor of rectilinear post-and-beam."
  },
  {
    title: "Dome & Roof Structure",
    mughal: "Bulbous marble double-domes on elevated octagonal drums with inverted lotus finials.",
    sikh: "Segmented fluted lotus-bud cupolas with gilded copper sheeting and curved Bengali bangla eaves.",
    colonial: "Steel-framed hybrid domes, rooftop battlements, and steep timber/terracotta pitched roofs.",
    modern: "Hyperbolic paraboloid concrete shell (tent vault), blossoming petal vaults, or unadorned concrete hemispheres."
  },
  {
    title: "Primary Construction Materials",
    mughal: "Dressed red sandstone ashlar, Makrana white marble, lime kankar mortar, and glazed polychrome kashi tiles.",
    sikh: "Slim kiln-baked Nanakshahi bricks, lime surkhi, gold-plated brass sheeting, and carved deodar timber.",
    colonial: "Machine-extruded red facing bricks, buff sandstone dressings, rolled industrial iron/steel trusses.",
    modern: "Reinforced cast-in-place concrete (RCC), indigenous white marble cladding, structural glazing, and steel spaceframes."
  },
  {
    title: "Surface Ornamentation",
    mughal: "Pietra dura semi-precious stone inlay (parchin kari), Quranic thuluth calligraphy, and carved jaali lattice screens.",
    sikh: "Narrative naqqashi wall frescoes, intricate wood-carved jharokha screens, and shisha-gari mirrorwork.",
    colonial: "Exposed precision brick bonds, contrasting sandstone keystones, carved heraldic crests, and cast-iron filigree.",
    modern: "Ornament rejected in favor of raw concrete board marks, pure marble planes, and dramatic shadow casts."
  },
  {
    title: "Primary Civic Purpose",
    mughal: "Imperial power projection, congregational Friday mosques, dynastic mausoleums, and imperial pleasure gardens.",
    sikh: "Communal spiritual worship (gurdwaras open on all 4 sides), memorial samadhis, and dense urban residential havelis.",
    colonial: "Imperial civil administration, telegraph & postal services, railway junctions, courts, and universities.",
    modern: "National sovereign identity, democratic institutions, state memorials, cultural centers, and civic infrastructure."
  }
];

export const EVOLUTION_TRANSITIONS = [
  {
    from: "Mughal Empire",
    to: "Sikh Empire",
    years: "c. 1799 CE Transition",
    summary: "Re-interpretation of Imperial Canons into Sacred & Vernacular Punjabi Architecture",
    description:
      "When Maharaja Ranjit Singh consolidated the Punjab, Sikh builders inherited Mughal stonemasonry skills but transformed the imperial scale. Colossal congregational courtyards gave way to intimate, jewel-like gurdwaras designed for egalitarian communal gathering (with 4 open gates). Domes evolved from pure hemispherical bulbs into fluted, ribbed lotus buds topped with gilded metalwork.",
    visualDifference: "Shift from red sandstone imperial monuments to gilded Nanakshahi brickwork, wooden jharokhas, and narrative wall frescoes."
  },
  {
    from: "Sikh Empire",
    to: "British Colonial",
    years: "c. 1858 CE Transition",
    summary: "The Indo-Saracenic Synthesis: Imperial Administration meets Subcontinental Motifs",
    description:
      "Following British annexation, military and civil engineers initially erected stark utilitarian barracks. By the late 19th century, figures like John Lockwood Kipling and master architect Bhai Ram Singh championed Indo-Saracenic architecture. They combined British industrial steel, Victorian floorplans, and municipal clocktowers with Mughal chattris, cusped arches, and exquisite exposed red-brick masonry.",
    visualDifference: "Shift from intimate haveli craft to monumental red-brick public institutions, civic clocktowers, and iron railway structures."
  },
  {
    from: "British Colonial",
    to: "Modern / Post-1947",
    years: "1947 CE Transition",
    summary: "Sovereign Emancipation: Structural Modernism, Concrete Shells & Symbolic Abstraction",
    description:
      "Independence in 1947 triggered an urgent quest for an authentic national architecture devoid of British colonial imperial reminders. Rather than copying traditional arches, modern architects embraced reinforced concrete to craft abstract structural forms: Vedat Dalokay shaped the Faisal Mosque into an 8-sided Bedouin tent without a traditional dome, while Yahya Merchant crafted Mazar-e-Quaid as a monumental pure marble cube.",
    visualDifference: "Shift from Victorian red brick and clocktowers to fair-face concrete, soaring needle minarets, and pure geometric sculpture."
  }
];
