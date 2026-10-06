export interface CodeFile {
  filename: string;
  category: "Python Model" | "Dataset & Review" | "Documentation";
  description: string;
  path: string;
  language: string;
  codeSnippet: string;
}

export const CODE_REPOSITORY: CodeFile[] = [
  {
    filename: "app.py",
    category: "Python Model",
    description: "Full Streamlit application with custom dark heritage UI, cached model inference, Grad-CAM generation, and historical context.",
    path: "app.py",
    language: "python",
    codeSnippet: `import os
import streamlit as st
import numpy as np
from PIL import Image
from predict import ArchitectureClassifier, CLASSES
from explain import explain_prediction

st.set_page_config(page_title="Pakistani Architecture Classifier", page_icon="🏛️", layout="wide")

@st.cache_resource
def load_classifier():
    return ArchitectureClassifier("models/best_model.pth")

classifier = load_classifier()

st.title("🏛️ AI-Powered Pakistani Architecture Time-Period Classifier")
st.caption("“Exploring how architecture changes across Pakistan’s history”")

uploaded = st.file_uploader("Upload architecture image", type=["jpg", "png", "webp"])
if uploaded:
    img = Image.open(uploaded)
    result = classifier.predict_image(img)
    st.subheader(f"Predicted: {result['predicted_class']} ({result['confidence']*100:.1f}%)")
    for cls, prob in result["ranked_predictions"]:
        st.write(f"{cls}: {prob*100:.1f}%")
        st.progress(float(prob))
    
    if result["is_out_of_distribution"]:
        st.warning(result["ood_warning"])
        
    overlay, _, disclaimer = explain_prediction(classifier.model, img, classifier.transform)
    st.image(overlay, caption="Grad-CAM Overlay")
    st.caption(disclaimer)`
  },
  {
    filename: "train.py",
    category: "Python Model",
    description: "Training pipeline with group-aware monument splitting, staged transfer learning, class weighting, cosine annealing, and temperature calibration.",
    path: "train.py",
    language: "python",
    codeSnippet: `import torch
import torch.nn as nn
from predict import ModelArchitecture, CLASSES
from sklearn.model_selection import GroupShuffleSplit

# Enforce Group-Aware Splitting to prevent monument memorization
gss = GroupShuffleSplit(n_splits=1, train_size=0.70, random_state=42)
train_idx, val_idx = next(gss.split(df, groups=df["building"]))

model = ModelArchitecture(num_classes=4, backbone_name="efficientnet_b2", pretrained=True)
criterion = nn.CrossEntropyLoss(weight=class_weights)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-3)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=25)

# Post-training Temperature Scaling
scaler = TemperatureScaler(model)
calibrated_temp = scaler.calibrate(val_loader, device=device)
torch.save({"state_dict": model.state_dict(), "temperature": calibrated_temp}, "models/best_model.pth")`
  },
  {
    filename: "build_dataset.py",
    category: "Dataset & Review",
    description: "Wikimedia Commons API harvester with User-Agent etiquette, perceptual hashing (phash) deduplication, and group-aware splitting.",
    path: "build_dataset.py",
    language: "python",
    codeSnippet: `import requests, imagehash
from PIL import Image

# Query Wikimedia Commons category
params = {
    "action": "query",
    "generator": "categorymembers",
    "gcmtitle": f"Category:{category_name}",
    "prop": "imageinfo",
    "iiprop": "url|size|extmetadata",
    "format": "json"
}

# Perceptual Hashing deduplication (Hamming distance <= 6)
img_hash = imagehash.phash(img)
if (img_hash - existing_hash) <= 6:
    # Reject duplicate / near duplicate
    pass`
  },
  {
    filename: "predict.py",
    category: "Python Model",
    description: "Inference engine with calibrated probabilities (temperature scaling), Shannon entropy OOD detection, and architectural feature attribution.",
    path: "predict.py",
    language: "python",
    codeSnippet: `def predict_image(self, pil_image, ood_threshold=0.42):
    tensor = self.transform(pil_image.convert("RGB")).unsqueeze(0).to(self.device)
    with torch.no_grad():
        raw_logits = self.model(tensor)
        calibrated_logits = raw_logits / self.temperature
        probs = F.softmax(calibrated_logits, dim=1).squeeze(0).cpu().numpy()
        
    entropy = -sum(p * math.log(max(p, 1e-12)) for p in probs)
    top_conf = max(probs)
    is_ood = (top_conf < ood_threshold) or (entropy > 1.32)
    return {"predicted_class": CLASSES[np.argmax(probs)], "confidence": top_conf, "is_ood": is_ood}`
  },
  {
    filename: "explain.py",
    category: "Python Model",
    description: "Grad-CAM implementation extracting gradients and feature maps from the backbone convolutional head to overlay saliency heatmaps.",
    path: "explain.py",
    language: "python",
    codeSnippet: `class GradCAM:
    def __init__(self, model, target_layer=None):
        self.model = model
        self.target_layer = target_layer or self._find_conv_layer()
        self._register_hooks()
        
    def generate_heatmap(self, input_tensor, class_idx=None):
        score = self.model(input_tensor)[:, class_idx]
        score.backward()
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
        cam = F.relu(torch.sum(weights * self.activations, dim=1)).squeeze(0)
        return cam.cpu().numpy()`
  },
  {
    filename: "evaluate.py",
    category: "Python Model",
    description: "Test set evaluation script computing ECE, confusion matrix, precision, recall, and identifying hardest/easiest architectural eras.",
    path: "evaluate.py",
    language: "python",
    codeSnippet: `def evaluate_model(model_path, metadata_csv, split_name="test"):
    # Group-isolated test set
    ece = compute_ece(all_probs, all_targets)
    cm = confusion_matrix(all_targets, all_preds)
    report = classification_report(all_targets, all_preds, target_names=CLASSES)
    print(f"Test Accuracy: {acc*100:.2f}% | ECE: {ece:.4f}")`
  },
  {
    filename: "COLAB_TRAINING.md",
    category: "Documentation",
    description: "Complete Google Colab GPU guide with step-by-step shell commands, dataset fetching, training, metric plotting, and weights export.",
    path: "COLAB_TRAINING.md",
    language: "markdown",
    codeSnippet: `# 1. Enable T4 GPU in Colab Runtime
!nvidia-smi

# 2. Clone & Install
!git clone https://github.com/your-username/pakistan-architecture-ai.git
%cd pakistan-architecture-ai
!pip install -q -r requirements.txt

# 3. Harvest Wikimedia & Split Group-Aware
!python build_dataset.py --target-per-class 200 --all

# 4. Train with Transfer Learning
!python train.py --epochs 25 --backbone efficientnet_b2

# 5. Download Best Model
from google.colab import files
files.download("models/best_model.pth")`
  },
  {
    filename: "PROJECT_WRITEUP.md",
    category: "Documentation",
    description: "Rigorous student research write-up and personal reflection on categorizing change over time, architectural history, and dataset bias.",
    path: "PROJECT_WRITEUP.md",
    language: "markdown",
    codeSnippet: `# Research Question
"To what extent can a computer-vision model distinguish major historical periods of Pakistani architecture from visual features alone?"

# Key Reflections
- Architecture as crystallized sociopolitical ideology.
- The necessity of group-aware monument splitting to prevent memorization.
- The Indo-Saracenic dilemma: hybridity is not misclassification.
- Geographic centralization bias towards Lahore.`
  }
];
