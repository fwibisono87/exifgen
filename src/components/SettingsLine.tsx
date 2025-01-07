import React from 'react';

const SettingsLine = ({ exifFormData, exifDisplay }) => {
  const exifItems = [
    { label: 'Shutter', value: exifFormData.shutter, show: exifDisplay.shutter },
    { label: 'Aperture', value: exifFormData.aperture, show: exifDisplay.aperture },
    { label: 'Focal Length', value: `${exifFormData.focalLength}mm`, show: exifDisplay.focalLength },
    { label: 'ISO', value: exifFormData.iso, show: exifDisplay.iso },
  ];

  const visibleExifItems = exifItems.filter(item => item.show && item.value);

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
