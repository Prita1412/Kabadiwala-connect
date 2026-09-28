import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Image as ImageIcon,
  Send,
  Loader2,
  Paperclip,
  X,
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { VoiceInputHelper } from '../utils/speech';

interface ChatInputProps {
  lang: Language;
  role: UserRole;
  isProcessing: boolean;
  onSendMessage: (text: string, imageSrc?: string, isVoice?: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  lang,
  role,
  isProcessing,
  onSendMessage,
}) => {
  const [text, setText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [voiceHelper] = useState(() => new VoiceInputHelper());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeholders: Record<Language, string> = {
    mr: 'प्रश्न विचारा किंवा बोला (उदा. "माझ्या जवळचे पिकअप्स दाखव")...',
    hi: 'प्रश्न पूछें या बोलें (उदा. "आज के पिकअप्स दिखाओ")...',
    en: 'Type, speak, or upload scrap photo (e.g. "Show pickups near me")...',
  };

  const handleSend = () => {
    if ((!text.trim() && !selectedImage) || isProcessing) return;
    onSendMessage(text.trim(), selectedImage || undefined, false);
    setText('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Adjust textarea height automatically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  // Microphone click handler
  const toggleListening = () => {
    if (isListening) {
      voiceHelper.stopListening();
      setIsListening(false);
      return;
    }

    const started = voiceHelper.startListening(
      lang,
      (transcript, isFinal) => {
        setText(transcript);
        if (isFinal) {
          setIsListening(false);
          // Auto send on complete sentence after brief pause
          setTimeout(() => {
            if (transcript.trim()) {
              onSendMessage(transcript.trim(), undefined, true);
              setText('');
            }
          }, 300);
        }
      },
      (err) => {
        console.warn('Voice recognition error or not permitted', err);
        setIsListening(false);
        // Fallback simulation for devices without speech recognition
        simulateVoiceInput();
      },
      () => {
        setIsListening(false);
      }
    );

    if (!started) {
      simulateVoiceInput();
    } else {
      setIsListening(true);
    }
  };

  // Simulated voice input for seamless testing on any browser/device
  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      const voiceSamples: Record<UserRole, Record<Language, string>> = {
        kabadiwala: {
          mr: 'आज किती pickup requests आहेत?',
          hi: 'आज कितने pickup requests हैं?',
          en: 'How many pickup requests today?',
        },
        household: {
          mr: 'मला कबाड विकायचं आहे',
          hi: 'मुझे कबाड़ बेचना है',
          en: 'I want to sell household scrap',
        },
        recycler: {
          mr: 'नवीन bulk scrap batches दाखवा',
          hi: 'नए bulk scrap batches दिखाओ',
          en: 'Show verified bulk scrap batches',
        },
        regulator: {
          mr: 'EPR compliance summary',
          hi: 'EPR compliance summary',
          en: 'EPR compliance summary',
        },
      };

      const sample = voiceSamples[role][lang];
      setText(sample);
      setIsListening(false);
      setTimeout(() => {
        onSendMessage(sample, undefined, true);
        setText('');
      }, 400);
    }, 1200);
  };

  // Handle local image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 sm:px-4 py-3 z-30">
      <div className="max-w-3xl mx-auto">
        {/* Preview of attached image */}
        {selectedImage && (
          <div className="relative inline-block mb-2">
            <img
              src={selectedImage}
              alt="Scrap preview"
              className="w-16 h-16 object-cover rounded-xl border-2 border-emerald-500 shadow-sm"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Listening Active Banner */}
        {isListening && (
          <div className="mb-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span className="font-semibold">
                {lang === 'mr'
                  ? 'ऐकत आहे... बोला'
                  : lang === 'hi'
                  ? 'सुन रहा हूँ... बोलिए'
                  : 'Listening... Speak now'}
              </span>
            </div>
            <button
              onClick={() => setIsListening(false)}
              className="text-xs text-emerald-700 underline font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Controls Bar */}
        <div className="flex items-end gap-2 bg-slate-100 rounded-2xl p-1.5 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Image upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] min-w-[44px] p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center shrink-0"
            title={lang === 'mr' ? 'भंगार फोटो अपलोड करा' : lang === 'hi' ? 'कबाड़ फोटो अपलोड करें' : 'Upload scrap photo for AI detection'}
            aria-label="Upload scrap photo"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text Area Input Field */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[lang]}
            className="flex-1 max-h-32 min-h-[40px] py-2 px-1 text-sm bg-transparent resize-none border-0 focus:outline-none text-slate-900 placeholder:text-slate-400"
          />

          {/* Voice Microphone button next to text input */}
          <button
            type="button"
            onClick={toggleListening}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-400'
                : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-200'
            }`}
            title={
              isListening
                ? lang === 'mr' ? 'माईक बंद करा' : 'Stop voice input'
                : lang === 'mr' ? 'आवाजाने बोला (मराठी/English)' : 'Speak query in Marathi or English'
            }
            aria-label="Voice input microphone"
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!text.trim() && !selectedImage) || isProcessing}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl flex items-center justify-center transition-colors shadow-xs ${
              (text.trim() || selectedImage) && !isProcessing
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-1.5 font-medium">
          KabadiGpt AI Waste-Management & Traceability Platform
        </p>
      </div>
    </div>
  );
};
