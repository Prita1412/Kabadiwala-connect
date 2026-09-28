import React from 'react';
import {
  Recycle,
  User,
  Volume2,
  Mic,
  Sparkles,
} from 'lucide-react';
import {
  ChatMessage as ChatMessageType,
  Language,
  ActiveComponentType,
  SupportedRole,
  KycStatus,
} from '../types';
import { speakText } from '../utils/speech';
import { DynamicWorkspace } from './DynamicWorkspace';
import { RoleOnboardingWorkflow } from './RoleOnboardingWorkflow';

interface ChatMessageProps {
  message: ChatMessageType;
  lang: Language;
  onTriggerAction: (actionText: string) => void;
  onComponentChange?: (component: ActiveComponentType | string, data?: any) => void;
  onCompleteOnboarding?: (role: SupportedRole, kycStatus: KycStatus, details: Record<string, any>) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  lang,
  onTriggerAction,
  onComponentChange,
  onCompleteOnboarding,
}) => {
  const isUser = message.sender === 'user';

  const handleSpeak = () => {
    speakText(message.text, lang);
  };

  return (
    <div
      className={`py-2 flex gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Bot Avatar on Left for AI */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
          <Recycle className="w-4 h-4" />
        </div>
      )}

      {/* Message Body & Embedded Workspace Card */}
      <div className={`max-w-[92%] sm:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* User image preview if user attached one */}
        {isUser && message.imageAttachment && (
          <div className="mb-2 flex justify-end">
            <img
              src={message.imageAttachment}
              alt="User upload"
              className="w-48 sm:w-60 h-36 sm:h-44 object-cover rounded-2xl border-2 border-emerald-500 shadow-sm"
            />
          </div>
        )}

        {/* Text bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
              : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
          }`}
        >
          {isUser && message.isVoice && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mb-1">
              <Mic className="w-3 h-3" />
              <span>Voice Note</span>
            </div>
          )}

          <div className="whitespace-pre-wrap font-sans">{message.text}</div>

          {/* Timestamp & Speak button on AI message */}
          <div
            className={`flex items-center gap-2 mt-1.5 text-[10px] ${
              isUser ? 'text-slate-400 justify-end' : 'text-slate-400 justify-start'
            }`}
          >
            <span>{message.timestamp}</span>
            {!isUser && (
              <button
                onClick={handleSpeak}
                className="hover:text-emerald-700 flex items-center gap-0.5 transition-colors p-0.5 cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-3 h-3" />
                <span>Listen</span>
              </button>
            )}
          </div>
        </div>

        {/* Conversational Role-based Onboarding KYC Card */}
        {message.onboardingRole && (
          <RoleOnboardingWorkflow
            role={message.onboardingRole}
            lang={lang}
            onComplete={(kycStatus, details) => {
              if (onCompleteOnboarding) {
                onCompleteOnboarding(message.onboardingRole!, kycStatus, details);
              }
            }}
          />
        )}

        {/* Dynamic Embedded Workspace Component rendered via dynamic UI rendering architecture */}
        {message.workflow && (
          <DynamicWorkspace
            activeComponent={message.workflow.type}
            componentData={message.workflow.data}
            lang={lang}
            onTriggerAction={onTriggerAction}
            onComponentChange={onComponentChange}
          />
        )}
      </div>

      {/* User Avatar on Right */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
