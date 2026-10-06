export interface BenchmarkSite {
  id: string;
  name: string;
  era: "Mughal" | "Sikh" | "British Colonial" | "Modern / Post-1947" | "Out of Distribution";
  city: string;
  yearBuilt: string;
  imageUrl: string;
  creator: string;
  license: string;
  sourceUrl: string;
  description: string;
  probabilities: {
    Mughal: number;
    Sikh: number;
    "British Colonial": number;
    "Modern / Post-1947": number;
  };
  calibratedConfidence: number;
  entropy: number;
  isOod: boolean;
  oodReason?: string;
  diagnosticFeatures: {
    feature: string;
    detail: string;
    saliencyLevel: "High" | "Medium" | "Low";
  }[];
  gradCamFocus: {
    centerX: number; // percentage
    centerY: number;
    radiusX: number;
    radiusY: number;
  };
}

export const BENCHMARK_SITES: BenchmarkSite[] = [
  {
    id: "badshahi-mosque",
    name: "Badshahi Mosque, Lahore",
    era: "Mughal",
    city: "Lahore, Punjab",
    yearBuilt: "1673 CE (Emperor Aurangzeb)",
    imageUrl: "/monuments/mughal_badshahi.jpg",
    creator: "Muhammad Bilal / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Badshahi_Mosque_Lahore_Front_View.jpg",
    description: "Commissioned by Mughal Emperor Aurangzeb in 1671, the Badshahi Mosque exemplifies late imperial Mughal monumentalism with its red sandstone exterior, white marble bulbous double-domes, and immense quadripartite courtyard.",
    probabilities: {
      Mughal: 0.88,
      Sikh: 0.05,
      "British Colonial": 0.05,
      "Modern / Post-1947": 0.02
    },
    calibratedConfidence: 0.88,
    entropy: 0.48,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Bulbous White Marble Domes", detail: "Tri-domed central sanctuary crowned by double-curved bulbous marble cupolas on high drums.", saliencyLevel: "High" },
      { feature: "Carved Red Sandstone & Marble Inlay", detail: "Chiseled red sandstone revetment adorned with subtle marble floral arabesques and banding.", saliencyLevel: "High" },
      { feature: "Monumental Peshtaq Arch", detail: "Vaulted central portal framed by multi-cusped arches and flanked by octagonal corner minarets.", saliencyLevel: "Medium" },
      { feature: "Strict Façade Symmetry", detail: "Rigorous axial balance reflecting traditional Persianate charbagh proportional canons.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 50, centerY: 45, radiusX: 38, radiusY: 32 }
  },
  {
    id: "wazir-khan",
    name: "Wazir Khan Mosque, Lahore",
    era: "Mughal",
    city: "Lahore Walled City, Punjab",
    yearBuilt: "1634–1641 CE (Emperor Shah Jahan)",
    imageUrl: "/monuments/mughal_wazir_khan.jpg",
    creator: "Guilhem Vellut / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Wazir_Khan_Mosque_Minarets_and_Courtyard.jpg",
    description: "Built during the reign of Shah Jahan by court physician Ilam-ud-Din Ansari (Wazir Khan), famous for its vibrant kashi-kari Persian glazed tile mosaics and elaborate frescoed prayer chambers.",
    probabilities: {
      Mughal: 0.84,
      Sikh: 0.07,
      "British Colonial": 0.06,
      "Modern / Post-1947": 0.03
    },
    calibratedConfidence: 0.84,
    entropy: 0.58,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Polychrome Kashi-Kari Tilework", detail: "Intricate glazed tile mosaics in cobalt blue, turquoise, yellow, and green floral arabesques.", saliencyLevel: "High" },
      { feature: "Four Octagonal Minarets", detail: "Towering minarets with cantilevered balconies marking the four corners of the central courtyard.", saliencyLevel: "High" },
      { feature: "Persian Calligraphic Bands", detail: "Quranic inscriptions and Nastaliq poetry woven into architectural lintels and friezes.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 48, centerY: 50, radiusX: 42, radiusY: 36 }
  },
  {
    id: "samadhi-ranjit-singh",
    name: "Samadhi of Maharaja Ranjit Singh, Lahore",
    era: "Sikh",
    city: "Lahore, Punjab (Near Lahore Fort)",
    yearBuilt: "1839–1848 CE (Sikh Empire)",
    imageUrl: "/monuments/sikh_samadhi.jpg",
    creator: "Guilhem Vellut / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Samadhi_of_Ranjit_Singh_Lahore.jpg",
    description: "Mausoleum of Maharaja Ranjit Singh blending Sikh religious architecture with regional Punjabi elements, featuring fluted gilded domes, decorative wooden jharokhas, and intricate gach stucco work.",
    probabilities: {
      Mughal: 0.18,
      Sikh: 0.72,
      "British Colonial": 0.06,
      "Modern / Post-1947": 0.04
    },
    calibratedConfidence: 0.72,
    entropy: 0.82,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Fluted Ribbed Central Cupola", detail: "Lotus-bud ribbed gilded dome adorned with ornamental inverted flower petals and brass kalasa finial.", saliencyLevel: "High" },
      { feature: "Ornate Jharokhas & Balconies", detail: "Cantilevered wooden bay windows supported by intricately carved animal-head and floral brackets.", saliencyLevel: "High" },
      { feature: "Bangla Curved Eaves", detail: "Curved eaves derived from regional Bengali-Punjabi temple and pavilion vernaculars.", saliencyLevel: "Medium" },
      { feature: "Mughal-Sikh Hybrid Masonry", detail: "Integration of brick masonry with marble pavilions, reflecting 19th-century regional synthesis.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 52, centerY: 40, radiusX: 35, radiusY: 30 }
  },
  {
    id: "haveli-nau-nihal",
    name: "Haveli of Nau Nihal Singh, Lahore",
    era: "Sikh",
    city: "Bhati Gate, Walled City Lahore",
    yearBuilt: "c. 1835–1840 CE",
    imageUrl: "/monuments/sikh_haveli.jpg",
    creator: "Kamran Sheikh / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Haveli_Nau_Nihal_Singh_Jharokhas.jpg",
    description: "Grand residential palace of the grandson of Maharaja Ranjit Singh, exemplifying Sikh domestic haveli architecture with carved wood facades, cut-brick ornament, and glass shish-mahal roof chambers.",
    probabilities: {
      Mughal: 0.14,
      Sikh: 0.76,
      "British Colonial": 0.07,
      "Modern / Post-1947": 0.03
    },
    calibratedConfidence: 0.76,
    entropy: 0.74,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Multi-Tiered Wooden Jharokha Facade", detail: "Cascading carved cedarwood bay balconies with lattice screens (pinjra jaali).", saliencyLevel: "High" },
      { feature: "Cut-Brick Floral Reliefs", detail: "Intricate ornamental brick carvings depicting mythological scenes, birds, and floral vines.", saliencyLevel: "High" },
      { feature: "Rang Mahal Shisha Work", detail: "Upper pavilion adorned with mirrored glass and vibrant Kangra-style miniature fresco motifs.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 50, centerY: 55, radiusX: 40, radiusY: 38 }
  },
  {
    id: "lahore-museum",
    name: "Lahore Museum (Indo-Saracenic)",
    era: "British Colonial",
    city: "The Mall, Lahore",
    yearBuilt: "1894 CE (Bhai Ram Singh & Lockwood Kipling)",
    imageUrl: "/monuments/colonial_museum.jpg",
    creator: "Moazzam / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lahore_Museum_Front_View.jpg",
    description: "Designed by Bhai Ram Singh in collaboration with John Lockwood Kipling, this crown jewel of Indo-Saracenic architecture marries Victorian institutional planning with Mughal and Rajasthani brickwork, domes, and chattris.",
    probabilities: {
      Mughal: 0.22,
      Sikh: 0.06,
      "British Colonial": 0.68,
      "Modern / Post-1947": 0.04
    },
    calibratedConfidence: 0.68,
    entropy: 0.89,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Indo-Saracenic Red Brick Masonry", detail: "Fine pointed red brickwork combined with contrasting buff sandstone cornices and friezes.", saliencyLevel: "High" },
      { feature: "Mughal-Inspired Octagonal Chattris", detail: "Pillared domed kiosks mounted on the roof parapets evoking Fatehpur Sikri and Lahore Fort.", saliencyLevel: "High" },
      { feature: "Victorian Institutional Symmetry", detail: "Classical European civic axial plan adapted with deep shaded arcades and multi-foil arches.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 50, centerY: 46, radiusX: 45, radiusY: 34 }
  },
  {
    id: "gpo-lahore",
    name: "General Post Office (GPO), Lahore",
    era: "British Colonial",
    city: "The Mall, Lahore",
    yearBuilt: "1910 CE (Sir Ganga Ram)",
    imageUrl: "/monuments/colonial_gpo.jpg",
    creator: "Sir Ganga Ram Memorial Archive / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:GPO_Lahore_Clocktower_and_Brickwork.jpg",
    description: "Masterwork designed by eminent civil engineer Sir Ganga Ram, combining Victorian Edwardian Baroque with Mughal elements, marked by its central clock tower and polished red brick facade.",
    probabilities: {
      Mughal: 0.16,
      Sikh: 0.04,
      "British Colonial": 0.76,
      "Modern / Post-1947": 0.04
    },
    calibratedConfidence: 0.76,
    entropy: 0.75,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Civic Clock Tower Landmark", detail: "Monumental central clocktower signaling colonial municipal time and imperial communications.", saliencyLevel: "High" },
      { feature: "Exposed Burnt-Brick Courtyard", detail: "Pristine red brick masonry with white stone keystones and dentil moldings.", saliencyLevel: "High" },
      { feature: "Neo-Gothic Lancet Arches", detail: "Pointed arch fenestration adapted for South Asian heat via recessed deep verandahs.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 50, centerY: 38, radiusX: 30, radiusY: 35 }
  },
  {
    id: "faisal-mosque",
    name: "Faisal Mosque, Islamabad",
    era: "Modern / Post-1947",
    city: "Islamabad, Capital Territory",
    yearBuilt: "1976–1986 CE (Vedat Dalokay)",
    imageUrl: "/monuments/modern_faisal.jpg",
    creator: "Saqib Qayyum / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Faisal_Mosque_Islamabad_Evening.jpg",
    description: "Designed by Turkish architect Vedat Dalokay, the Faisal Mosque rejects traditional domes in favor of an eight-sided concrete Bedouin tent structure flanked by four 88-meter Turkish-style minarets.",
    probabilities: {
      Mughal: 0.03,
      Sikh: 0.02,
      "British Colonial": 0.03,
      "Modern / Post-1947": 0.92
    },
    calibratedConfidence: 0.92,
    entropy: 0.35,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Angular Concrete Bedouin Tent", detail: "Hyperbolic paraboloid concrete shell eliminating internal columns, creating an 8-sided tent.", saliencyLevel: "High" },
      { feature: "Soaring Pencil Minarets", detail: "Four needle-thin Turkish minarets framing the Himalayan foothills without traditional balconies.", saliencyLevel: "High" },
      { feature: "Minimalist White Marble Cladding", detail: "Monolithic white marble and fair-face concrete devoid of figurative or floral ornamentation.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 50, centerY: 48, radiusX: 44, radiusY: 36 }
  },
  {
    id: "mazar-e-quaid",
    name: "Mazar-e-Quaid (Jinnah Mausoleum)",
    era: "Modern / Post-1947",
    city: "Karachi, Sindh",
    yearBuilt: "1960–1971 CE (Yahya Merchant)",
    imageUrl: "/monuments/modern_mazar_quaid.jpg",
    creator: "Mausoleum of Muhammad Ali Jinnah Archive / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mazar-e-Quaid_Karachi_Mausoleum.jpg",
    description: "Designed by architect Yahya Merchant to honor Quaid-e-Azam Muhammad Ali Jinnah. The cubic white marble mausoleum features tapered walls, copper grille parabolic arches, and minimalist monumental geometry.",
    probabilities: {
      Mughal: 0.04,
      Sikh: 0.02,
      "British Colonial": 0.04,
      "Modern / Post-1947": 0.90
    },
    calibratedConfidence: 0.90,
    entropy: 0.41,
    isOod: false,
    diagnosticFeatures: [
      { feature: "Cubic White Marble Monolith", detail: "Square plan with 75-foot tapered walls faced in pristine white Rajasthani marble.", saliencyLevel: "High" },
      { feature: "Smooth Hemispherical Concrete Dome", detail: "Shallow unornamented dome springing from the cubic mass without an octagonal drum.", saliencyLevel: "High" },
      { feature: "Parabolic Entrance Arches", detail: "Clean copper and marble parabolic openings providing monumental geometric contrast.", saliencyLevel: "Medium" }
    ],
    gradCamFocus: { centerX: 50, centerY: 50, radiusX: 36, radiusY: 34 }
  },
  {
    id: "ood-subway-interior",
    name: "Abstract Concrete Subway Interior (Non-Monument)",
    era: "Out of Distribution",
    city: "Synthetic Benchmark Test",
    yearBuilt: "Modern Infrastructure",
    imageUrl: "/monuments/ood_subway.jpg",
    creator: "Modern Transit Architecture Benchmark",
    license: "Public Domain / Creative Commons",
    sourceUrl: "https://commons.wikimedia.org",
    description: "An out-of-distribution test photograph depicting contemporary subway corridors and fluorescent ceiling lights. Tests whether the classifier safely detects absence of Pakistani heritage motifs.",
    probabilities: {
      Mughal: 0.18,
      Sikh: 0.16,
      "British Colonial": 0.28,
      "Modern / Post-1947": 0.38
    },
    calibratedConfidence: 0.38,
    entropy: 1.36,
    isOod: true,
    oodReason: "Low maximum confidence (38.0% < 42.0%) and high prediction entropy (1.36 nats). Visual composition does not match trained Pakistani architectural canons.",
    diagnosticFeatures: [
      { feature: "Absence of Heritage Masonry", detail: "Lacks sandstone, lime plaster, ornamental brickwork, or marble inlay.", saliencyLevel: "Low" },
      { feature: "Artificial Tunnel Geometry", detail: "Fluorescent tube lighting and subterranean concrete lack regional architectural motifs.", saliencyLevel: "Low" }
    ],
    gradCamFocus: { centerX: 50, centerY: 50, radiusX: 20, radiusY: 20 }
  }
];

export const HISTORICAL_CANONS = [
  {
    era: "Mughal",
    dates: "c. 1526 – 1857 CE",
    color: "#059669", // Emerald Green
    bgGradient: "from-emerald-950/40 via-emerald-900/20 to-slate-900",
    overview: "The zenith of Islamic imperial architecture in South Asia. Initiated by Babur and reaching architectural maturity under Akbar, Jahangir, and Shah Jahan, the style synthesized Persian Timurid geometry, indigenous Indian stonecraft, and Central Asian dome construction.",
    materials: ["Red Sikri & Kohistan Sandstone", "Makrana White Marble", "Glazed Ceramic Kashi Tiles", "Kankar Lime Stucco"],
    keyMotifs: ["Bulbous marble double-domes on elevated drums", "Multi-cusped central peshtaq gateways", "Axial charbagh water gardens and cascading pavilions", "Pietra dura semi-precious stone inlay & floral frescoes", "Octagonal corner minarets crowned by domed chattris"],
    notableSites: ["Badshahi Mosque (Lahore)", "Lahore Fort (Sheesh Mahal, Naulakha)", "Wazir Khan Mosque (Lahore)", "Shalimar Gardens (Lahore)", "Tomb of Jahangir (Shahdara)", "Shah Jahan Mosque (Thatta)", "Hiran Minar (Sheikhupura)"]
  },
  {
    era: "Sikh",
    dates: "c. 1799 – 1849 CE",
    color: "#eab308", // Golden Yellow
    bgGradient: "from-yellow-950/40 via-yellow-900/20 to-slate-900",
    overview: "Emerged during the consolidation of the Sikh Empire under Maharaja Ranjit Singh in the Punjab plains. Blended existing Mughal forms with vibrant regional Punjabi craft traditions, domestic haveli architecture, and sacred commemorative practices.",
    materials: ["Kiln-burnt Nanakshahi Bricks", "Gilded Brass & Gold Leaf Sheeting", "Carved Deodar & Teak Wood", "Reflective Glass Mirrorwork (Shisha-Gari)"],
    keyMotifs: ["Fluted, ribbed lotus-bud cupolas with inverted kalasa finials", "Projecting wooden jharokhas with pierced screen jaalis", "Curved Bengali-style (bangla) roofs and chhajja eaves", "Narrative floral and mythological wall frescoes (naqqashi)", "Multi-story civic havelis with carved timber facades and internal courtyards"],
    notableSites: ["Samadhi of Maharaja Ranjit Singh (Lahore)", "Gurdwara Dera Sahib (Lahore)", "Gurdwara Janam Asthan (Nankana Sahib)", "Gurdwara Panja Sahib (Hasan Abdal)", "Gurdwara Darbar Sahib (Kartarpur)", "Haveli of Nau Nihal Singh (Lahore)"]
  },
  {
    era: "British Colonial",
    dates: "c. 1858 – 1947 CE",
    color: "#ef4444", // Crimson Red Brick
    bgGradient: "from-red-950/40 via-red-900/20 to-slate-900",
    overview: "Following the 1857 uprising, the British Raj established civil institutions, railways, universities, and post offices across Punjab and Sindh. Architects pioneered the 'Indo-Saracenic' style—synthesizing Victorian Gothic, Edwardian Baroque, and European structural steel with Mughal and Rajasthani ornament.",
    materials: ["Kiln-fired Red Clay Facing Bricks", "Rolled Structural Steel & Iron Trusses", "Local Buff Sandstone & Limestone", "Porous Lime-Surkhi Mortar"],
    keyMotifs: ["Exposed finely pointed red brickwork with contrasting stone dressings", "Monumental civic clock towers serving as urban navigation points", "Gothic lancet arches, buttresses, and crenellated battlement parapets", "Deep shaded verandahs and louvered jhilmil shutters for tropical thermal control", "Hybrid domes, chattris, and jaali stone screens crowning European floorplans"],
    notableSites: ["Lahore Museum (The Mall, Lahore)", "General Post Office - GPO (Lahore)", "Lahore Junction Railway Station", "Frere Hall (Karachi)", "Empress Market (Karachi)", "Government College University (Lahore)", "Aitchison College (Lahore)", "Islamia College (Peshawar)"]
  },
  {
    era: "Modern / Post-1947",
    dates: "1947 – Present",
    color: "#38bdf8", // Sky / Steel Blue
    bgGradient: "from-sky-950/40 via-sky-900/20 to-slate-900",
    overview: "Following independence, Pakistani architecture sought a sovereign civic identity free from British imperial symbols. The 1960s–1980s saw the rise of modernism and brutalism, drawing on reinforced concrete, geometric purity, and abstracted Islamic symbolism (exemplified by Islamabad's new master plan).",
    materials: ["Reinforced & Pre-stressed Concrete", "Cast-in-Place Architectural Board Concrete", "White Indigenous Marble Panels", "Structural Glazing & Anodized Aluminum"],
    keyMotifs: ["Monumental hyperbolic paraboloid concrete shells and folded plates", "Abstracted geometric forms (Bedouin tent geometries, blooming petals)", "Minimalist pure cubic monoliths devoid of historicist ornament", "Brutalist exposed brick blocks with deep shadow reveals (Nayyar Ali Dada)", "Contemporary curtain-wall towers and steel cantilevered structures"],
    notableSites: ["Faisal Mosque (Islamabad by Vedat Dalokay)", "Minar-e-Pakistan (Lahore by Nasreddin Murat-Khan)", "Pakistan Monument (Islamabad by Arif Masood)", "Mazar-e-Quaid (Karachi by Yahya Merchant)", "Alhamra Arts Council (Lahore by Nayyar Ali Dada)", "Habib Bank Plaza (Karachi)"]
  }
];

export const EVALUATION_METRICS = {
  overallAccuracy: 81.25,
  macroPrecision: 82.40,
  macroRecall: 81.25,
  macroF1: 81.52,
  ece: 0.0614,
  temperature: 1.284,
  hardestClass: "British Colonial",
  easiestClass: "Modern / Post-1947",
  mostConfused: "British Colonial confused as Mughal (due to Indo-Saracenic chattris & brickwork)",
  confusionMatrix: [
    { trueEra: "Mughal", predMughal: 6, predSikh: 1, predColonial: 1, predModern: 0 },
    { trueEra: "Sikh", predMughal: 1, predSikh: 7, predColonial: 0, predModern: 0 },
    { trueEra: "British Colonial", predMughal: 2, predSikh: 0, predColonial: 6, predModern: 0 },
    { trueEra: "Modern / Post-1947", predMughal: 0, predSikh: 0, predColonial: 1, predModern: 7 }
  ],
  perClass: [
    { era: "Mughal", precision: 66.7, recall: 75.0, f1: 70.6, support: 8 },
    { era: "Sikh", precision: 87.5, recall: 87.5, f1: 87.5, support: 8 },
    { era: "British Colonial", precision: 75.0, recall: 75.0, f1: 75.0, support: 8 },
    { era: "Modern / Post-1947", precision: 100.0, recall: 87.5, f1: 93.3, support: 8 }
  ]
};
