"use client";
import { useState, useEffect, useRef, use } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Camera, Video, RotateCcw, Upload, X, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CapturePage({ params }) {
  const { token } = use(params);
  const [wedding, setWedding] = useState(null);
  const [step, setStep] = useState("camera"); // camera, preview, uploading, done
  const [mode, setMode] = useState("photo"); // photo, video
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    api.get(`/weddings/public/${token}`).then((res) => setWedding(res.data)).catch(() => {});
    startCamera();
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: mode === "video",
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions to capture memories.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/jpeg", 0.9);
    setCaptured({ type: "photo", data: url });
    setStep("preview");
  };

  const startVideo = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setCaptured({ type: "video", data: URL.createObjectURL(blob), blob });
      setStep("preview");
    };
    recorderRef.current = recorder;
    recorder.start();
  };

  const stopVideo = () => { recorderRef.current?.stop(); };

  const upload = async () => {
    if (!captured) return;
    setUploading(true);
    setProgress(0);
    setStep("uploading");

    try {
      const fd = new FormData();
      if (captured.type === "photo") {
        const res = await fetch(captured.data);
        const blob = await res.blob();
        fd.append("file", blob, `memory-${Date.now()}.jpg`);
      } else {
        fd.append("file", captured.blob, `memory-${Date.now()}.webm`);
      }

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });

      await new Promise((resolve, reject) => {
        xhr.onload = () => { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error("Upload failed")); };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", `${typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:5000/api` : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/guest/${token}/capture`);
        xhr.setRequestHeader("X-Guest-Token", `guest_${token}`);
        xhr.send(fd);
      });

      setStep("done");
    } catch (err) {
      setError("Upload failed. Your memory is saved locally. Please try again.");
      setStep("preview");
    } finally {
      setUploading(false);
    }
  };

  const retake = () => {
    setCaptured(null);
    setStep("camera");
    startCamera();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
        <div className="text-center text-white animate-fade-in">
          <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h1 className="font-display text-2xl mb-3">Camera Unavailable</h1>
          <p className="text-white/60 mb-6 max-w-sm">{error}</p>
          <Link href={`/w/${token}`} className="inline-flex items-center gap-2 h-10 px-6 border border-white/20 rounded-lg text-sm hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal relative overflow-hidden">
      {/* Camera / Preview */}
      {step === "camera" && (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/40 to-transparent">
            <Link href={`/w/${token}`} className="h-10 w-10 flex items-center justify-center rounded-full bg-black/30 text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-white font-display text-lg font-medium">
              {wedding?.coupleName || "Capture"}
            </h2>
            <div className="w-10" />
          </div>

          {/* Mode switch */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={() => setMode("photo")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === "photo" ? "bg-white text-charcoal" : "bg-white/20 text-white"}`}
            >
              Photo
            </button>
            <button
              onClick={() => setMode("video")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === "video" ? "bg-white text-charcoal" : "bg-white/20 text-white"}`}
            >
              Video
            </button>
          </div>

          {/* Capture button */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 pt-16 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
            <div className="text-white text-center mb-4">
              <p className="text-xs text-white/60 mb-3">CAPTURE THE MOMENT</p>
              {mode === "photo" ? (
                <button onClick={capturePhoto} className="h-18 w-18 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform">
                  <div className="h-14 w-14 rounded-full bg-white" />
                </button>
              ) : (
                <button
                  onMouseDown={startVideo}
                  onMouseUp={stopVideo}
                  onTouchStart={startVideo}
                  onTouchEnd={stopVideo}
                  className="h-18 w-18 rounded-full border-4 border-red-500 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <div className="h-14 w-14 rounded-full bg-red-500" />
                </button>
              )}
              <p className="text-xs text-white/40 mt-3">{mode === "video" ? "Hold to record" : "Tap to capture"}</p>
            </div>
          </div>
        </>
      )}

      {/* Preview */}
      {step === "preview" && captured && (
        <div className="min-h-screen flex flex-col">
          {captured.type === "photo" ? (
            <img src={captured.data} className="flex-1 object-contain bg-black" alt="Captured" />
          ) : (
            <video src={captured.data} controls className="flex-1 object-contain bg-black" />
          )}
          <div className="bg-white p-6 flex gap-4">
            <Button variant="outline" onClick={retake} className="flex-1" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" /> Retake
            </Button>
            <Button onClick={upload} className="flex-1" size="lg">
              <Upload className="h-4 w-4 mr-2" /> Keep This Memory
            </Button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {step === "uploading" && (
        <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
          <div className="text-center text-white animate-fade-in">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-gold" />
            <h2 className="font-display text-2xl mb-2">Uploading your memory</h2>
            <div className="w-48 h-1.5 bg-white/20 rounded-full mx-auto mt-4 overflow-hidden">
              <div className="h-full bg-muted-gold rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-white/40 text-sm mt-3">{progress}%</p>
          </div>
        </div>
      )}

      {/* Done */}
      {step === "done" && (
        <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
          <div className="text-center animate-scale-in">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-display text-3xl text-deep-brown mb-2">Memory captured!</h1>
            <p className="text-warm-gray mb-8 font-display text-lg italic">Your moment has been preserved.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={retake}>Capture Another</Button>
              <Link href={`/w/${token}`}>
                <Button>Done</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
