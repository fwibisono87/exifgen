import React, { FC } from "react";
import { ExifFormData } from "../types";
import ExifItem from "./ExifItem";

type ExifDisplay = { [K in keyof ExifFormData]: boolean };
interface SettingsLineProps {
  exifFormData: ExifFormData;
  exifDisplay: ExifDisplay;
}

const SettingsLine: FC<SettingsLineProps> = ({ exifFormData, exifDisplay }) => {
  const exifItems = [
    {
      label: "Shutter",
      value: <ExifItem icon="carbon:timer" value={exifFormData.shutter} />,
      show: exifDisplay.shutter,
    },
    {
      label: "Aperture",
      value: <ExifItem icon="carbon:aperture" value={exifFormData.aperture} />,
      show: exifDisplay.aperture,
    },
    {
      label: "Focal Length",
      value: (
        <ExifItem icon="carbon:ruler" value={`${exifFormData.focalLength}mm`} />
      ),
      show: exifDisplay.focalLength,
    },
    {
      label: "ISO",
      value: <ExifItem icon="carbon:iso" value={exifFormData.iso} />,
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
