
import React from 'react';

interface Props {
  bgColor: "white" | "black";
  handleBgColorChange: (color: "white" | "black") => void;
  selectedFont: "Arial" | "Courier" | "Quicksand" | "Poppins" | "Montserrat";
  setSelectedFont: (font: "Arial" | "Courier" | "Quicksand" | "Poppins" | "Montserrat") => void;
  useInstagramSafeGutters: boolean;
  setUseInstagramSafeGutters: (value: boolean) => void;
}

const OptionsForm: React.FC<Props> = ({
  bgColor,
  handleBgColorChange,
  selectedFont,
  setSelectedFont,
  useInstagramSafeGutters,
  setUseInstagramSafeGutters,
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md dark:bg-gray-800">
      <p className="mb-4 text-lg font-medium text-black-700 dark:text-gray-200">Options</p>
      
      <label
        htmlFor="bgColorSelect"
        className="flex items-center space-x-2 mb-4"
      >
        <span className="text-gray-700 dark:text-gray-300">
          Background Color:
        </span>
        <select
          id="bgColorSelect"
          value={bgColor}
          onChange={(e) =>
            handleBgColorChange(e.target.value as "white" | "black")
          }
          className="h-10 px-2 rounded border border-gray-300 text-gray-700 dark:text-gray-300 dark:bg-gray-700"
        >
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
      </label>

      <label
        htmlFor="fontSelect"
        className="flex items-center space-x-2 mb-4"
      >
        <span className="text-gray-700 dark:text-gray-300">
          Select Font:
        </span>
        <select
          id="fontSelect"
          value={selectedFont}
          onChange={(e) =>
            setSelectedFont(
              e.target.value as
                | "Arial"
                | "Courier"
                | "Quicksand"
                | "Poppins"
                | "Montserrat"
            )
          }
          className="h-10 px-2 rounded border border-gray-300 text-gray-700 dark:text-gray-300 dark:bg-gray-700"
        >
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Quicksand">Quicksand</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Poppins">Poppins</option>
        </select>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={useInstagramSafeGutters}
          onChange={(e) => setUseInstagramSafeGutters(e.target.checked)}
          className="h-5 w-5 text-blue-600"
        />
        <span className="text-gray-700 dark:text-gray-300">
          Use Instagram Stories Safe Gutters? (forces 9:16)
        </span>
      </label>
    </div>
  );
};

export default OptionsForm;