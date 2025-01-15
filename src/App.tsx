import React, { useState } from 'react';
import exifr from 'exifr';
import EXIFForm from './components/EXIFForm';
import CanvasPreview from './components/CanvasPreview';
import { ExifFormData } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState<'white' | 'black'>('white');
  const [fontColor, setFontColor] = useState<'black' | 'white'>('black');
  const [selectedFont, setSelectedFont] = useState<'Arial' | 'Courier' | 'Quicksand' | 'Poppins' | 'Montserrat'>('Poppins');
  const [useInstagramSafeGutters, setUseInstagramSafeGutters] = useState(false);

  const [exifFormData, setExifFormData] = useState<ExifFormData>({
    photographer: '',
    make: '',
    model: '',
    lens: '',
    focalLength: '',
    aperture: '',
    shutter: '',
    iso: '',
    latitude: '',
    longitude: '',
    subjectModel: '',
    locationName: '',
    character: '',
    dateTimeTaken: '',
  });

  const [exifDisplay, setExifDisplay] = useState<{ [K in keyof ExifFormData]: boolean }>({
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
    console.log('[INFO] handleFileChange called');
    const file = e.target.files?.[0];
    if (!file) {
      console.log('[INFO] No file selected');
      return;
    }
    setSelectedFile(file);
    console.log('[INFO] File selected:', file.name);

    try {
      const data = await exifr.parse(file);
      console.log('[INFO] EXIF data successfully parsed:', data);

      setExifFormData((prev) => ({
        ...prev,
        photographer: data?.Artist || '',
        make: data?.Make || '',
        model: data?.Model || '',
        lens: data?.LensModel || '',
        focalLength: data?.FocalLength ? `${data.FocalLength}` : '',
        aperture: data?.FNumber ? `ƒ/${data.FNumber}` : '',
        shutter: data?.ExposureTime ? formatShutterSpeed(data.ExposureTime) : '',
        iso: data?.ISO ? `ISO ${data.ISO}` : '',
        latitude: data?.latitude ? data.latitude.toFixed(6) : '',
        longitude: data?.longitude ? data.longitude.toFixed(6) : '',
        dateTimeTaken: data?.dateTimeOriginal
          ? 'ada anjir'
          : '',
      }));
    } catch (error) {
      console.error('[ERROR] Failed to read EXIF data:', error);
    }
  };

  const handleBgColorChange = (color: 'white' | 'black') => {
    console.log('[INFO] handleBgColorChange called', { color });
    setBgColor(color);
    setFontColor(color === 'white' ? 'black' : 'white');
    console.log('[INFO] Background colour changed to:', color);
  };

  const handleExifFieldChange = (field: keyof ExifFormData, value: string) => {
    console.log('[INFO] handleExifFieldChange called', { field, value });
    setExifFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleDisplay = (field: keyof ExifFormData) => {
    console.log('[INFO] handleToggleDisplay called', { field });
    setExifDisplay((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">Polaroid EXIF React App</h1>
      <div className="mb-6 flex justify-center space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="bgColor"
            value="white"
            checked={bgColor === 'white'}
            onChange={() => handleBgColorChange('white')}
            className="h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300">White Background</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="bgColor"
            value="black"
            checked={bgColor === 'black'}
            onChange={() => handleBgColorChange('black')}
            className="h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300">Black Background</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useInstagramSafeGutters}
            onChange={(e) => setUseInstagramSafeGutters(e.target.checked)}
            className="h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300">Use Instagram Stories Safe Gutters? (forces 9:16)</span>
        </label>
      </div>
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="fontSelect" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Font:
        </label>
        <select
          id="fontSelect"
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value as 'Arial' | 'Courier' | 'Quicksand' | 'Poppins')}
          className="block w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Quicksand">Quicksand</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Poppins">Poppins</option>
        </select>
      </div>
      <EXIFForm
        exifFormData={exifFormData}
        onChangeField={handleExifFieldChange}
        exifDisplay={exifDisplay}
        onToggleDisplay={handleToggleDisplay}
      />
      <div
      >
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
  );
};

export default App;
