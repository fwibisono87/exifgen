import React, { useRef, useState } from "react";
import domToImage from "dom-to-image";
import { ExifFormData } from "../types";
import SettingsLine from "./SettingsLine";

interface Props {
  selectedFile: File | null;
  bgColor: "white" | "black";
  fontColor: "black" | "white";
  exifFormData: ExifFormData;
  exifDisplay: { [K in keyof ExifFormData]: boolean };
  selectedFont: "Arial" | "Courier" | "Quicksand" | "Poppins";
  useInstagramSafeGutters: boolean;
}

const CanvasPreview: React.FC<Props> = ({
  selectedFile,
  bgColor,
  fontColor,
  exifFormData,
  exifDisplay,
  selectedFont,
  useInstagramSafeGutters,
}) => {
  const polaroidRef = useRef<HTMLDivElement>(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  const generatePreview = async () => {
    console.log("[INFO] generatePreview called");
    console.log("[INFO]: selectedFile", selectedFile);
    if (!selectedFile) return;
    setIsPreviewReady(true);
    console.log("[INFO] generatePreview completed");
  };

  const downloadPolaroid = async () => {
    console.log("[INFO] downloadPolaroid called");
    if (!isPreviewReady) await generatePreview();
    if (!polaroidRef.current) return;
    const dataUrl = await domToImage.toPng(polaroidRef.current);
    const link = document.createElement("a");
    link.download = "polaroid.png";
    link.href = dataUrl;
    link.click();
    console.log("[INFO] downloadPolaroid completed");
  };

  return (
    <div className="flex flex-col gap-4 items-center mt-6 ">
      <button onClick={generatePreview} disabled={!selectedFile}>
        Generate Preview
      </button>
      <button onClick={downloadPolaroid} disabled={!selectedFile}>
        Download Polaroid
      </button>
      {JSON.stringify(exifFormData)}
      {isPreviewReady ? (
        <div
          ref={polaroidRef}
          style={{
            backgroundColor: bgColor === "black" ? "#000000" : "#FFFFFF",
            color: fontColor,
            fontFamily: selectedFont,
            width: "1080px",
            height: "1920px",
            overflow: "hidden",
          }}
          className={`flex flex-col w-[1080px] h-[1920px] ${useInstagramSafeGutters ? "py-[250px]" : "pb-16"}`}
        >
          <div className="flex flex-grow mx-auto flex-row">
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          <div className={`flex flex-col mt-8 mb-auto gap-2 ${useInstagramSafeGutters ? "mb-8" : ''} `}>
            {exifDisplay.make &&
              (exifFormData.make && exifFormData.make === "Canon" ? (
                <img
                  src="/canon.png"
                  alt="Canon"
                  className="w-fit aspect-auto h-9 mx-auto"
                />
              ) : (
                <span className="mx-auto text-4xl font-bold">
                  {exifFormData.make}
                </span>
              ))}
            {exifDisplay.model && (
              <span className="mx-auto text-2xl">{exifFormData.model}</span>
            )}
            {exifDisplay.lens && (
              <span className="mx-auto text-2xl">{exifFormData.lens}</span>
            )}
            <SettingsLine
              exifFormData={exifFormData}
              exifDisplay={exifDisplay}
            />
          </div>
        </div>
      ) : (
        <p>No preview available yet.</p>
      )}
    </div>
  );
};

export default CanvasPreview;
