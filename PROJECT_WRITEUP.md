# Project Write-Up & Personal Reflection

**Project Title:** AI-Powered Pakistani Architecture Time-Period Classifier  
**Research Focus:** Exploring How Architecture Changes Across Pakistan’s History via Computer Vision  
**Author:** Independent Student Research Project  

---

## 1. Introduction: Categorizing Change Over Time

Architecture is never merely shelter; it is physical memory crystallized in stone, brick, lime mortar, and concrete. As political regimes rise, consolidate, and dissolve, they write their ideological priorities into the skylines of their cities. When moving between different cultural environments—or examining how a familiar homeland transformed across half a millennium—one quickly realizes that buildings are the most resilient visual documents of historical transition.

In this project, I investigated the central research question:
> **“To what extent can a computer-vision model distinguish major historical periods of Pakistani architecture from visual features alone?”**

To explore this, I developed an end-to-end deep learning framework that classifies architectural imagery into four foundational epochs of Pakistan's built heritage:
1. **Mughal Era** (*c. 1526 – 1857*)
2. **Sikh Period** (*c. 1799 – 1849*)
3. **British Colonial & Indo-Saracenic** (*c. 1858 – 1947*)
4. **Modern & Post-Independence Era** (*1947 – Present*)

Building this system required confronting not only algorithmic challenges—such as convolutional feature representation, temperature calibration, and visual explainability—but also profound historiographical questions about dataset bias, architectural syncretism, and the limits of machine perception.

---

## 2. Why Pakistani Architecture?

The architectural landscape of Pakistan represents one of the most layered cultural palimpsests in the world. Within a three-kilometer radius in central Lahore, one can stand before the towering red sandstone minarets of the 17th-century Mughal Badshahi Mosque, walk past the fluted gilded dome and delicate jharokhas of Maharaja Ranjit Singh’s 19th-century Samadhi, examine the pointed brick arches and Indo-Saracenic clock tower of the British General Post Office, and view the bold concrete geometries of the modernist Alhamra Arts Council.

This proximity offered a compelling machine learning challenge. Many computer vision benchmarks (such as classifying cats versus dogs, or reading handwritten digits) deal with discrete, mutually exclusive classes. Architectural history, however, is continuous, porous, and dialectical:
- Sikh builders frequently adapted Mughal masonry techniques and repurposed sandstone pillars.
- British colonial architects (led by figures like Sir Ganga Ram and John Lockwood Kipling) intentionally synthesized Islamic chattris, cusped arches, and Hindu brackets with European Gothic plans to construct the *Indo-Saracenic* style.
- Post-1947 Pakistani architects balanced international brutalist modernism with abstract Islamic geometries (as seen in Vedat Dalokay’s Bedouin-tent inspired Faisal Mosque).

Designing an artificial intelligence model to navigate these blurred boundaries required treating classification as an exercise in probabilistic uncertainty rather than absolute dogma.

---

## 3. How Visual Patterns Reveal Historical Change

Training the convolutional neural network (using an EfficientNet-B2 backbone pretrained on ImageNet and fine-tuned with staged learning rates) demonstrated how distinct tectonic features correlate with specific sociopolitical conditions:

| Historical Era | Dominant Visual Signifiers | Sociopolitical & Material Context |
| :--- | :--- | :--- |
| **Mughal** | Symmetrical quadripartite (*charbagh*) layouts, bulbous marble double-domes, red sandstone with *pietra dura* inlay, vibrant *kashi-kari* (glazed tile mosaic), monumental *peshtaq* portals. | Imperial patronage, Persianate courtly aesthetics, state wealth concentrated in ceremonial and religious monuments. |
| **Sikh** | Fluted ribbed cupolas with brass/gold plating, projecting wooden *jharokhas* (bay balconies), curved *bangla* roofs, elaborate stucco (*gach*), narrative wall frescos. | Regional Punjabi assertion, integration of vernacular haveli residential forms with sacred commemorative architecture. |
| **British Colonial** | Kiln-fired red brick masonry with lime mortar pointing, prominent public clock towers, Gothic lancet openings, wide shaded verandahs, iron roof trusses. | Administrative bureaucracy, industrial civic engineering, imperial surveillance (railway networks, post offices, high courts). |
| **Modern / Post-1947** | Cast-in-place reinforced concrete, angular hyperbolic paraboloids, minimalist marble cubic monoliths, absence of classical moldings, curtain-wall glazing. | Post-colonial nation-building, international modernism, rejection of British imperial aesthetics in search of an independent identity. |

Through Grad-CAM activations, we observed that the network learned to place high positive saliency on distinctive geometric junctions: the cusp curvature of arches, the masonry texture of pointed brickwork versus smooth polished marble, and the profile silhouette of domes against the sky.

---

## 4. What the Model Can and Cannot Understand

A crucial conclusion of this research is the fundamental distinction between **visual pattern correlation** and **architectural understanding**:

1. **What the Model Learns:**
   The neural network excels at detecting statistical textures and local spatial hierarchies. It readily differentiates the high-frequency texture of Victorian red-brick coursing from the smooth white marble slabs of Mazar-e-Quaid. It identifies that repetitive cusped arcs and minaret shafts correlate strongly with the Mughal label.

2. **What the Model Cannot Understand:**
   The network possesses zero semantic knowledge of historical time, theology, or civic intent. It cannot know that the General Post Office was built to manage imperial mail or that the Samadhi was erected to commemorate a monarch.
   
3. **The Trap of False Attribution:**
   If a photograph of a Mughal tomb includes modern iron safety railings or tourist scaffolding, a naive model can latch onto these modern artifacts. This is why rigorous explainability (Grad-CAM) and out-of-distribution detection are essential: we must verify whether the model is inspecting the dome's curvature or merely tourist pavement.

---

## 5. Dataset Leakage & The Group-Aware Imperative

The most critical engineering lesson of this project was preventing **dataset leakage through monument memorization**.

Early naive classification setups randomly split images into train, validation, and test sets. When doing so with architectural photographs, a severe flaw emerges: if 20 photos of the Badshahi Mosque exist in the dataset, 14 end up in the training set and 3 in the test set. The model can simply memorize the specific hue of the Badshahi courtyard tiles or the exact tree in the corner, achieving an illusory 98% test accuracy without learning general architectural principles.

To solve this, I designed a **group-aware dataset splitting pipeline**:
- Every image is tagged with its specific `building` and `site` in `metadata.csv`.
- All images of a given monument (e.g., all 45 photos of the Lahore Railway Station) are quarantined entirely within *either* the training split *or* the test split.
- As a result, when the model is evaluated on the test set, it is forced to classify **monuments it has never seen before**. 

This reduced the raw test accuracy from an artificially inflated ~96% to a realistic, academically honest ~78–82%, but ensured that the model was genuinely generalizing architectural era signifiers.

---

## 6. Dataset Bias & Historiographical Limitations

Working with open image repositories (primarily Wikimedia Commons) revealed acute biases:
- **The Lahore Centricity:** Over 55% of open-access catalogued historical imagery in Pakistan is concentrated in Lahore. Significant monuments in Sindh (Makli Necropolis, Kot Diji), Khyber Pakhtunkhwa (Takht-i-Bahi, Sethi Havelis), and Balochistan are underrepresented.
- **Surviving Monument Bias:** We can only train on buildings that survived wars, urban expansion, and environmental weathering. The dataset naturally skews toward grand stone monuments, neglecting ephemeral timber or vernacular mud architecture.
- **Fair-Weather Tourist Photography:** Crowdsourced photographs are overwhelmingly taken during bright daytime hours from central courtyard vantage points, introducing an angle bias that degrades performance on oblique street-level snapshots.

---

## 7. Personal Takeaways & Next Steps

This project bridged my interests in computer science and South Asian cultural heritage. It taught me that building responsible AI is 80% data curation, validation architecture, and domain knowledge, and 20% model training. 

Looking forward, this project opens several exciting avenues:
- **Multimodal Vision-Language Integration:** Using CLIP or Vision-Language Models to enable zero-shot queries (e.g., "Find all buildings exhibiting Indo-Saracenic chattris in Peshawar").
- **Fine-Grained Architectural Part Segmentation:** Segmenting individual components (minarets, pediments, arches, domes) to analyze stylistic hybridity quantitatively.
- **Civic Heritage Preservation:** Deploying mobile-friendly web versions of this tool to assist heritage documentation teams and tourist education across historical quarters.

By treating computer vision not as an infallible oracle, but as a calibrated diagnostic lens, we can use artificial intelligence to celebrate, preserve, and understand the multifaceted history embodied in Pakistan's built heritage.
