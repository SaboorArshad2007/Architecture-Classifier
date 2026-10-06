# Google Colab Training Guide: Pakistani Architecture Classifier

This guide provides step-by-step instructions to train the **Pakistani Architecture Time-Period Classifier** on Google Colab using a free GPU (T4 or A100).

---

## Step 1: Open Google Colab & Enable Free GPU
1. Visit [https://colab.research.google.com](https://colab.research.google.com).
2. Create a new notebook (`File > New notebook`).
3. In the top menu, go to **Runtime > Change runtime type**.
4. Under **Hardware accelerator**, select **T4 GPU** (or A100 if Colab Pro).
5. Click **Save**.

Verify GPU availability in a code cell:
```python
!nvidia-smi
```
*You should see a Tesla T4 (or similar) with ~15GB VRAM.*

---

## Step 2: Upload or Clone the Project
Upload the project folder or clone your repository:
```bash
!git clone https://github.com/your-username/pakistan-architecture-ai.git
%cd pakistan-architecture-ai
```
Or, if uploading as a `.zip` file from your computer:
```python
from google.colab import files
uploaded = files.upload()  # Select your zip archive
!unzip -q pakistan_architecture_ai.zip
%cd pakistan_architecture_ai
```

---

## Step 3: Install Required Dependencies
Install the pinned computer-vision dependencies:
```bash
!pip install -q --upgrade pip
!pip install -q -r requirements.txt
```

Verify PyTorch and CUDA bindings:
```python
import torch
print(f"PyTorch Version: {torch.__version__}")
print(f"CUDA Available:  {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"Device Name:     {torch.cuda.get_device_name(0)}")
```

---

## Step 4: Build, Clean, and Split the Dataset
The dataset pipeline harvests licensed images from Wikimedia Commons, executes perceptual hash (`phash`) deduplication, and enforces **group-aware isolation** so that no building is split between train, validation, and test.

Run the pipeline:
```bash
# Harvests ~150-200 images per class, deduplicates, and splits by site
!python build_dataset.py --target-per-class 200 --all
```

Check the dataset summary:
```bash
!cat outputs/dataset_report.json
```

---

## Step 5: Audit Dataset Metadata (Optional Review)
Inspect the distribution across monuments and classes:
```bash
!python review_data.py --summary
```

If you notice any mislabeled file during exploratory checks, reclassify or exclude it:
```bash
!python review_data.py --relabel "sample_image.jpg" "Mughal" --building "Badshahi Mosque, Lahore"
```

---

## Step 6: Train Model with Transfer Learning
Run the training pipeline. This fine-tunes a pretrained **EfficientNet-B2** backbone using AdamW optimizer, cosine annealing schedule, class-balanced cross-entropy loss, and temperature scaling:

```bash
!python train.py --epochs 25 --batch-size 16 --lr 0.0003 --backbone efficientnet_b2 --patience 6
```

During training, Colab will print:
```
Epoch  | Train Loss | Val Loss   | Train Acc  | Val Acc    | LR        
--------------------------------------------------------------------
1      | 1.3412     | 1.1024     | 41.25%     | 58.40%     | 3.00e-04  
2      | 0.9854     | 0.7812     | 62.50%     | 72.10%     | 2.94e-04  
...
```

The script automatically preserves `models/best_model.pth` and optimizes the temperature parameter `T` on the validation set for calibrated confidence.

---

## Step 7: Evaluate on Untouched Test Set
Evaluate generalization across unseen monuments in the test split:
```bash
!python evaluate.py --model models/best_model.pth --split test
```

Display the generated confusion matrix and classification report:
```python
from IPython.display import Image, display
display(Image("outputs/confusion_matrix.png"))
display(Image("outputs/training_curves.png"))

with open("outputs/classification_report.txt") as f:
    print(f.read())
```

---

## Step 8: Download Trained Weights to Your Machine
Download the calibrated weights to use locally in your Streamlit application:
```python
from google.colab import files
files.download("models/best_model.pth")
files.download("models/calibration/temperature.json")
files.download("outputs/confusion_matrix.png")
files.download("outputs/classification_report.txt")
```

---

## Step 9: Launch Streamlit Locally
On your local machine, place the downloaded `best_model.pth` inside the `models/` directory:
```bash
cd pakistan_architecture_ai
pip install -r requirements.txt
streamlit run app.py
```
Open `http://localhost:8501` to test the dark, interactive classifier interface with Grad-CAM and uncertainty calibration!
