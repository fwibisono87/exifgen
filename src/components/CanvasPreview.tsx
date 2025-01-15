import React, { FC, useState, useRef, useEffect } from "react";
import domToImage from "dom-to-image";
import { ExifFormData } from "../types";
import SettingsLine from "./SettingsLine";
import { Icon, InlineIcon } from "@iconify/react/dist/iconify.js";
import ExifItem from "./ExifItem";
import PeopleLine from "./PeopleLine";
import ShootLine from "./ShootLine";

interface Props {
  selectedFile: File | null;
  bgColor: "white" | "black";
  fontColor: "black" | "white";
  exifFormData: ExifFormData;
  exifDisplay: { [K in keyof ExifFormData]: boolean };
  selectedFont: "Arial" | "Courier" | "Quicksand" | "Poppins";
  useInstagramSafeGutters: boolean;
}

const CanvasPreview: FC<Props> = ({
  selectedFile,
  bgColor,
  fontColor,
  exifFormData,
  exifDisplay,
  selectedFont,
  useInstagramSafeGutters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldCapture, setShouldCapture] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const polaroidRef = useRef<HTMLDivElement>(null);

  const handleDebugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDebug(event.target.checked);
  };

  const downloadPolaroid = () => {
    if (!selectedFile) return;
    if (showDebug) {
      // If in debug mode, the polaroid is already rendered inline, so capture it directly.
      captureAndDownload();
    } else {
      // If not in debug mode, briefly show the modal so the content is rendered, then capture.
      setIsModalOpen(true);
      setShouldCapture(true);
    }
  };

  const captureAndDownload = async () => {
    if (!polaroidRef.current) return;
    try {
      const dataUrl = await domToImage.toPng(polaroidRef.current);
      const link = document.createElement("a");
      link.download = "polaroid.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("[ERROR] Unable to download polaroid:", error);
    }
  };

  useEffect(() => {
    // If the modal is open and we want to capture, do it and close immediately on success.
    if (isModalOpen && shouldCapture) {
      (async () => {
        await captureAndDownload();
        setIsModalOpen(false);
        setShouldCapture(false);
      })();
    }
  }, [isModalOpen, shouldCapture]);

  const polaroidContent = (
    <div
      ref={polaroidRef}
      style={{
        backgroundColor: bgColor === "black" ? "#000000" : "#FFFFFF",
        color: fontColor,
        fontFamily: selectedFont,
      }}
      className={`flex flex-col w-[1080px] h-[1920px] ${
        useInstagramSafeGutters ? "py-[250px] justify-center" : "py-16 h-full"
      }`}
    >
      <div
        id="componentContainer"
        className={`flex flex-col items-center ${
          useInstagramSafeGutters ? "py-[250px] justify-center" : "py-16 h-full"
        }`}
      >
        <div className="flex object-contain mx-auto flex-row">
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className={"max-w-full max-h-full object-contain"}
            />
          )}
        </div>
        <div
          className={`flex flex-col mt-8 mb-auto gap-0 ${
            useInstagramSafeGutters ? "mb-8" : ""
          }`}
        >
          {exifDisplay.make &&
            (exifFormData.make && exifFormData.make === "Canon" ? (
              <img
                src="/canon.png"
                alt="Canon"
                className="w-fit aspect-auto h-9 mx-auto mb-4"
              />
            ) : (
              <span className="mx-auto text-4xl font-bold">
                {exifFormData.make}
              </span>
            ))}
          <div className="flex flex-row mx-auto gap-4">
            {exifDisplay.model && (
              <span className="text-2xl">{exifFormData.model}</span>
            )}
            {exifDisplay.model && exifDisplay.lens && (
              <span className="text-2xl">•</span>
            )}
            {exifDisplay.lens && (
              <span className="text-2xl">{exifFormData.lens}</span>
            )}
          </div>
          <SettingsLine exifFormData={exifFormData} exifDisplay={exifDisplay} />
          <PeopleLine exifFormData={exifFormData} exifDisplay={exifDisplay} />
          <ShootLine exifFormData={exifFormData} exifDisplay={exifDisplay} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showDebug}
          onChange={handleDebugChange}
        />
        Debug Mode (Show Polaroid Inline)
      </label>
      <button onClick={downloadPolaroid} disabled={!selectedFile}>
        Download Polaroid
      </button>
      {showDebug && (
        <div
          style={{
            // Visible inline polaroid for debugging
            border: "1px solid #ccc",
            margin: "1rem auto",
          }}
        >
          {polaroidContent}
        </div>
      )}
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 relative"
            style={{ width: "auto", height: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 
              This will only be visible for the brief moment until 
              dom-to-image captures it. Then useEffect closes it.
            */}
            {polaroidContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasPreview;
