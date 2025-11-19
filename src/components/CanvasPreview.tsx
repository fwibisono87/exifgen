import React, { FC, useState, useRef, useEffect } from "react";
import domToImage from "dom-to-image";
import { ExifFormData } from "../types";
import SettingsLine from "./SettingsLine";
import PeopleLine from "./PeopleLine";
import ShootLine from "./ShootLine";
import cannonLogo from "/canon.png";

interface Props {
  selectedFile: File | null;
  bgColor: "white" | "black";
  fontColor: "black" | "white";
  exifFormData: ExifFormData;
  exifDisplay: { [K in keyof ExifFormData]: boolean };
  selectedFont: "Arial" | "Courier" | "Quicksand" | "Poppins" | "Montserrat";
  useInstagramSafeGutters: boolean;
  imageOrientation: number;
}

const CanvasPreview: FC<Props> = ({
  selectedFile,
  bgColor,
  fontColor,
  exifFormData,
  exifDisplay,
  selectedFont,
  useInstagramSafeGutters,
  imageOrientation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldCapture, setShouldCapture] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);

  // Clean up object URL when file changes or component unmounts
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl(null);
    }
  }, [selectedFile]);

  const handleDebugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDebug(event.target.checked);
  };

  // Get CSS transform for EXIF orientation
  const getOrientationTransform = (orientation: number): string => {
    switch (orientation) {
      case 2:
        return "scaleX(-1)"; // Flip horizontal
      case 3:
        return "rotate(180deg)"; // Rotate 180°
      case 4:
        return "scaleY(-1)"; // Flip vertical
      case 5:
        return "rotate(90deg) scaleX(-1)"; // Rotate 90° CW and flip
      case 6:
        return "rotate(90deg)"; // Rotate 90° CW
      case 7:
        return "rotate(270deg) scaleX(-1)"; // Rotate 90° CCW and flip
      case 8:
        return "rotate(270deg)"; // Rotate 90° CCW
      default:
        return "none"; // Normal orientation
    }
  };

  // Wait for all resources to load before capturing
  const waitForResources = async (): Promise<void> => {
    if (!polaroidRef.current) return;

    // Wait for all images to load
    const images = polaroidRef.current.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error("Image load timeout")), 10000);
      });
    });

    await Promise.all(imagePromises);

    // Wait for fonts to load
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Additional small delay to ensure DOM is fully painted
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  const downloadPolaroid = () => {
    if (!selectedFile) return;
    setExportError(null);

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

    setIsExporting(true);
    setExportError(null);

    try {
      // Wait for all resources to be ready
      await waitForResources();

      // Capture with higher quality settings
      const dataUrl = await domToImage.toPng(polaroidRef.current, {
        quality: 1.0,
        bgcolor: bgColor === "black" ? "#000000" : "#FFFFFF",
        cacheBust: true,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = "polaroid.png";
      link.href = dataUrl;
      link.click();

      console.log("[INFO] Polaroid downloaded successfully");
    } catch (error) {
      console.error("[ERROR] Unable to download polaroid:", error);
      setExportError(error instanceof Error ? error.message : "Failed to export image");
    } finally {
      setIsExporting(false);
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
      className={`flex flex-col w-[1080px] h-[1920px] justify-center ${
        useInstagramSafeGutters ? "py-[250px]" : "py-16"
      }`}
    >
      <div
        id="componentContainer"
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center mx-auto flex-shrink-0" style={{
          maxWidth: "1000px",
          maxHeight: useInstagramSafeGutters ? "900px" : "1400px",
        }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              crossOrigin="anonymous"
              style={{
                transform: getOrientationTransform(imageOrientation),
              }}
            />
          )}
        </div>
        <div
          className={`flex flex-col mt-8 gap-0 ${
            useInstagramSafeGutters ? "mb-8" : "mb-auto"
          }`}
        >
          {exifDisplay.make &&
            (exifFormData.make && exifFormData.make === "Canon" ? (
              <img
                src={cannonLogo}
                alt="Canon"
                className="w-fit aspect-auto h-9 mx-auto mb-4"
                crossOrigin="anonymous"
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
      <button
        onClick={downloadPolaroid}
        disabled={!selectedFile || isExporting}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        {isExporting ? "Exporting..." : "Download Polaroid"}
      </button>
      {exportError && (
        <div className="text-red-600 text-sm max-w-md text-center">
          Error: {exportError}
        </div>
      )}
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
            {isExporting && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Exporting...</div>
                  <div className="text-sm text-gray-600">Please wait while we prepare your image</div>
                </div>
              </div>
            )}
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
