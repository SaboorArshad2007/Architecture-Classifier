import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  X,
  RefreshCw,
  AlertCircle,
  SwitchCamera,
  Sliders,
  Sun,
  Eye,
  Zap,
  Sparkles,
  Contrast
} from "lucide-react";

export type ImageFilterType = "normal" | "grayscale" | "sharpen" | "high-contrast" | "brighten";

interface FilterOption {
  id: ImageFilterType;
  label: string;
  description: string;
  icon: React.ReactNode;
  cssFilter: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: "normal",
    label: "Normal",
    description: "Standard full-color camera capture",
    icon: <Eye className="w-3.5 h-3.5" />,
    cssFilter: "none"
  },
  {
    id: "grayscale",
    label: "Grayscale",
    description: "Isolates geometry, arch contours, and silhouette lines",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    cssFilter: "grayscale(100%) contrast(115%)"
  },
  {
    id: "sharpen",
    label: "Sharpen",
    description: "Enhances brickwork joints, jali lattices, and relief edges",
    icon: <Zap className="w-3.5 h-3.5" />,
    cssFilter: "contrast(130%) saturate(110%) brightness(102%)"
  },
  {
    id: "high-contrast",
    label: "High Contrast",
    description: "Deepens shadow depth and accentuates stone carvings",
    icon: <Contrast className="w-3.5 h-3.5" />,
    cssFilter: "contrast(170%) brightness(105%)"
  },
  {
    id: "brighten",
    label: "Clarity",
    description: "Brightens shadowed facades, vaulted ceilings, and evening photos",
    icon: <Sun className="w-3.5 h-3.5" />,
    cssFilter: "brightness(130%) contrast(115%)"
  }
];

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<ImageFilterType>("normal");

  // Check if multiple camera devices exist
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoInputs.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Start or switch camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    setIsStartingCamera(true);
    setCameraError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera access (MediaDevices API) is not supported in this browser environment.");
      setIsStartingCamera(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsStartingCamera(false);
    } catch (err: any) {
      console.warn("Camera init error:", err);
      // Fallback
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(() => {});
        }
        setIsStartingCamera(false);
      } catch (fallbackErr: any) {
        setIsStartingCamera(false);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError("Camera permission was denied. Please allow camera permissions in your browser address bar.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setCameraError("No camera hardware device found on this system.");
        } else {
          setCameraError(`Unable to start camera: ${err.message || "Unknown hardware error"}`);
        }
      }
    }
  };

  // Helper to apply sharpening convolution kernel on pixel data
  const applySharpenConvolution = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const src = imgData.data;
      const output = ctx.createImageData(width, height);
      const dst = output.data;

      // 3x3 sharpen kernel:
      //  0, -1,  0
      // -1,  5, -1
      //  0, -1,  0
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          const up = ((y - 1) * width + x) * 4;
          const down = ((y + 1) * width + x) * 4;
          const left = (y * width + (x - 1)) * 4;
          const right = (y * width + (x + 1)) * 4;

          for (let c = 0; c < 3; c++) {
            const val = 5 * src[idx + c] - src[up + c] - src[down + c] - src[left + c] - src[right + c];
            dst[idx + c] = Math.min(255, Math.max(0, val));
          }
          dst[idx + 3] = src[idx + 3]; // Alpha
        }
      }

      ctx.putImageData(output, 0, 0);
    } catch {
      // Fallback if cross-origin or canvas security issue
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Trigger visual shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    ctx.save();

    // If front camera, flip horizontally for natural look
    if (facingMode === "user") {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    // Apply the active CSS filter to canvas context if supported
    const currentOpt = FILTER_OPTIONS.find((f) => f.id === activeFilter);
    if (currentOpt && currentOpt.id !== "normal") {
      // Set canvas filter
      if ("filter" in ctx) {
        (ctx as any).filter = currentOpt.cssFilter;
      }
    }

    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    // Apply pixel-level kernel for sharpen if selected
    if (activeFilter === "sharpen") {
      applySharpenConvolution(ctx, w, h);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.94);

    stopCamera();
    onCapture(dataUrl);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const selectedFilterObj = FILTER_OPTIONS.find((f) => f.id === activeFilter) || FILTER_OPTIONS[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Camera Live Viewfinder</h3>
              <p className="text-[11px] text-slate-400">Point at architecture, archway, dome, or facade</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasMultipleCameras && (
              <button
                onClick={toggleFacingMode}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Switch Camera (Front/Rear)"
              >
                <SwitchCamera className="w-4 h-4 text-emerald-400" />
              </button>
            )}
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Video Area with Live Filter Preview */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ filter: selectedFilterObj.cssFilter }}
            className={`w-full h-full object-cover transition-[filter] duration-200 ${
              facingMode === "user" ? "scale-x-[-1]" : ""
            }`}
          />

          {/* Shutter flash overlay */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 z-20" />
          )}

          {/* Architectural Framing Reticle Overlay */}
          <div className="absolute inset-6 pointer-events-none border border-emerald-400/35 rounded-2xl flex flex-col justify-between p-3.5 z-10">
            <div className="flex justify-between items-center text-[10px] text-emerald-400/80 font-mono tracking-wider">
              <span>[ARCHITECTURAL FRAME]</span>
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-emerald-500/30">
                FILTER: {selectedFilterObj.label.toUpperCase()}
              </span>
            </div>

            {/* Center target crosshair */}
            <div className="self-center flex items-center justify-center w-12 h-12 border border-dashed border-emerald-400/50 rounded-full bg-black/20 backdrop-blur-[1px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-300 font-mono bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span>{facingMode === "environment" ? "Rear Lens" : "Front Lens"}</span>
              <span>HD Live Stream</span>
            </div>
          </div>

          {/* Loading Indicator */}
          {isStartingCamera && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-xs text-slate-300 font-medium">Initializing camera stream...</span>
            </div>
          )}

          {/* Error Message */}
          {cameraError && (
            <div className="absolute inset-6 bg-slate-900/95 border border-red-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 z-30">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-200">Camera Access Error</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">{cameraError}</p>
              </div>
              <button
                onClick={startCamera}
                className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Retry Camera
              </button>
            </div>
          )}
        </div>

        {/* Filter Selection Bar */}
        <div className="px-5 py-2.5 bg-slate-950/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-300">Image Filter:</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              ({selectedFilterObj.description})
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {FILTER_OPTIONS.map((filter) => {
              const isSelected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  title={filter.description}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Shutter Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Align building facade or ornament within guide frame
          </div>

          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <button
              onClick={handleCapture}
              disabled={isStartingCamera || !!cameraError}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse" />
              Capture & Classify
            </button>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Hidden Canvas for Native Resolution Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
