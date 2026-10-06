"""
predict.py
==========
Inference, uncertainty calibration, out-of-distribution detection,
and architectural feature attribution analysis for Pakistani Architecture.
"""

import os
import math
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

CLASSES = ["Mughal", "Sikh", "British Colonial", "Modern / Post-1947"]

# Architectural feature knowledge base grounded in South Asian architectural history
ARCHITECTURAL_FEATURE_KNOWLEDGE = {
    "Mughal": {
        "period_name": "Mughal Era (c. 1526 – 1857)",
        "summary": "Characterized by symmetrical charbagh layouts, bulbous double-domes, red sandstone with white marble inlay, refined cusped arches, and extensive pietra dura or kashi-kari (glazed tile) ornamentation.",
        "diagnostic_features": [
            {"feature": "Bulbous Double Domes", "detail": "High-drum onion or bulbous domes often faced in white marble (e.g., Badshahi Mosque, Jahangir's Tomb)."},
            {"feature": "Cusped & Multi-Foil Arches", "detail": "Grand peshtaq gateways framing multi-cusped central arches flanked by smaller alcoves."},
            {"feature": "Red Sandstone & White Marble", "detail": "Predominant materials with exquisite marble inlay or contrasting sandstone revetment."},
            {"feature": "Kashi-Kari & Fresco Work", "detail": "Vibrant floral Persian tile mosaics as seen on Wazir Khan Mosque and Chauburji."},
            {"feature": "Façade Symmetry & Minarets", "detail": "Strict axial balance with octagonal corner minarets crowned by domed chattris."}
        ],
        "key_examples": ["Badshahi Mosque", "Lahore Fort", "Wazir Khan Mosque", "Shalimar Gardens", "Hiran Minar", "Shah Jahan Mosque (Thatta)"]
    },
    "Sikh": {
        "period_name": "Sikh Empire & Regional Period (c. 1799 – 1849)",
        "summary": "Blends Mughal architectural elements with distinctive Punjabi vernacular forms, featuring ribbed fluted domes, gold and brass leafing, decorative jharokhas (overhanging balconies), bangla roofs, and multi-foil floral arches.",
        "diagnostic_features": [
            {"feature": "Fluted & Gilded Domes", "detail": "Ribbed, lotus-bud domes frequently gilded or coated in lime stucco with kalasa finials (e.g., Samadhi of Ranjit Singh)."},
            {"feature": "Ornate Jharokhas & Balconies", "detail": "Projecting bay windows supported by carved brackets, often painted with floral and historic frescos."},
            {"feature": "Curved Bangla Eaves", "detail": "Vaulted Bengali-style curved cornices and chhajja projections crowning pavilions and windows."},
            {"feature": "Intricate Stucco & Gach Work", "detail": "Elaborate glass and mirror work (shisha-gari) combined with embossed metal doors and fresco narratives."},
            {"feature": "Defensive & Civic Havelis", "detail": "Multi-story brick masonry havelis with wood carvings in historic quarters (e.g., Haveli Nau Nihal Singh)."}
        ],
        "key_examples": ["Samadhi of Maharaja Ranjit Singh", "Gurdwara Dera Sahib", "Gurdwara Janam Asthan (Nankana Sahib)", "Gurdwara Panja Sahib", "Haveli of Nau Nihal Singh"]
    },
    "British Colonial": {
        "period_name": "British Colonial & Indo-Saracenic (c. 1858 – 1947)",
        "summary": "A hybrid imperial style synthesizing European Victorian, Gothic Revival, and Neoclassical frameworks with indigenous Mughal, Rajasthani, and Sultanate motifs—frequently utilizing exposed red burnt brick, clock towers, and lancet openings.",
        "diagnostic_features": [
            {"feature": "Indo-Saracenic Hybridization", "detail": "Integration of European planimetry and steel roof trusses with Islamic domes, chattris, and jaalis (e.g., Lahore Museum)."},
            {"feature": "Exposed Red Brick Masonry", "detail": "Finely pointed kiln-fired red brickwork with lime mortar banding, defining Mall Road institutional architecture."},
            {"feature": "Prominent Civic Clock Towers", "detail": "Tall central clocktowers serving as public landmarks (e.g., General Post Office Lahore, Empress Market Karachi)."},
            {"feature": "Gothic Lancets & Turrets", "detail": "Pointed arches, crenellated parapets, and fortress-like stone and brick bastions (e.g., Lahore Railway Station)."},
            {"feature": "Deep Colonnades & Verandahs", "detail": "Adaptation to the South Asian climate via wide shaded verandahs, high ceilings, and louvered shutters."}
        ],
        "key_examples": ["Lahore Museum", "General Post Office (GPO) Lahore", "Lahore Railway Station", "Frere Hall (Karachi)", "Empress Market", "Government College University"]
    },
    "Modern / Post-1947": {
        "period_name": "Modern & Post-Independence Era (1947 – Present)",
        "summary": "Embodies the post-independence identity through reinforced concrete brutalism, geometric purity, abstract adaptations of Islamic forms (such as Bedouin-tent geometry), hyperbolic paraboloids, and contemporary curtain-wall glass architecture.",
        "diagnostic_features": [
            {"feature": "Reinforced Concrete Monumentality", "detail": "Prestressed and cast-in-place concrete structures expressing monumental scale without traditional ornamentation."},
            {"feature": "Abstracted Geometric Symbolism", "detail": "Eight-sided Bedouin tent forms, soaring triangular minarets, and blooming petal geometries (e.g., Faisal Mosque, Pakistan Monument)."},
            {"feature": "Brutalist Exposed Brick & Polygons", "detail": "Cantilevered brick cubes and acoustic concrete shells without ornamental moldings (e.g., Alhamra Arts Council by Nayyar Ali Dada)."},
            {"feature": "Clean White Marble Monoliths", "detail": "Pure white Rajasthani/Sindhi marble cubic pavilions and minimalist mausoleum geometry (e.g., Mazar-e-Quaid by Yahya Merchant)."},
            {"feature": "Modernist High-Rises & Curtain Walls", "detail": "Steel, aluminum, and glazed curtain wall facades in contemporary financial centres."}
        ],
        "key_examples": ["Faisal Mosque (Islamabad)", "Minar-e-Pakistan", "Pakistan Monument", "Mazar-e-Quaid (Karachi)", "Alhamra Arts Council", "Habib Bank Plaza"]
    }
}


class ModelArchitecture(nn.Module):
    """
    Standard classifier model supporting EfficientNet or ConvNeXt backbone
    with dropout, batch normalization, and classification head.
    """
    def __init__(self, num_classes: int = 4, backbone_name: str = "efficientnet_b2", pretrained: bool = False):
        super().__init__()
        self.backbone_name = backbone_name
        self.num_classes = num_classes

        # Attempt timm backbone, fallback to torchvision
        self.backbone = None
        feature_dim = 1408  # Default for efficientnet_b2

        try:
            import timm
            self.backbone = timm.create_model(backbone_name, pretrained=pretrained, num_classes=0)
            feature_dim = self.backbone.num_features
        except Exception:
            # Fallback to torchvision efficientnet_b0/b2 or simple CNN
            try:
                from torchvision.models import efficientnet_b2, EfficientNet_B2_Weights
                weights = EfficientNet_B2_Weights.DEFAULT if pretrained else None
                base = efficientnet_b2(weights=weights)
                feature_dim = base.classifier[1].in_features
                base.classifier = nn.Identity()
                self.backbone = base
            except Exception:
                # Lightweight convolutional fallback if torch network unavailable
                self.backbone = nn.Sequential(
                    nn.Conv2d(3, 32, 3, padding=1),
                    nn.ReLU(),
                    nn.AdaptiveAvgPool2d((1, 1)),
                    nn.Flatten()
                )
                feature_dim = 32

        self.classifier = nn.Sequential(
            nn.Dropout(p=0.35),
            nn.Linear(feature_dim, 256),
            nn.BatchNorm1d(256),
            nn.SiLU(),
            nn.Dropout(p=0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        features = self.backbone(x)
        if isinstance(features, tuple):
            features = features[0]
        if features.dim() > 2:
            features = F.adaptive_avg_pool2d(features, (1, 1)).flatten(1)
        logits = self.classifier(features)
        return logits


class ArchitectureClassifier:
    """
    Production inference engine with temperature scaling calibration,
    out-of-distribution (OOD) detection, and architectural reasoning.
    """
    def __init__(self, model_path: Optional[str] = "models/best_model.pth", temperature: float = 1.25):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.temperature = temperature
        self.classes = CLASSES
        self.is_trained = False
        self.model = ModelArchitecture(num_classes=len(self.classes), pretrained=False)

        # Standard ImageNet normalization for PyTorch vision models
        self.transform = transforms.Compose([
            transforms.Resize((260, 260)),
            transforms.CenterCrop((240, 240)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        # Load weights if available
        if model_path and os.path.exists(model_path):
            try:
                checkpoint = torch.load(model_path, map_location=self.device)
                if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
                    self.model.load_state_dict(checkpoint["state_dict"])
                    self.temperature = checkpoint.get("temperature", self.temperature)
                else:
                    self.model.load_state_dict(checkpoint)
                self.is_trained = True
                print(f"[INFO] Successfully loaded trained weights from {model_path}")
            except Exception as e:
                print(f"[WARN] Failed to load checkpoint ({e}). Using initialized backbone.")
        else:
            print(f"[NOTICE] Checkpoint {model_path} not found. Running in DEMO / UNTRAINED mode.")

        self.model.to(self.device)
        self.model.eval()

    def calculate_entropy(self, probabilities: List[float]) -> float:
        """Calculates Shannon entropy in nats to measure prediction dispersion."""
        return -sum(p * math.log(max(p, 1e-12)) for p in probabilities)

    def predict_image(self, pil_image: Image.Image, ood_confidence_threshold: float = 0.42, ood_entropy_threshold: float = 1.32) -> Dict[str, Any]:
        """
        Runs full inference with:
        - Logit temperature scaling (calibration)
        - Softmax probability distribution
        - Out-of-Distribution (OOD) / Low confidence detection
        - Architectural characteristics attribution
        """
        # Validate and convert image
        try:
            image_rgb = pil_image.convert("RGB")
        except Exception as e:
            return {"error": f"Invalid or unreadable image file: {e}"}

        input_tensor = self.transform(image_rgb).unsqueeze(0).to(self.device)

        with torch.no_grad():
            raw_logits = self.model(input_tensor)
            # Apply Temperature Scaling for calibrated probabilities
            calibrated_logits = raw_logits / max(self.temperature, 0.01)
            probs_tensor = F.softmax(calibrated_logits, dim=1).squeeze(0)
            probabilities = probs_tensor.cpu().numpy().tolist()

        # Class breakdown
        class_probs = {cls_name: float(probabilities[i]) for i, cls_name in enumerate(self.classes)}
        sorted_predictions = sorted(class_probs.items(), key=lambda x: x[1], reverse=True)

        top_class, top_conf = sorted_predictions[0]
        second_class, second_conf = sorted_predictions[1]
        entropy = self.calculate_entropy(probabilities)

        # Out-Of-Distribution (OOD) / Ambiguity Check
        is_ood = False
        ood_reason = None
        if top_conf < ood_confidence_threshold:
            is_ood = True
            ood_reason = (
                f"Low maximum confidence ({top_conf*100:.1f}% < {ood_confidence_threshold*100:.0f}%). "
                "The visual evidence does not strongly distinguish between the four historical categories."
            )
        elif entropy > ood_entropy_threshold:
            is_ood = True
            ood_reason = (
                f"High prediction entropy ({entropy:.2f} nats). The visual composition contains mixed, "
                "hybrid architectural motifs or non-architectural background elements."
            )

        # Retrieve architectural feature analysis
        feature_data = ARCHITECTURAL_FEATURE_KNOWLEDGE.get(top_class, {})
        runner_up_data = ARCHITECTURAL_FEATURE_KNOWLEDGE.get(second_class, {}) if second_conf > 0.20 else None

        return {
            "predicted_class": top_class,
            "confidence": top_conf,
            "calibrated_probabilities": class_probs,
            "ranked_predictions": sorted_predictions,
            "prediction_entropy": entropy,
            "is_out_of_distribution": is_ood,
            "ood_warning": ood_reason,
            "is_trained_model": self.is_trained,
            "temperature_used": self.temperature,
            "architectural_analysis": {
                "period_name": feature_data.get("period_name"),
                "summary": feature_data.get("summary"),
                "diagnostic_features": feature_data.get("diagnostic_features", []),
                "key_examples": feature_data.get("key_examples", []),
                "competing_hybrid_period": runner_up_data.get("period_name") if runner_up_data else None,
                "competing_probability": second_conf if runner_up_data else None,
                "disclaimer": "Visual characteristics consistent with this prediction are based on architectural historical canons. Neural activation heatmaps should be interpreted as localized visual saliency rather than human architectural reasoning."
            }
        }
