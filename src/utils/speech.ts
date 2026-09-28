import { Language } from '../types';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

// Browser Web Speech Recognition wrapper
export class VoiceInputHelper {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      } catch (e) {
        console.warn('SpeechRecognition initialization error', e);
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    lang: Language,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) return false;

    try {
      // Map to BCP-47 language codes
      const langCodes: Record<Language, string> = {
        mr: 'mr-IN',
        hi: 'hi-IN',
        en: 'en-IN',
      };
      this.recognition.lang = langCodes[lang] || 'mr-IN';

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      onError(e);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn(e);
      }
      this.isListening = false;
    }
  }
}

// Text-to-speech for conversational accessibility
export function speakText(text: string, lang: Language): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    // Clean markdown asterisks or special characters for clear speech
    const cleanText = text.replace(/[*_#`~[\]()]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langCodes: Record<Language, string> = {
      mr: 'mr-IN',
      hi: 'hi-IN',
      en: 'en-US',
    };
    const targetLang = langCodes[lang] || 'en-US';
    utterance.lang = targetLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const loadVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        // Preferred exact match
        let selectedVoice = voices.find(
          (v) => v.lang.toLowerCase() === targetLang.toLowerCase()
        );

        // Fallback for Marathi if not installed: try hi-IN or Indian English
        if (!selectedVoice && lang === 'mr') {
          selectedVoice = voices.find((v) =>
            v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in')
          );
        }

        // Fallback for English: en-IN, en-US, en-GB
        if (!selectedVoice && lang === 'en') {
          selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      window.speechSynthesis.speak(utterance);
    };

    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) {
      loadVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoiceAndSpeak();
      };
      // Fallback timeout in case onvoiceschanged does not fire
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          window.speechSynthesis.speak(utterance);
        }
      }, 100);
    }
  } catch (err) {
    console.warn('Speech synthesis error', err);
  }
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
