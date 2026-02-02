import React, { useRef, useState } from 'react';

interface MobileCameraProps {
  onPhoto: (img: string) => void;
}

export const MobileCamera: React.FC<MobileCameraProps> = ({ onPhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(ms);
      if (videoRef.current) videoRef.current.srcObject = ms;
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const r = new FileReader();
      r.onload = () => onPhoto(r.result as string);
      r.readAsDataURL(f);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4 text-white">SmartQuoteAI Intake</h2>
      
      <div className="w-full max-w-md mx-auto bg-black rounded-md overflow-hidden mb-6 relative">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-64 bg-gray-800" />
        <canvas ref={canvasRef} className="hidden" />
        {stream && (
           <button 
             onClick={capturePhoto}
             className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg"
             title="Capture Photo"
           >
             <div className="w-6 h-6 border-4 border-white rounded-full"></div>
           </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {!stream ? (
          <button 
            onClick={startCamera} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-md font-bold transition-colors"
          >
            USE LIVE CAMERA
          </button>
        ) : (
          <button 
            onClick={() => {
              stream.getTracks().forEach(track => track.stop());
              setStream(null);
            }} 
            className="bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-md font-bold transition-colors"
          >
            CLOSE CAMERA
          </button>
        )}

        <div className="py-2 text-gray-500">- OR -</div>
        
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFile} 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-md font-bold transition-colors border border-gray-700"
        >
          UPLOAD IMAGE FILE
        </button>
      </div>
    </div>
  );
};