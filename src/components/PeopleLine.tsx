
import React from 'react';
import { ExifFormData } from '../types';
import ExifItem from './ExifItem';

interface Props {
  exifFormData: ExifFormData;
  exifDisplay: { [K in keyof ExifFormData]: boolean };
}

const PeopleLine: React.FC<Props> = ({ exifFormData, exifDisplay }) => {
  return (
    <div className="flex flex-row mx-auto gap-4 text-xl">
      {exifDisplay.photographer && exifFormData.photographer && (
        <ExifItem icon="carbon:camera" value={exifFormData.photographer} />
      )}
      {exifDisplay.subjectModel && exifFormData.subjectModel && (
        <>
          {(exifFormData.photographer ? '|' : '')}
          <ExifItem icon="carbon:user" value={exifFormData.subjectModel} />
        </>
      )}
      {exifDisplay.character && exifFormData.character && (
        <>
          {(exifFormData.subjectModel || exifFormData.photographer ? '|' : '')}
          <ExifItem icon="carbon:user-certification" value={exifFormData.character} />
        </>
      )}
    </div>
  );
};

export default PeopleLine;