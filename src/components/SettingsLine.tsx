import React, { FC } from "react";
import { ExifFormData } from "../types";
import ExifItem from "./ExifItem";

type ExifDisplay = { [K in keyof ExifFormData]: boolean };
interface SettingsLineProps {
  exifFormData: ExifFormData;
  exifDisplay: ExifDisplay;
}

const SettingsLine: FC<SettingsLineProps> = ({ exifFormData, exifDisplay }) => {
  // Helper to format focal length - only add "mm" if not already present
  const formatFocalLength = (focalLength: string): string => {
    if (!focalLength) return "";
    if (focalLength.toLowerCase().includes("mm")) return focalLength;
    return `${focalLength}mm`;
  };

  const exifItems = [
    {
      label: "Shutter",
      value: exifFormData.shutter ? <ExifItem icon="carbon:timer" value={exifFormData.shutter} /> : null,
      show: exifDisplay.shutter,
    },
    {
      label: "Aperture",
      value: exifFormData.aperture ? <ExifItem icon="carbon:aperture" value={exifFormData.aperture} /> : null,
      show: exifDisplay.aperture,
    },
    {
      label: "Focal Length",
      value: exifFormData.focalLength ? (
        <ExifItem icon="carbon:ruler" value={formatFocalLength(exifFormData.focalLength)} />
      ) : null,
      show: exifDisplay.focalLength,
    },
    {
      label: "ISO",
      value: exifFormData.iso ? <ExifItem icon="carbon:iso" value={exifFormData.iso} /> : null,
      show: exifDisplay.iso,
    },
  ];

  const visibleExifItems = exifItems.filter((item) => item.show && item.value);

  return (
    <div className="flex flex-row gap-2 text-2xl mx-auto">
      {visibleExifItems.map((item, index) => (
        <React.Fragment key={index}>
          <span>{item.value}</span>
          {index < visibleExifItems.length - 1 && (
            <span className="text-gray-500">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SettingsLine;
