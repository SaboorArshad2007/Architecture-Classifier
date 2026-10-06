# AI-Powered Pakistani Architecture Time-Period Classifier
*“Exploring how architecture changes across Pakistan’s history”*

An academic computer vision research project and interactive web application that analyzes photographs of Pakistani architecture and predicts which historical epoch they belong to: **Mughal**, **Sikh**, **British Colonial**, or **Modern / Post-1947**.

---

## 🏛️ Research Question

> **“To what extent can a computer-vision model distinguish major historical periods of Pakistani architecture from visual features alone?”**

Rather than memorizing famous tourist monuments, the system aims to generalize visual characteristics—such as arch curvature, masonry composition, dome geometry, facade symmetry, and ornamentation styles—while accounting for historical syncretism and dataset bias.

---

## 🧭 Four Historical Architectural Eras

| Era | Historical Span | Diagnostic Architectural Features | Benchmark Examples in Pakistan |
| :--- | :--- | :--- | :--- |
| **Mughal** | c. 1526 – 1857 | Symmetrical facades, bulbous marble double-domes, red sandstone with pietra dura inlay, kashi-kari tilework, cusped arches. | Badshahi Mosque, Lahore Fort, Wazir Khan Mosque, Shalimar Gardens, Tomb of Jahangir |
| **Sikh** | c. 1799 – 1849 | Fluted ribbed cupolas, gold/brass leafing, ornate wooden jharokhas, curved bangla roofs, elaborate stucco (*gach*). | Samadhi of Ranjit Singh, Gurdwara Dera Sahib, Gurdwara Janam Asthan, Haveli Nau Nihal Singh |
| **British Colonial** | c. 1858 – 1947 | Indo-Saracenic synthesis, exposed kiln-fired red brick, civic clock towers, Gothic lancet windows, deep shaded verandahs. | Lahore Museum, General Post Office (GPO), Lahore Railway Station, Frere Hall, Empress Market |
| **Modern / Post-1947** | 1947 – Present | Reinforced concrete brutalism, angular geometric abstractions, minimalist marble monoliths, glass curtain walls. | Faisal Mosque, Minar-e-Pakistan, Pakistan Monument, Mazar-e-Quaid, Alhamra Arts Council |

---

## 📁 Project Structure

```
pakistan_architecture_ai/
├── app.py                      # Interactive Streamlit application
├── build_dataset.py            # Wikimedia Commons harvester, deduplicator & group splitter
├── train.py                    # Staged fine-tuning, cosine schedule & temperature scaling
├── evaluate.py                 # Test set evaluation, ECE & confusion matrix generator
├── predict.py                  # Calibrated inference engine & architectural reasoning
├── explain.py                  # Grad-CAM convolutional saliency mapping
├── review_data.py              # Metadata inspection and label auditing CLI
├── requirements.txt            # Pinned Python package dependencies
├── README.md                   # Comprehensive project documentation
├── PROJECT_WRITEUP.md          # Research paper & historiographical reflection
├── COLAB_TRAINING.md           # Step-by-step Google Colab GPU training guide
│
├── data/
│   ├── raw/                    # Raw downloads from Wikimedia Commons
│   ├── processed/              # Verified, deduplicated, cleaned images
│   ├── train/                  # Group-isolated training split
│   ├── val/                    # Group-isolated validation split
│   ├── test/                   # Group-isolated untouched test split
│   └── metadata.csv            # Attribution, licenses, sites, and labels
│
├── models/
│   ├── best_model.pth          # Checkpoint with optimal validation loss
│   ├── final_model.pth         # Final epoch weights
│   └── calibration/
│       └── temperature.json    # Calibrated temperature parameter T
│
├── outputs/
│   ├── dataset_report.json     # Split distribution and deduplication statistics
│   ├── classification_report.txt# Test accuracy, macro F1, and per-class metrics
│   ├── confusion_matrix.png    # Test set confusion matrix visualization
│   └── training_curves.png     # Loss and accuracy curves across epochs
│
└── .streamlit/
    └── config.toml             # Custom dark heritage UI configuration
```

---

## 🔬 Key Engineering Innovations

### 1. Group-Aware Monument Isolation (Zero Data Leakage)
In architectural datasets, random train/test splitting causes severe leakage: the model memorizes lighting or courtyard vegetation of a specific monument rather than learning architectural rules.  
This pipeline enforces **group-level splitting by monument/site**: all images of Badshahi Mosque exist strictly within train, validation, or test.

### 2. Perceptual Hashing (`phash`) Quality Control
Automatically identifies and removes:
- Corrupted or truncated files (`PIL.verify()`)
- Sub-resolution thumbnails (`< 224x224 px`)
- Visual near-duplicates (Hamming distance $\le 6$ via `imagehash`)
- Extreme aspect-ratio artifacts (panoramas or web banners)

### 3. Probability Calibration (Temperature Scaling)
Modern neural networks often exhibit overconfidence. We apply post-hoc **Temperature Scaling** on the validation set logits:
$$\hat{p}_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$$
This minimizes Expected Calibration Error (ECE) and provides realistic uncertainty estimates.

### 4. Out-of-Distribution (OOD) & Ambiguity Detection
The system rejects non-architectural uploads or ambiguous compositions if:
- Maximum Softmax Probability is below threshold ($< 42\%$).
- Predictive Shannon Entropy is high ($> 1.32\text{ nats}$).

### 5. Explainability via Grad-CAM
Visualizes gradient-weighted convolutional activations to verify whether the model is focusing on relevant architectural elements (e.g., dome contours, arches, masonry) rather than tourist crowds or sky.

---

## 🚀 Quickstart Guide

### 1. Local Installation
Clone the repository and install dependencies in a virtual environment:
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Streamlit Application
```bash
streamlit run app.py
```
Open `http://localhost:8501` to use the application.

---

## 🛠️ Complete Training & Pipeline Workflow

### Step 1: Harvest and Build Dataset
Harvest open-access images from Wikimedia Commons categories with rate-limiting, deduplicate via `phash`, and split into group-isolated folders:
```bash
python build_dataset.py --target-per-class 150 --all
```

### Step 2: Audit & Review Labels (Optional)
Inspect the metadata distribution or correct labels:
```bash
# View summary of catalogued sites and splits
python review_data.py --summary

# Relabel a miscategorized photo
python review_data.py --relabel "sample.jpg" "Mughal" --building "Wazir Khan Mosque, Lahore"
```

### Step 3: Train Model
Fine-tune EfficientNet-B2 with transfer learning, cosine learning rate scheduling, class-balanced loss, and automated temperature calibration:
```bash
python train.py --epochs 25 --batch-size 16 --lr 0.0003 --backbone efficientnet_b2
```
Outputs `models/best_model.pth` and `models/calibration/temperature.json`.

### Step 4: Evaluate on Untouched Test Set
Generate confusion matrix, classification report, and ECE:
```bash
python evaluate.py --model models/best_model.pth --split test
```

---

## ☁️ Google Colab Training
To train with a free T4 GPU on Google Colab, see [COLAB_TRAINING.md](COLAB_TRAINING.md) for exact copy-paste commands and notebook cells.

---

## ⚖️ Limitations & Ethical Considerations

1. **Geographic Imbalance:** Wikimedia Commons contains far more photography of Lahore and urban Punjab than rural Sindh, Khyber Pakhtunkhwa, or Balochistan.
2. **Surviving Monument Bias:** The dataset naturally skews toward grand stone structures preserved by royal or government patronage, omitting ephemeral domestic vernacular architecture.
3. **Historical Palimpsests:** Many monuments evolved over centuries (e.g., Lahore Fort contains Mughal pavilions, Sikh additions, and British modifications). A high second-place probability often reflects genuine historical hybridity.
4. **Attribution & Creative Commons:** All harvested imagery respects original CC-BY / CC-BY-SA licenses and retains author attribution in `data/metadata.csv`.

---

## 📜 License & Citation
Academic and educational research project. All source code is released under the **Apache-2.0 License**. Image assets belong to their respective creators under Creative Commons licenses documented in `data/metadata.csv`.
