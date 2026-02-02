import React, { useRef, useState } from 'react';

interface MobileCameraProps {
  onPhoto: (img: string) => void;
}

export const MobileCamera: React.FC<MobileCameraProps> = ({ onPhoto }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imgData = canvasRef.current.toDataURL('image/png');
        onPhoto(imgData);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Field Capture (SmartQuoteAI)</h2>
      <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-md bg-black" />
      <canvas ref={canvasRef} className="hidden" />
      
      {!stream ? (
        <button 
          onClick={startCamera} 
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-md font-bold"
        >
          OPEN CAMERA
        </button>
      ) : (
        <button 
          onClick={capturePhoto} 
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-md font-bold"
        >
          CAPTURE PHOTO
        </button>
      )}
    </div>
  );
};