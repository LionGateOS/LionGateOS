import React, { useState } from "react";
import { MobileCamera } from "./MobileCamera";
import { ReviewScreen } from "./ReviewScreen";
import { processPhotoEstimate } from "./visionProcessor";

export default function App() {
  const [mode, setMode] = useState("capture");
  const [estimates, setEstimates] = useState(null);

  const handlePhoto = async (img) => {
    const res = await processPhotoEstimate(img, "CONSTRUCTION");
    setEstimates(res);
    setMode("review");
  };

  return (
    <main className="bg-black min-h-screen text-white">
      {mode === "capture" && <MobileCamera onPhoto={handlePhoto} />}
      {mode === "review" && <ReviewScreen estimates={estimates} onConfirm={() => setMode("capture")} />}
    </main>
  );
}