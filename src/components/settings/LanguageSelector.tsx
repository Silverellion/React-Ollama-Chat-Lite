import React, { useContext } from "react";
import { SettingsContext } from "./SettingsForm";

type Language = {
  code: string;
  name: string;
};

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useContext(SettingsContext);

  // Available languages
  const languages: Language[] = [
    { code: "en-US", name: "English" },
    { code: "ja-JP", name: "Japanese" },
    { code: "de-DE", name: "German" },
    { code: "fr-FR", name: "French" },
  ];

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-white">Speech recognition language</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-[rgb(30,30,30)] text-white p-2 rounded-md border border-[rgb(60,60,60)] focus:outline-none focus:border-[rgb(200,60,60)]"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="text-gray-400 text-sm">
        Choose the language for voice recognition.
      </div>
    </div>
  );
};

export default LanguageSelector;
