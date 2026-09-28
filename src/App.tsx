/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ChatMessage as ChatMessageType,
  Language,
  UserRole,
  SupportedRole,
  KycStatus,
  UserProfile,
  ActiveComponentType,
  CentralUIState,
} from './types';
import { Header } from './components/Header';
import { SuggestedPrompts } from './components/SuggestedPrompts';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LandingScreen } from './components/LandingScreen';
import { PhoneLoginScreen } from './components/PhoneLoginScreen';
import { parseUserIntent } from './utils/aiIntentParser';
import { detectUserRoleFromText } from './utils/roleDetector';
import { speakText, stopSpeaking } from './utils/speech';
import { auth } from './lib/firebase';
import {
  saveUserProfile,
  getUserProfile,
  seedInitialDataIfEmpty,
  subscribeAuthState,
} from './services/firebaseService';
import { Sparkles, Recycle } from 'lucide-react';

export default function App() {
  // App Phase: 'landing' | 'login' | 'onboarding' | 'main'
  const [appPhase, setAppPhase] = useState<'landing' | 'login' | 'onboarding' | 'main'>('landing');

  const [currentRole, setCurrentRole] = useState<UserRole>('kabadiwala');
  const [currentLang, setCurrentLang] = useState<Language>('mr');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    phone: '',
    role: null,
    kycStatus: 'PENDING',
    onboarded: false,
  });

  // Central UI state architecture for dynamic component rendering
  const [centralUIState, setCentralUIState] = useState<CentralUIState>({
    activeComponent: 'REQUEST_COUNT',
    componentData: { total: 7 },
  });

  // Initial welcome message generator for main conversational app
  const getInitialWelcome = (role: UserRole, lang: Language): ChatMessageType => {
    const timeNow = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (role === 'kabadiwala') {
      const texts: Record<Language, string> = {
        mr: 'नमस्कार! मी KabadiGpt — तुमचा डिजिटल भंगार व ऑपरेशन्स असिस्टंट. आजच्या नवीन पिकअप विनंत्या, जवळचे मार्ग किंवा आजची एकूण कमाई जाणून घेण्यासाठी खालील बटणावर टॅप करा किंवा थेट बोला:',
        hi: 'नमस्ते! मैं KabadiGpt हूँ — आपका डिजिटल कबाड़ व ऑपरेशन्स सहायक। आज के पिकअप्स, नजदीकी रूट या आज की कमाई देखने के लिए नीचे दिए विकल्पों पर टैप करें:',
        en: 'Hello! I am KabadiGpt — your AI waste-management assistant. Tap below or speak to check today’s pending pickups, navigate routes, or review daily earnings:',
      };
      return {
        id: 'msg-init-1',
        sender: 'ai',
        text: texts[lang],
        timestamp: timeNow,
        workflow: { type: 'REQUEST_COUNT', data: { total: 7 } },
      };
    } else if (role === 'household') {
      const texts: Record<Language, string> = {
        mr: 'नमस्कार! मी KabadiGpt. तुमच्या घरातील जुनी वर्तमानपत्रे, प्लास्टिक, लोखंड, तांबे किंवा जुने इलेक्ट्रॉनिक्स वाजवी हमीभावात विकण्यासाठी साहित्याची निवड करा:',
        hi: 'नमस्ते! मैं KabadiGpt हूँ। घर बैठे पुराना अखबार, प्लास्टिक, धातु या ई-कचरा उचित मूल्य पर बेचने के लिए नीचे सामग्री चुनें:',
        en: 'Welcome! I am KabadiGpt. Sell your household paper, plastics, scrap metals, or old laptops at verified doorstep spot rates:',
      };
      return {
        id: 'msg-init-1',
        sender: 'ai',
        text: texts[lang],
        timestamp: timeNow,
        workflow: { type: 'SELL_SCRAP' },
      };
    } else if (role === 'recycler') {
      const texts: Record<Language, string> = {
        mr: 'नमस्कार अधिकृत रिसायकलर! प्रमाणित बल्क स्क्रॅप बॅचेस, थेट बी२बी खरेदी आणि ईपीआर ऑडिट मॅनिफेस्ट तपासण्यासाठी खालील पर्याय उपलब्ध आहेत:',
        hi: 'नमस्ते अधिकृत रिसाइकलर! प्रमाणित बल्क स्क्रैप बैचेस की खरीद और ईपीआर ट्रेसेबिलिटी मैनिफेस्ट देखने के लिए नीचे क्लिक करें:',
        en: 'Welcome Authorized Recycler! Review certified scrap batches, place spot bids, and inspect circular economy traceability manifests:',
      };
      return {
        id: 'msg-init-1',
        sender: 'ai',
        text: texts[lang],
        timestamp: timeNow,
        workflow: { type: 'RECYCLER_MATCHING' },
      };
    } else {
      const texts: Record<Language, string> = {
        mr: 'नमस्कार नियामक अधिकारी! महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB) व मनपा लँडफिल डायव्हर्जन आणि ईपीआर अनुपालन विश्लेषण अहवाल खाली दिला आहे:',
        hi: 'नमस्कार नियामक अधिकारी! CPCB/MPCB लैंडफिल डायवर्जन और ईपीआर कम्प्लायंस की रियल-टाइम रिपोर्ट नीचे उपलब्ध है:',
        en: 'Regulatory Portal Active. Inspect municipal waste diversion statistics, informal sector formalization, and EPR audit ledgers:',
      };
      return {
        id: 'msg-init-1',
        sender: 'ai',
        text: texts[lang],
        timestamp: timeNow,
        workflow: { type: 'REGULATORY_ANALYTICS' },
      };
    }
  };

  // Onboarding initial message:
  // "नमस्कार! तुम्ही कोणत्या प्रकारचे user आहात?"
  const getInitialOnboardingMessage = (lang: Language): ChatMessageType => {
    const timeNow = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const greetings = {
      mr: 'नमस्कार! तुम्ही कोणत्या प्रकारचे user आहात?\n\nखाली दिलेल्या पर्यायांमधून निवडा किंवा थेट बोला/टाइप करा:\n• "मी घरातून कबाड विकतो"\n• "मी कबाडीवाला आहे"\n• "मी recycler आहे"\n• "मी government officer आहे"',
      hi: 'नमस्ते! आप किस प्रकार के user हैं?\n\nनीचे दिए गए विकल्पों में से चुनें या बोलें/टाइप करें:\n• "मैं घर से कबाड़ बेचता हूँ"\n• "मैं कबाड़ीवाला हूँ"\n• "मैं recycler हूँ"\n• "मैं government officer हूँ"',
      en: 'Hello! What type of user are you?\n\nSelect below or speak/type:\n• "I sell scrap from household"\n• "I am a kabadiwala (Collector)"\n• "I am a recycler"\n• "I am a government officer"',
    }[lang];

    return {
      id: 'onboarding-intro',
      sender: 'ai',
      text: greetings,
      timestamp: timeNow,
    };
  };

  const [messages, setMessages] = useState<ChatMessageType[]>(() => [
    getInitialOnboardingMessage('mr'),
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, appPhase]);

  // Initialize Firestore seeding and listen to Firebase Auth
  useEffect(() => {
    seedInitialDataIfEmpty();

    const unsubscribe = subscribeAuthState(async (fbUser) => {
      if (fbUser) {
        setUserProfile((prev) => ({ ...prev, id: fbUser.uid }));
        const existingProfile = await getUserProfile(fbUser.uid);
        if (existingProfile) {
          setUserProfile({
            id: existingProfile.id,
            name: existingProfile.name,
            phone: existingProfile.phone,
            role: existingProfile.role,
            verificationStatus: existingProfile.verificationStatus,
            kycStatus: existingProfile.verificationStatus,
            language: existingProfile.language,
            location: existingProfile.location,
            kycDetails: existingProfile.kycDetails,
            onboarded: true,
          });
          if (existingProfile.role) {
            setCurrentRole(mapSupportedRoleToUserRole(existingProfile.role));
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Convert SupportedRole to UserRole
  const mapSupportedRoleToUserRole = (supRole: SupportedRole): UserRole => {
    switch (supRole) {
      case 'HOUSEHOLD':
        return 'household';
      case 'KABADIWALA':
        return 'kabadiwala';
      case 'RECYCLER':
        return 'recycler';
      case 'GOVERNMENT':
        return 'regulator';
    }
  };

  // Convert UserRole to SupportedRole
  const mapUserRoleToSupportedRole = (uRole: UserRole): SupportedRole => {
    switch (uRole) {
      case 'household':
        return 'HOUSEHOLD';
      case 'kabadiwala':
        return 'KABADIWALA';
      case 'recycler':
        return 'RECYCLER';
      case 'regulator':
        return 'GOVERNMENT';
    }
  };

  // Handle successful phone login with OTP 123456
  const handleLoginSuccess = (phoneNumber: string) => {
    setUserProfile((prev) => ({
      ...prev,
      phone: phoneNumber,
    }));
    setAppPhase('onboarding');
    const introMsg = getInitialOnboardingMessage(currentLang);
    setMessages([introMsg]);
    if (soundEnabled) {
      speakText('नमस्कार! तुम्ही कोणत्या प्रकारचे user आहात?', currentLang);
    }
  };

  // Direct demo role jump from landing page
  const handleDirectDemoRole = (role: SupportedRole) => {
    setUserProfile((prev) => ({
      ...prev,
      phone: '+91 98220 14829',
      role: role,
    }));
    const mapped = mapSupportedRoleToUserRole(role);
    setCurrentRole(mapped);
    setAppPhase('onboarding');

    const introMsg = getInitialOnboardingMessage(currentLang);
    const roleChoiceText = {
      HOUSEHOLD: 'मी घरातून कबाड विकतो',
      KABADIWALA: 'मी कबाडीवाला आहे',
      RECYCLER: 'मी recycler आहे',
      GOVERNMENT: 'मी government officer आहे',
    }[role];

    const userMsg: ChatMessageType = {
      id: `usr-direct-${Date.now()}`,
      sender: 'user',
      text: roleChoiceText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiGreeting = {
      mr: `छान! तुम्ही "${role}" निवडले आहे. तुमच्या खात्याची पडताळणी पूर्ण करण्यासाठी खालील प्रोटोटाइप केवायसी फॉर्म तपासा:`,
      hi: `बहुत बढ़िया! आपने "${role}" चुना है। सत्यापन हेतु नीचे दिया गया प्रोटोटाइप केवाईसी फॉर्म देखें:`,
      en: `Great! Selected role as "${role}". Complete the prototype onboarding and verification below:`,
    }[currentLang];

    const aiMsg: ChatMessageType = {
      id: `ai-direct-${Date.now()}`,
      sender: 'ai',
      text: aiGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      onboardingRole: role,
    };

    setMessages([introMsg, userMsg, aiMsg]);

    if (soundEnabled) {
      speakText(aiGreeting, currentLang);
    }
  };

  // When role changes via dropdown in header
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const supRole = mapUserRoleToSupportedRole(newRole);
    setUserProfile((prev) => ({ ...prev, role: supRole }));

    const welcome = getInitialWelcome(newRole, currentLang);
    if (welcome.workflow) {
      setCentralUIState({
        activeComponent: welcome.workflow.type,
        componentData: welcome.workflow.data || null,
      });
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-shift-${Date.now()}`,
        sender: 'ai',
        text:
          currentLang === 'mr'
            ? `भूमिका बदलली: ${newRole.toUpperCase()}. संबंधित ऑपरेशन्स उपलब्ध आहेत:`
            : currentLang === 'hi'
            ? `भूमिका बदली: ${newRole.toUpperCase()}. संबंधित ऑपरेशन्स उपलब्ध हैं:`
            : `Switched perspective to ${newRole.toUpperCase()}. Operations loaded:`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        workflow: welcome.workflow,
      },
    ]);
  };

  const handleLangChange = (newLang: Language) => {
    setCurrentLang(newLang);
  };

  const handleToggleSound = () => {
    if (soundEnabled) {
      stopSpeaking();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      speakText('Voice output enabled', currentLang);
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    if (appPhase === 'onboarding') {
      setMessages([getInitialOnboardingMessage(currentLang)]);
    } else {
      const initialMsg = getInitialWelcome(currentRole, currentLang);
      setCentralUIState({
        activeComponent: initialMsg.workflow?.type || null,
        componentData: initialMsg.workflow?.data || null,
      });
      setMessages([initialMsg]);
    }
  };

  const handleComponentChange = (
    component: ActiveComponentType | string,
    data?: any
  ) => {
    setCentralUIState({
      activeComponent: component,
      componentData: data || null,
    });
  };

  // When KYC onboarding completes, transition to main conversational app
  const handleCompleteOnboarding = async (
    role: SupportedRole,
    kycStatus: KycStatus,
    details: Record<string, any>
  ) => {
    const uid = userProfile.id || auth.currentUser?.uid || `USR-${Date.now()}`;
    const name =
      details.name ||
      details.collectorName ||
      details.facilityName ||
      details.officerName ||
      'Verified User';
    const location =
      details.address ||
      details.ward ||
      details.facilityLocation ||
      details.jurisdiction ||
      'Pune, Maharashtra';

    setUserProfile((prev) => ({
      ...prev,
      id: uid,
      name,
      role,
      verificationStatus: kycStatus,
      kycStatus,
      location,
      kycDetails: details,
      onboarded: true,
    }));

    // Save exact user document in Firestore users collection
    try {
      await saveUserProfile({
        id: uid,
        name,
        phone: userProfile.phone || '+91 98220 14829',
        role,
        verificationStatus: kycStatus,
        language: currentLang,
        location,
        kycDetails: details,
      });
    } catch (e) {
      console.warn('Persist user profile notice:', e);
    }

    const mappedRole = mapSupportedRoleToUserRole(role);
    setCurrentRole(mappedRole);

    const timeNow = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const completionNotice = {
      mr: `अभिनंदन! तुमची ${role} म्हणून पडताळणी पूर्ण झाली आहे (${kycStatus}). KabadiGpt मुख्य सहाय्यक सक्रिय झाला आहे.`,
      hi: `बधाई हो! आपकी ${role} के रूप में सत्यापन प्रक्रिया पूर्ण हुई (${kycStatus})। KabadiGpt मुख्य सहायक सक्रिय है।`,
      en: `Congratulations! Your ${role} profile onboarding is complete (${kycStatus}). KabadiGpt circular assistant is now ready.`,
    }[currentLang];

    const welcomeMsg = getInitialWelcome(mappedRole, currentLang);

    setMessages((prev) => [
      ...prev,
      {
        id: `onboarding-done-${Date.now()}`,
        sender: 'ai',
        text: completionNotice,
        timestamp: timeNow,
      },
      welcomeMsg,
    ]);

    setAppPhase('main');

    if (soundEnabled) {
      speakText(completionNotice, currentLang);
    }
  };

  // Main message sender
  const handleSendMessage = (
    text: string,
    imageSrc?: string,
    isVoice?: boolean
  ) => {
    const timeNow = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessageType = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text || (imageSrc ? 'Uploaded scrap photo for AI inspection' : ''),
      timestamp: timeNow,
      imageAttachment: imageSrc,
      isVoice: !!isVoice,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // If currently in onboarding phase -> detect role first
    if (appPhase === 'onboarding') {
      setTimeout(() => {
        const detectedRole = detectUserRoleFromText(text);

        if (detectedRole) {
          const mappedRole = mapSupportedRoleToUserRole(detectedRole);
          setCurrentRole(mappedRole);
          setUserProfile((prev) => ({ ...prev, role: detectedRole }));

          const roleGreetings = {
            mr: `छान! तुम्ही "${detectedRole}" निवडले आहे. तुमच्या खात्याची पडताळणी पूर्ण करण्यासाठी खालील प्रोटोटाइप केवायसी फॉर्म तपासा:`,
            hi: `बहुत बढ़िया! आपने "${detectedRole}" चुना है। अपने खाते के सत्यापन हेतु नीचे दिया गया प्रोटोटाइप केवाईसी फॉर्म देखें:`,
            en: `Great! Detected role as "${detectedRole}". Complete the prototype onboarding and verification below:`,
          }[currentLang];

          const aiResponse: ChatMessageType = {
            id: `ai-role-${Date.now()}`,
            sender: 'ai',
            text: roleGreetings,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            onboardingRole: detectedRole,
          };

          setMessages((prev) => [...prev, aiResponse]);
          setIsProcessing(false);

          if (soundEnabled || isVoice) {
            speakText(roleGreetings, currentLang);
          }
        } else {
          // If role not clearly recognized
          const fallbackText = {
            mr: 'मला तुमची भूमिका समजली नाही. कृपया "मी घरातून कबाड विकतो", "मी कबाडीवाला आहे", "मी recycler आहे" किंवा "मी government officer आहे" यापैकी एक पर्याय टाइप करा किंवा खालील बटणावर टॅप करा.',
            hi: 'कृपया अपनी भूमिका स्पष्ट करें: "मैं घर से कबाड़ बेचता हूँ", "मैं कबाड़ीवाला हूँ", "मैं recycler हूँ" या "मैं government officer हूँ".',
            en: 'Please choose or type your role: "I sell scrap from household", "I am a kabadiwala", "I am a recycler", or "I am a government officer".',
          }[currentLang];

          const aiResponse: ChatMessageType = {
            id: `ai-retry-${Date.now()}`,
            sender: 'ai',
            text: fallbackText,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          setMessages((prev) => [...prev, aiResponse]);
          setIsProcessing(false);

          if (soundEnabled || isVoice) {
            speakText(fallbackText, currentLang);
          }
        }
      }, 500);
      return;
    }

    // Otherwise, in MAIN APP phase -> regular AI intent routing
    setTimeout(() => {
      const parsed = parseUserIntent(
        text,
        currentRole,
        currentLang,
        !!imageSrc,
        imageSrc
      );

      // Update central UI state whenever intent specifies an active component
      if (parsed.workflow) {
        setCentralUIState({
          activeComponent: parsed.workflow.type,
          componentData: parsed.workflow.data || null,
        });
      }

      const aiMsg: ChatMessageType = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: parsed.replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        workflow: parsed.workflow,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);

      if (soundEnabled || isVoice) {
        if (isVoice && !soundEnabled) {
          setSoundEnabled(true);
        }
        speakText(parsed.replyText, currentLang);
      }
    }, 450);
  };

  // 1. Initial Landing Screen
  if (appPhase === 'landing') {
    return (
      <LandingScreen
        lang={currentLang}
        onStartLogin={() => setAppPhase('login')}
        onSelectLanguage={handleLangChange}
        onDirectDemoRole={handleDirectDemoRole}
      />
    );
  }

  // 2. Phone Login Screen
  if (appPhase === 'login') {
    return (
      <PhoneLoginScreen
        lang={currentLang}
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setAppPhase('landing')}
        onSelectLanguage={handleLangChange}
      />
    );
  }

  // 3 & 4. Conversational Onboarding / Main Interface
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Bar Header */}
      <Header
        currentRole={currentRole}
        currentLang={currentLang}
        soundEnabled={soundEnabled}
        kycStatus={userProfile.onboarded ? userProfile.kycStatus : undefined}
        userPhone={userProfile.phone}
        onRoleChange={handleRoleChange}
        onLangChange={handleLangChange}
        onToggleSound={handleToggleSound}
        onResetChat={handleResetChat}
        onGoToLanding={() => setAppPhase('landing')}
      />

      {/* Main Conversational Stream Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 overflow-y-auto">
        {/* Suggested Prompts Section (shows role choices during onboarding, or normal prompts in main) */}
        <SuggestedPrompts
          role={currentRole}
          lang={currentLang}
          isOnboarding={appPhase === 'onboarding'}
          onSelectPrompt={(p) => handleSendMessage(p)}
        />

        {/* Message Thread */}
        <div className="space-y-4 my-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              lang={currentLang}
              onTriggerAction={(actionText) => handleSendMessage(actionText)}
              onComponentChange={handleComponentChange}
              onCompleteOnboarding={handleCompleteOnboarding}
            />
          ))}

          {/* AI Thinking animation */}
          {isProcessing && (
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Recycle className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-4 py-2.5 text-xs text-slate-500 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  {currentLang === 'mr'
                    ? 'KabadiGpt विचार करत आहे...'
                    : currentLang === 'hi'
                    ? 'KabadiGpt सोच रहा है...'
                    : 'KabadiGpt is understanding intent...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Fixed Ergonomic Chat Input Bar */}
      <ChatInput
        lang={currentLang}
        role={currentRole}
        isProcessing={isProcessing}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
