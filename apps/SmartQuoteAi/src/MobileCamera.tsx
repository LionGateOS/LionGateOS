import React, { useRef, useState } from 'react';

export const MobileCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    setStream(mediaStream);
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
  };

  return (
    <div className="p-4 bg-op-base rounded-lg">
      <h2 className="text-xl font-bold mb-4">Field Capture (SmartQuoteAI)</h2>
      <video ref={videoRef} autoPlay muted playsinline className="w-full rounded-md bgjray-900" />
      <button 
        onClick={startCamera} 
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-md"
      >
        OPEN CAMERA
      </button>
    </div>
  );
};