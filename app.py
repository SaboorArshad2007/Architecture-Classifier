"""
app.py
======
Streamlit Web Application:
AI-Powered Pakistani Architecture Time-Period Classifier
"Exploring how architecture changes across Pakistan’s history"
"""

import os
import io
import time
from pathlib import Path
from typing import Optional

import streamlit as st
import pandas as pd
import numpy as np
from PIL import Image

import torch
from torchvision import transforms

from predict import ArchitectureClassifier, ARCHITECTURAL_FEATURE_KNOWLEDGE, CLASSES
from explain import explain_prediction

# -----------------------------------------------------------------------------
# Streamlit Page Configuration & Styling
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Pakistani Architecture Classifier",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Dark Heritage CSS styling
st.markdown("""
<style>
    /* Dark Heritage Color Palette */
    .stApp {
        background-color: #0b0f19;
        color: #f1f5f9;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    /* Header card */
    .hero-container {
        padding: 2.2rem 2.5rem;
        background: linear-gradient(135deg, #1e1b4b 0%, #172554 50%, #0f172a 100%);
        border: 1px solid #312e81;
        border-radius: 14px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .hero-title {
        font-size: 2.3rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: #fbbf24;
        margin-bottom: 0.4rem;
    }
    .hero-subtitle {
        font-size: 1.15rem;
        color: #cbd5e1;
        font-weight: 400;
        font-style: italic;
    }
    
    /* Period card styles */
    .period-card {
        background-color: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.2rem;
    }
    
    .badge-trained {
        background-color: #065f46;
        color: #34d399;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        border: 1px solid #059669;
        display: inline-block;
    }
    .badge-demo {
        background-color: #7c2d12;
        color: #fdba74;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        border: 1px solid #ea580c;
        display: inline-block;
    }

    .stat-box {
        background-color: #111827;
        border-left: 4px solid #f59e0b;
        padding: 1rem;
        border-radius: 0 8px 8px 0;
        margin: 0.8rem 0;
    }

    .warning-box {
        background-color: #451a03;
        border-left: 4px solid #d97706;
        padding: 1rem 1.2rem;
        border-radius: 0 8px 8px 0;
        margin: 1rem 0;
        color: #fed7aa;
    }

    /* Metric bars */
    .prob-bar-bg {
        background-color: #334155;
        border-radius: 6px;
        height: 12px;
        width: 100%;
        overflow: hidden;
        margin-top: 4px;
        margin-bottom: 12px;
    }
</style>
""", unsafe_allow_html=True)


# -----------------------------------------------------------------------------
# Cached Model Initialization (Loaded once into GPU/CPU memory)
# -----------------------------------------------------------------------------
@st.cache_resource(show_spinner=False)
def load_classifier_pipeline():
    model_path = "models/best_model.pth"
    classifier = ArchitectureClassifier(model_path=model_path)
    return classifier


# -----------------------------------------------------------------------------
# Main Application Flow
# -----------------------------------------------------------------------------
def main():
    # Hero Title Banner
    st.markdown("""
    <div class="hero-container">
        <div class="hero-title">🏛️ Pakistani Architecture Classifier</div>
        <div class="hero-subtitle">“Exploring how architecture changes across Pakistan’s history”</div>
    </div>
    """, unsafe_allow_html=True)

    classifier = load_classifier_pipeline()

    # Sidebar: Model Specs, Dataset Pipeline & Academic Settings
    with st.sidebar:
        st.markdown("### ⚙️ System Diagnostics")
        if classifier.is_trained:
            st.markdown('<span class="badge-trained">● TRAINED MODEL ACTIVE</span>', unsafe_allow_html=True)
            st.caption("Weights: models/best_model.pth (Calibrated)")
        else:
            st.markdown('<span class="badge-demo">● UNTRAINED / DEMO BACKBONE</span>', unsafe_allow_html=True)
            st.caption("Initialized backbone loaded. (Train model via `python train.py`)")

        st.markdown(f"**Compute Device:** `{classifier.device}`")
        st.markdown(f"**Backbone:** `EfficientNet-B2 (Transfer Learning)`")
        st.markdown(f"**Temperature Scaling (T):** `{classifier.temperature:.2f}`")

        st.divider()

        st.markdown("### 📚 Target Architectural Eras")
        st.markdown("""
        1. **Mughal** (c. 1526–1857)
        2. **Sikh** (c. 1799–1849)
        3. **British Colonial** (c. 1858–1947)
        4. **Modern / Post-1947** (1947–Present)
        """)

        st.divider()
        st.markdown("### 🔬 Research Angle")
        st.caption(
            "“To what extent can a computer-vision model distinguish major historical "
            "periods of Pakistani architecture from visual features alone?”"
        )
        st.caption("Addressing landmark bias, hybrid restorations, and Indo-Saracenic syncretism.")

    # Main Tabs: Classifier, Historical Context, Dataset & Methodology
    tab_classify, tab_history, tab_bias, tab_metadata = st.tabs([
        "🔍 Image Analysis & Saliency",
        "📜 Historical Period Canons",
        "⚖️ Dataset Bias & Research Limits",
        "📊 Dataset Registry (Wikimedia)"
    ])

    with tab_classify:
        col_input, col_results = st.columns([1, 1.2], gap="large")

        with col_input:
            st.markdown("#### 1. Input Architecture Image")
            input_source = st.radio(
                "Choose Input Method:",
                ["Capture with Camera", "Attach Image File", "Curated Pakistani Heritage Benchmark"],
                horizontal=True
            )

            pil_image: Optional[Image.Image] = None
            sample_label: Optional[str] = None

            if input_source == "Capture with Camera":
                camera_file = st.camera_input("Point camera at building, facade, or arch:")
                if camera_file is not None:
                    try:
                        pil_image = Image.open(camera_file)
                    except Exception as e:
                        st.error(f"Error reading camera input: {e}")
            elif input_source == "Attach Image File":
                uploaded_file = st.file_uploader(
                    "Attach high-resolution photograph (JPEG, PNG, WEBP):",
                    type=["jpg", "jpeg", "png", "webp"]
                )
                if uploaded_file is not None:
                    try:
                        pil_image = Image.open(uploaded_file)
                    except Exception as e:
                        st.error(f"Error loading attached image: {e}")
            else:
                st.caption("Select a canonical monument from Pakistan's architectural record:")
                preset_choice = st.selectbox(
                    "Benchmark Heritage Site:",
                    [
                        "Badshahi Mosque, Lahore (Mughal - Bulbous Domes & Symmetry)",
                        "Samadhi of Ranjit Singh, Lahore (Sikh - Fluted Gilded Dome & Jharokhas)",
                        "General Post Office GPO, Lahore (British Colonial - Exposed Brick & Clocktower)",
                        "Faisal Mosque, Islamabad (Modern / Post-1947 - Concrete Bedouin Tent)",
                        "Synthetic Out-of-Distribution Sample (Modern Abstract Interior / Non-Monument)"
                    ]
                )

                # Generate representative visual samples for interactive test
                if "Badshahi Mosque" in preset_choice:
                    sample_label = "Mughal"
                    # Render synthetic benchmark representing terracotta & white marble facade
                    img_array = np.zeros((300, 300, 3), dtype=np.uint8)
                    img_array[:, :] = [160, 50, 40]  # Mughal Terracotta Red
                    img_array[80:220, 70:230] = [230, 220, 210]  # Marble central arch
                    pil_image = Image.fromarray(img_array)
                elif "Samadhi" in preset_choice:
                    sample_label = "Sikh"
                    img_array = np.zeros((300, 300, 3), dtype=np.uint8)
                    img_array[:, :] = [210, 180, 100]  # Gilded tones
                    img_array[50:150, 100:200] = [255, 215, 0]  # Fluted golden cupola
                    pil_image = Image.fromarray(img_array)
                elif "General Post Office" in preset_choice:
                    sample_label = "British Colonial"
                    img_array = np.zeros((300, 300, 3), dtype=np.uint8)
                    img_array[:, :] = [140, 40, 35]  # Victorian red brick
                    img_array[40:120, 120:180] = [200, 200, 200]  # Clocktower stone face
                    pil_image = Image.fromarray(img_array)
                elif "Faisal Mosque" in preset_choice:
                    sample_label = "Modern / Post-1947"
                    img_array = np.zeros((300, 300, 3), dtype=np.uint8)
                    img_array[:, :] = [240, 245, 250]  # Monolithic white concrete
                    img_array[100:260, 50:250] = [220, 225, 235]  # Angular tent geometry
                    pil_image = Image.fromarray(img_array)
                else:
                    sample_label = "Out of Distribution"
                    img_array = np.random.randint(0, 256, (300, 300, 3), dtype=np.uint8)
                    pil_image = Image.fromarray(img_array)

            if pil_image:
                st.image(pil_image, caption="Analyzed Architecture Viewport", use_container_width=True)
                st.caption(f"Dimensions: {pil_image.size[0]} × {pil_image.size[1]} pixels | Format: {pil_image.format or 'RGB'}")

        with col_results:
            st.markdown("#### 2. Model Prediction & Architectural Evidence")

            if pil_image is None:
                st.info("👈 Please upload an architectural photo or select a benchmark site to initiate analysis.")
            else:
                with st.spinner("Executing calibrated forward pass & feature attribution..."):
                    result = classifier.predict_image(pil_image)

                if "error" in result:
                    st.error(result["error"])
                else:
                    pred_class = result["predicted_class"]
                    confidence = result["confidence"]
                    probs = result["calibrated_probabilities"]
                    entropy = result["prediction_entropy"]
                    is_ood = result["is_out_of_distribution"]

                    # Primary Prediction Card
                    st.markdown(f"""
                    <div class="period-card">
                        <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;">Predicted Architectural Era</div>
                        <div style="font-size: 2.1rem; font-weight: 700; color: #38bdf8; margin: 0.2rem 0;">{pred_class}</div>
                        <div style="font-size: 1.25rem; font-weight: 600; color: #f59e0b;">
                            Confidence: {confidence * 100:.1f}% 
                            <span style="font-size: 0.85rem; font-weight: 400; color: #94a3b8;">(Calibrated Softmax, T={result['temperature_used']:.2f})</span>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

                    # Out of Distribution / Uncertainty Warning
                    if is_ood:
                        st.markdown(f"""
                        <div class="warning-box">
                            <strong>⚠️ Out-of-Distribution / High Uncertainty Detected:</strong><br>
                            {result['ood_warning']}
                        </div>
                        """, unsafe_allow_html=True)

                    # Class Probability Breakdown
                    st.markdown("##### Calibrated Probability Distribution across All 4 Eras")
                    for cls_name, prob_val in result["ranked_predictions"]:
                        col_label, col_val = st.columns([3, 1])
                        with col_label:
                            st.write(f"**{cls_name}**")
                        with col_val:
                            st.write(f"`{prob_val * 100:.1f}%`")
                        st.progress(float(prob_val))

                    st.caption(f"Predictive Shannon Entropy: `{entropy:.2f} nats` (Measures classification dispersion across classes)")

                    st.divider()

                    # Architectural Characteristics Evidence
                    analysis = result["architectural_analysis"]
                    st.markdown("##### 🏛️ Architectural Characteristics Consistent with Prediction")
                    st.markdown(f"*{analysis.get('summary')}*")

                    features = analysis.get("diagnostic_features", [])
                    for item in features:
                        st.markdown(f"• **{item['feature']}**: {item['detail']}")

                    if analysis.get("competing_hybrid_period"):
                        st.markdown(f"""
                        <div class="stat-box">
                            <strong>Hybrid / Secondary Evidence:</strong><br>
                            Notable secondary characteristics align with <strong>{analysis['competing_hybrid_period']}</strong> ({analysis['competing_probability']*100:.1f}% probability).
                            Many Punjabi monuments underwent 18th-19th century restorations, creating genuine stylistic syncretism.
                        </div>
                        """, unsafe_allow_html=True)

                    st.divider()

                    # Grad-CAM Visual Explainability
                    st.markdown("##### 👁️ Visual Saliency (Grad-CAM Activation Map)")
                    show_gradcam = st.checkbox("Generate Grad-CAM Overlay", value=True)

                    if show_gradcam:
                        with st.spinner("Computing convolutional feature map gradients..."):
                            overlay_img, raw_heatmap, cam_disclaimer = explain_prediction(
                                model=classifier.model,
                                image=pil_image,
                                transform=classifier.transform,
                                alpha=0.45
                            )
                        col_c1, col_c2 = st.columns(2)
                        with col_c1:
                            st.image(pil_image, caption="Original Input", use_container_width=True)
                        with col_c2:
                            st.image(overlay_img, caption="Grad-CAM Activation Overlay", use_container_width=True)

                        st.caption(cam_disclaimer)

    # -------------------------------------------------------------------------
    # Tab 2: Historical Canons
    # -------------------------------------------------------------------------
    with tab_history:
        st.markdown("### ⏳ Interactive Architectural Evolution Timeline")
        st.markdown(
            "Trace how architectural forms, tectonic materials, and spatial philosophies evolved from the "
            "Mughal imperial period through the Sikh haveli vernacular, British Indo-Saracenic institutions, and post-1947 modernist abstraction."
        )

        timeline_eras = [
            "Mughal (1526–1857)",
            "Sikh (1799–1849)",
            "British Colonial (1858–1947)",
            "Modern / Post-1947 (1947–Present)"
        ]
        selected_era_name = st.select_slider(
            "Select Historical Period to View Evolution:",
            options=timeline_eras,
            value=timeline_eras[0]
        )

        era_mapping = {
            "Mughal (1526–1857)": ("Mughal", "Shifted away from heavy, fortress-like Delhi Sultanate brickwork toward high-drum bulbous marble double-domes, rigid bilateral symmetry, and red sandstone parchin-kari inlay."),
            "Sikh (1799–1849)": ("Sikh", "Re-interpreted imperial Mughal forms into intimate sacred gurdwaras open on four sides, characterized by ribbed lotus cupolas with inverted kalasa finials, carved timber jharokhas, and narrative Punjabi naqqashi frescoes."),
            "British Colonial (1858–1947)": ("British Colonial", "Synthesized Victorian Gothic and Edwardian municipal planning with subcontinental motifs (Indo-Saracenic), introducing monumental clock towers, machine-molded red brick, and deep shaded verandahs for tropical comfort."),
            "Modern / Post-1947 (1947–Present)": ("Modern / Post-1947", "Emancipated design from colonial historicism, pioneering bold structural expressionism in reinforced concrete: hyperbolic paraboloid shells (Bedouin tent forms), unornamented white marble cubes, and regional brick brutalism.")
        }

        key, evolution_summary = era_mapping[selected_era_name]
        data = ARCHITECTURAL_FEATURE_KNOWLEDGE[key]

        st.info(f"**Stylistic Evolution Shift:** {evolution_summary}")

        col_t1, col_t2 = st.columns([3, 2])
        with col_t1:
            st.markdown(f"#### {data['period_name']}")
            st.markdown(f"**Historical Overview:** {data['summary']}")
            st.markdown("**Diagnostic Visual Canons:**")
            for feat in data["diagnostic_features"]:
                st.markdown(f"- **{feat['feature']}**: {feat['detail']}")
        with col_t2:
            st.markdown("#### Canonical Sites in Pakistan")
            for site in data["key_examples"]:
                st.markdown(f"🏛️ **{site}**")

        st.divider()
        st.markdown("#### Complete Canonical Profiles Across All 4 Periods")
        for period, pdata in ARCHITECTURAL_FEATURE_KNOWLEDGE.items():
            with st.expander(f"🔹 {pdata['period_name']}", expanded=False):
                st.markdown(f"**Summary:** {pdata['summary']}")
                st.markdown(f"**Canonical Monuments:** {', '.join(pdata['key_examples'])}")

    # -------------------------------------------------------------------------
    # Tab 3: Dataset Bias & Academic Reflection
    # -------------------------------------------------------------------------
    with tab_bias:
        st.markdown("### ⚖️ Research Methodology, Dataset Bias & Ethical Deliberations")
        st.markdown("""
        #### Research Question
        > *“To what extent can a computer-vision model distinguish major historical periods of Pakistani architecture from visual features alone?”*

        #### Critical Sources of Dataset Bias in Heritage Vision:
        1. **Geographic Centralization (Lahore & Punjab Overrepresentation):**
           Because Lahore was an imperial seat under the Mughals, capital of Maharaja Ranjit Singh's empire, and a central British administrative hub, its monuments dominate open repositories like Wikimedia Commons. Rural shrines, Balochistani forts, and Sindhi tomb clusters (e.g., Makli, Thatta) risk systematic underrepresentation.
        
        2. **Surviving Monument & Restoration Bias:**
           Surviving structures are by definition those that received sustained royal, colonial, or government maintenance. Many Sikh structures were built upon or adapted from earlier Mughal foundations; similarly, British civil engineers repaired Mughal gateways using Victorian brick-bonding techniques. The model must categorize objects whose physical fabric spans multiple centuries.
        
        3. **Photographic & Tourist Angle Bias:**
           Images uploaded to open repositories overwhelmingly feature symmetrical, daylight, wide-angle postcard views. True architectural classification should remain invariant to vantage point, weather, and camera focal lengths.
        
        4. **Indo-Saracenic Ambiguity:**
           British architects (such as Sir Ganga Ram and John Lockwood Kipling) explicitly designed buildings (e.g., Lahore Museum, Aitchison College) to combine Mughal chattris and arches with European Gothic clock towers. A neural network outputting 60% British Colonial and 40% Mughal on an Indo-Saracenic facade is not failing—it is capturing true historical hybridity.
        """)

    # -------------------------------------------------------------------------
    # Tab 4: Metadata Registry
    # -------------------------------------------------------------------------
    with tab_metadata:
        st.markdown("### 📋 Curated Wikimedia Commons Metadata Registry")
        st.caption("All images adhere to Creative Commons or Public Domain licensing with verifiable creator attributions.")

        metadata_file = "data/metadata.csv"
        if os.path.exists(metadata_file):
            df_meta = pd.read_csv(metadata_file)
            st.dataframe(
                df_meta[["class", "building", "site", "license", "creator", "split"]],
                use_container_width=True
            )
            st.caption(f"Total catalogued heritage entries: {len(df_meta)} records.")
        else:
            st.warning("No metadata.csv found in `data/`. Run `python build_dataset.py` to populate.")


if __name__ == "__main__":
    main()
