
import React from 'react';
import { ExifFormData } from '../types';
import ExifItem from './ExifItem';

interface Props {
  exifFormData: ExifFormData;
  exifDisplay: { [K in keyof ExifFormData]: boolean };
}

const ShootLine: React.FC<Props> = ({ exifFormData, exifDisplay }) => {
  const items = [];
  if (exifDisplay.dateTimeTaken && exifFormData.dateTimeTaken) {
    items.push(<ExifItem key="date" icon="carbon:calendar" value={exifFormData.dateTimeTaken} />);
  }
  if (exifDisplay.locationName && exifFormData.locationName) {
    items.push(<ExifItem key="loc" icon="carbon:location" value={exifFormData.locationName} />);
  }

  return (
    <div className="flex flex-row mx-auto gap-4 text-xl">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && '|'}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ShootLine;