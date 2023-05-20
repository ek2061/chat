import { XCircleIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";

interface ImageViewerProps {
  src: string;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel: EventListener = (e) => {
      const wheelEvent = e as WheelEvent;
      const zoomFactor = wheelEvent.deltaY < 0 ? 0.1 : -0.1; // zoom ratio
      const newZoomLevel = zoomLevel + zoomFactor;

      // limit zoom range
      if (newZoomLevel >= 0.5 && newZoomLevel <= 2) {
        setZoomLevel(newZoomLevel);
      }
    };

    const containerElement = containerRef.current;

    if (containerElement) {
      containerElement.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [zoomLevel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div className="relative" ref={containerRef}>
        <img
          src={src}
          alt="Preview"
          className="max-h-full max-w-full"
          style={{ transform: `scale(${zoomLevel})` }}
        />
      </div>
      <XCircleIcon
        className="fixed right-1/2 top-2 h-10 w-10 cursor-pointer rounded-full bg-black text-slate-200 opacity-75 hover:text-slate-400"
        onClick={onClose}
      />
    </div>
  );
};

export default ImageViewer;
