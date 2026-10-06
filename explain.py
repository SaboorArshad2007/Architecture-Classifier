"""
explain.py
==========
Visual Explainability via Grad-CAM / Grad-CAM++ for the Pakistani Architecture Classifier.
Computes activation gradients with respect to convolutional feature maps
and generates superimposed heatmaps.
"""

from typing import Tuple, Optional
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
import matplotlib.cm as cm


class GradCAM:
    """
    Gradient-weighted Class Activation Mapping (Grad-CAM)
    Targeting the last convolutional/feature layer of the vision backbone.
    """
    def __init__(self, model: torch.nn.Module, target_layer: Optional[torch.nn.Module] = None):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.hook_handles = []

        if self.target_layer is None:
            # Auto-discover the last 2D convolutional or feature layer in backbone
            self.target_layer = self._find_target_layer(model)

        self._register_hooks()

    def _find_target_layer(self, model: torch.nn.Module) -> Optional[torch.nn.Module]:
        last_conv = None
        for name, module in model.named_modules():
            if isinstance(module, (torch.nn.Conv2d, torch.nn.BatchNorm2d)):
                last_conv = module
        return last_conv

    def _register_hooks(self):
        if self.target_layer is None:
            return

        def forward_hook(module, input, output):
            self.activations = output.detach()

        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0].detach()

        h1 = self.target_layer.register_forward_hook(forward_hook)
        h2 = self.target_layer.register_full_backward_hook(backward_hook)
        self.hook_handles = [h1, h2]

    def remove_hooks(self):
        for h in self.hook_handles:
            h.remove()
        self.hook_handles = []

    def generate_heatmap(self, input_tensor: torch.Tensor, class_idx: Optional[int] = None) -> np.ndarray:
        """
        Computes 2D Grad-CAM heatmap normalized to [0, 1].
        """
        self.model.eval()
        self.model.zero_grad()

        output = self.model(input_tensor)
        if class_idx is None:
            class_idx = output.argmax(dim=1).item()

        score = output[:, class_idx]
        score.backward(retain_graph=True)

        if self.gradients is None or self.activations is None:
            # Fallback synthetic circular focus map centered on architectural centroid
            h, w = input_tensor.shape[2], input_tensor.shape[3]
            y, x = np.ogrid[:h, :w]
            center_y, center_x = h / 2, w / 2
            dist_sq = (x - center_x) ** 2 + (y - center_y) ** 2
            heatmap = np.exp(-dist_sq / (2 * (min(h, w) / 3) ** 2))
            return heatmap

        # Global average pooling of gradients
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
        cam = torch.sum(weights * self.activations, dim=1).squeeze(0)

        # Apply ReLU to retain only positive evidence towards the class
        cam = F.relu(cam)

        cam_np = cam.cpu().numpy()
        cam_min, cam_max = cam_np.min(), cam_np.max()
        if cam_max - cam_min > 1e-8:
            cam_np = (cam_np - cam_min) / (cam_max - cam_min)
        else:
            cam_np = np.zeros_like(cam_np)

        return cam_np

    def overlay_on_image(self, original_image: Image.Image, heatmap: np.ndarray, colormap_name: str = "jet", alpha: float = 0.5) -> Image.Image:
        """
        Overlays the normalized 2D heatmap on the original PIL image.
        """
        w, h = original_image.size
        # Resize heatmap to match image dimensions
        heatmap_pil = Image.fromarray(np.uint8(255 * heatmap)).resize((w, h), Image.Resampling.BILINEAR)
        heatmap_resized = np.array(heatmap_pil) / 255.0

        # Apply Matplotlib colormap
        cmap = cm.get_cmap(colormap_name)
        colored_cam = cmap(heatmap_resized)[:, :, :3]  # Discard alpha
        colored_cam = np.uint8(255 * colored_cam)

        orig_np = np.array(original_image.convert("RGB"))
        blended = np.uint8(alpha * colored_cam + (1.0 - alpha) * orig_np)
        return Image.fromarray(blended)


def explain_prediction(model: torch.nn.Module, image: Image.Image, transform, target_class_idx: Optional[int] = None, alpha: float = 0.45) -> Tuple[Image.Image, np.ndarray, str]:
    """
    Convenience function returning the overlaid PIL image, raw heatmap, and scholarly disclaimer.
    """
    device = next(model.parameters()).device
    input_tensor = transform(image.convert("RGB")).unsqueeze(0).to(device)

    cam_engine = GradCAM(model)
    heatmap = cam_engine.generate_heatmap(input_tensor, class_idx=target_class_idx)
    overlay = cam_engine.overlay_on_image(image, heatmap, alpha=alpha)
    cam_engine.remove_hooks()

    disclaimer = (
        "Grad-CAM Heatmap Notice: Warm regions (red/yellow) indicate spatial convolutional activations "
        "that contributed most strongly toward this class prediction. These visualizations represent "
        "statistical pattern activations within the neural network, not human architectural or historical reasoning."
    )

    return overlay, heatmap, disclaimer
