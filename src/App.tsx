import React, { useState } from "react";
import exifr from "exifr";
import EXIFForm from "./components/EXIFForm";
import CanvasPreview from "./components/CanvasPreview";
import { ExifFormData } from "./types";
import OptionsForm from "./components/OptionsForm";
import {Icon} from "@iconify/react"

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState<"white" | "black">("white");
  const [fontColor, setFontColor] = useState<"black" | "white">("black");
  const [selectedFont, setSelectedFont] = useState<
    "Arial" | "Courier" | "Quicksand" | "Poppins" | "Montserrat"
  >("Montserrat");
  const [useInstagramSafeGutters, setUseInstagramSafeGutters] = useState(false);

  const [exifFormData, setExifFormData] = useState<ExifFormData>({
    photographer: "",
    make: "",
    model: "",
    lens: "",
    focalLength: "",
    aperture: "",
    shutter: "",
    iso: "",
    latitude: "",
    longitude: "",
    subjectModel: "",
    locationName: "",
    character: "",
    dateTimeTaken: "",
  });

  const [exifDisplay, setExifDisplay] = useState<{
    [K in keyof ExifFormData]: boolean;
  }>({
    photographer: true,
    make: true,
    model: true,
    lens: true,
    focalLength: true,
    aperture: true,
    shutter: true,
    iso: true,
    latitude: true,
    longitude: true,
    subjectModel: true,
    locationName: true,
    character: true,
    dateTimeTaken: true,
  });

  // Add the helper function to format shutter speed
  const formatShutterSpeed = (exposureTime: number): string => {
    if (exposureTime >= 1) {
      return `${exposureTime}s`;
    } else {
      const denominator = Math.round(1 / exposureTime);
      return `1/${denominator}s`;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[INFO] handleFileChange called");
    const file = e.target.files?.[0];
    if (!file) {
      console.log("[INFO] No file selected");
      return;
    }
    setSelectedFile(file);
    console.log("[INFO] File selected:", file.name);

    try {
      const data = await exifr.parse(file);
      console.log("[INFO] EXIF data successfully parsed:", data);

      setExifFormData((prev) => ({
        ...prev,
        photographer: data?.Artist || "",
        make: data?.Make || "",
        model: data?.Model || "",
        lens: data?.LensModel || "",
        focalLength: data?.FocalLength ? `${data.FocalLength}` : "",
        aperture: data?.FNumber ? `ƒ/${data.FNumber}` : "",
        shutter: data?.ExposureTime
          ? formatShutterSpeed(data.ExposureTime)
          : "",
        iso: data?.ISO ? `ISO ${data.ISO}` : "",
        latitude: data?.latitude ? data.latitude.toFixed(6) : "",
        longitude: data?.longitude ? data.longitude.toFixed(6) : "",
        dateTimeTaken: data?.dateTimeOriginal ? "ada anjir" : "",
      }));
    } catch (error) {
      console.error("[ERROR] Failed to read EXIF data:", error);
    }
  };

  const handleBgColorChange = (color: "white" | "black") => {
    console.log("[INFO] handleBgColorChange called", { color });
    setBgColor(color);
    setFontColor(color === "white" ? "black" : "white");
    console.log("[INFO] Background colour changed to:", color);
  };

  const handleExifFieldChange = (field: keyof ExifFormData, value: string) => {
    console.log("[INFO] handleExifFieldChange called", { field, value });
    setExifFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleDisplay = (field: keyof ExifFormData) => {
    console.log("[INFO] handleToggleDisplay called", { field });
    setExifDisplay((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="flex flex-col py-16 w-screen min-h-screen w-full">
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">
          Polaroid EXIF React App
        </h1>
        <span className="text-md text-gray-600 dark:text-gray-400 -mt-4">
          By <a href="https://github.com/fwibisono87">@fwibisono87</a>
          </span>
          <span className="text-md text-gray-600 dark:text-gray-400 -mt-4">
          <a href="https://github.com/fwibisono87/exifgen"><Icon icon="carbon:logo-github" className="w-8 h-8"></Icon></a>
          </span>

        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <EXIFForm
          exifFormData={exifFormData}
          onChangeField={handleExifFieldChange}
          exifDisplay={exifDisplay}
          onToggleDisplay={handleToggleDisplay}
        />
        
        <OptionsForm
          bgColor={bgColor}
          handleBgColorChange={handleBgColorChange}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          useInstagramSafeGutters={useInstagramSafeGutters}
          setUseInstagramSafeGutters={setUseInstagramSafeGutters}
        />
        
        <div>
          <CanvasPreview
            selectedFile={selectedFile}
            bgColor={bgColor}
            fontColor={fontColor}
            exifFormData={exifFormData}
            exifDisplay={exifDisplay}
            selectedFont={selectedFont}
            useInstagramSafeGutters={useInstagramSafeGutters}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
