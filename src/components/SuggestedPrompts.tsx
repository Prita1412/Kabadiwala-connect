import React from 'react';
import { Sparkles } from 'lucide-react';
import { Language, UserRole } from '../types';

interface SuggestedPromptsProps {
  role: UserRole;
  lang: Language;
  isOnboarding?: boolean;
  onSelectPrompt: (promptText: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  role,
  lang,
  isOnboarding = false,
  onSelectPrompt,
}) => {
  // If in role detection onboarding phase
  if (isOnboarding) {
    const onboardingPrompts = {
      mr: [
        'मी घरातून कबाड विकतो',
        'मी कबाडीवाला आहे',
        'मी recycler आहे',
        'मी government officer आहे',
      ],
      hi: [
        'मैं घर से कबाड़ बेचता हूँ (Household)',
        'मैं कबाड़ीवाला हूँ (Kabadiwala)',
        'मैं रीसाइक्लर हूँ (Recycler)',
        'मैं सरकारी अधिकारी हूँ (Government)',
      ],
      en: [
        'I sell household scrap (Household)',
        'I am a kabadiwala (Collector)',
        'I am an authorized recycler (Recycler)',
        'I am a government officer (Regulator)',
      ],
    }[lang];

    return (
      <div className="py-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {lang === 'mr'
              ? 'तुमची भूमिका निवडा किंवा खालीलपैकी एकावर टॅप करा:'
              : lang === 'hi'
              ? 'अपनी भूमिका चुनें या नीचे दिए विकल्प पर टैप करें:'
              : 'Choose your role or tap one below:'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {onboardingPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(prompt)}
              className="text-xs text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 transition-colors shadow-2xs font-semibold cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const promptData: Record<UserRole, Record<Language, string[]>> = {
    kabadiwala: {
      mr: [
        'आज किती pickup requests आहेत?',
        'माझ्या जवळचे pickups दाखव',
        'माझी आजची कमाई किती?',
        'माझा पूर्ण dashboard दाखव',
        'कचरा वजन करा (काटा)',
        'नवीन bulk scrap batches दाखवा',
      ],
      hi: [
        'आज कितने pickup requests हैं?',
        'मेरे पास के pickups दिखाओ',
        'मेरी आज की कमाई कितनी है?',
        'मेरा पूरा dashboard दिखाओ',
        'कबाड़ का वजन करें (कांटा)',
        'नए bulk scrap batches दिखाओ',
      ],
      en: [
        "How many pickup requests today?",
        "Show pickups near me",
        "What is my earning today?",
        "Show my full operations dashboard",
        "Open smart digital weighing scale",
        "Create bulk scrap bale / batch",
      ],
    },
    household: {
      mr: [
        'मला कबाड विकायचं आहे',
        'माझ्याकडे जुना laptop आहे',
        'मला pickup book करायचा आहे',
        'माझा pickup कुठे आहे?',
        'माझी डिजिटल पावती दाखवा',
      ],
      hi: [
        'मुझे कबाड़ बेचना है',
        'मेरे पास पुराना laptop है',
        'मुझे pickup book करना है',
        'मेरा pickup कहाँ है?',
        'मेरी डिजिटल रसीद दिखाओ',
      ],
      en: [
        'I want to sell household scrap',
        'I have an old laptop to sell',
        'Book doorstep scrap pickup',
        'Where is my pickup collector?',
        'Show my digital green receipt',
      ],
    },
    recycler: {
      mr: [
        'नवीन bulk scrap batches दाखवा',
        'Verified recycler matching',
        'Traceability manifest तपासणी',
        'B2B खरेदी दर तपासा',
      ],
      hi: [
        'नए bulk scrap batches दिखाओ',
        'Verified recycler matching',
        'ट्रेसेबिलिटी मैनिफेस्ट जांच',
        'B2B खरीद दर जांचें',
      ],
      en: [
        'Show verified bulk scrap batches',
        'Find verified recycler matching',
        'Audit traceability manifest',
        'View B2B spot procurement rates',
      ],
    },
    regulator: {
      mr: [
        'EPR compliance summary',
        'City-wide waste diversion analytics',
        'Traceability manifest तपासणी',
        'वॉर्डनिहाय प्लास्टिक ऑडिट अहवाल',
      ],
      hi: [
        'EPR compliance summary',
        'City-wide waste diversion analytics',
        'ट्रेसेबिलिटी मैनिफेस्ट जांच',
        'वार्डवार प्लास्टिक ऑडिट रिपोर्ट',
      ],
      en: [
        'EPR compliance summary',
        'City-wide waste diversion analytics',
        'Verify end-to-end traceability manifest',
        'Informal worker formalization rate',
      ],
    },
  };

  const prompts = promptData[role][lang] || promptData[role].mr;

  return (
    <div className="py-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>
          {lang === 'mr'
            ? 'सुचवलेले प्रश्न व क्रिया:'
            : lang === 'hi'
            ? 'सुझाए गए प्रश्न:'
            : 'Suggested Actions:'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="text-xs text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 text-slate-700 transition-colors shadow-2xs font-medium cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
