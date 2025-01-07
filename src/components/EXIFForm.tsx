import React from 'react';
import { ExifFormData } from '../types';

interface Props {
  exifFormData: ExifFormData;
  onChangeField: (field: keyof ExifFormData, value: string) => void;
  exifDisplay: { [K in keyof ExifFormData]: boolean };
  onToggleDisplay: (field: keyof ExifFormData) => void;
}

const EXIFForm: React.FC<Props> = ({
  exifFormData,
  onChangeField,
  exifDisplay,
  onToggleDisplay,
}) => {
  console.log('[INFO] EXIFForm rendered', { exifFormData, exifDisplay });
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md">
      <p className="mb-4 text-lg font-medium text-gray-700">Edit EXIF Fields</p>
      {Object.keys(exifFormData).map((field) => (
        <div key={field} className="flex items-center mb-3">
          <input
            type="checkbox"
            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
            checked={exifDisplay[field as keyof ExifFormData]}
            onChange={() => onToggleDisplay(field as keyof ExifFormData)}
          />
          <input
            type="text"
            className="ml-3 flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field}
            value={exifFormData[field as keyof ExifFormData]}
            onChange={(e) => onChangeField(field as keyof ExifFormData, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default EXIFForm;