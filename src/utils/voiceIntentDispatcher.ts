import { Language } from '../types';

export type VoiceFormField = 'address' | 'weight' | 'kycProof';
export interface VoiceFormUpdate {
  id: number;
  field: VoiceFormField;
  value: string | number;
}
export interface TargetedVoiceFormUpdate extends VoiceFormUpdate {
  targetMessageId: string;
}
export type VoiceIntent =
  | { type: 'UPDATE_FORM_FIELD'; field: VoiceFormField; value: string | number; cleanedText: string }
  | { type: 'NO_FORM_UPDATE'; cleanedText: string };

const normalizeSpaces = (value: string) => value.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim();

/**
 * Normalize recognizer noise without translating proper nouns. Preserve Devanagari and Hinglish names,
 * and canonicalize frequent command spellings before they reach the intent model.
 */
export function cleanSpeechTranscript(input: string): string {
  let value = normalizeSpaces(input || '').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  const commandMappings: Array<[RegExp, string]> = [
    [/\b(dash?board|dash board)\s+(dakva|dakhva|dakhwa|dikha|dikhao)\b/gi, 'show dashboard'],
    [/\b(request|pickup)\s+(accept|aksept)\s+(kar|karo|kru|kara)\b/gi, 'accept request'],
    [/\b(kyc)\s+(complete|purn|purna)\s+(kar|karo|kara)\b/gi, 'complete kyc'],
    [/\b(kasa|kashi)\s+(aahes|ahes|aahat)\b/gi, 'kasa aahes'],
    [/\b(request|pickup)\s+(accept|aksept)\s+(kar|karo|kru|kara)\b/gi, 'accept request'],
    [/\b(accept|aksept)\s+(request|pickup)\s+(kar|karo|kru|kara)\b/gi, 'accept request'],
    [/\b(dashboard|dash board)\s+(dakhva|dakva|dakhwa|dikha|dikhao)\b/gi, 'show dashboard'],
    [/\bkyc\s+(complete|purn|purna)\s+(kar|karo|kara)\b/gi, 'complete kyc'],
  ];
  for (const [pattern, replacement] of commandMappings) value = value.replace(pattern, replacement);
  return normalizeSpaces(value);
}

const stripTrailingFillers = (value: string) => value
  .replace(/\s+(?:tak|thak|daal do|dal do|लिख दो|लिखो|टाक|टाका|तक|द्या|करा|कर|please|now)$/i, '')
  .replace(/^[\s,:;.-]+|[\s,:;.!?-]+$/g, '')
  .trim();

/** Extract a deterministic form slot before making any LLM/API request. */
export function dispatchVoiceIntent(input: string, lang: Language): VoiceIntent {
  const cleanedText = cleanSpeechTranscript(input);
  const value = cleanedText.toLowerCase();

  // Field phrase must be present: this prevents proper nouns in ordinary chat from autofilling forms.
  const addressMatch = cleanedText.match(/(?:doorstep\s+address|pickup\s+address|residential\s+address|address|pickup\s+ka\s+address|ghar\s+ka\s+(?:address|pata)|pata|pataa|पिकअप\s+पता|घर\s+का\s+पता|पता|पत्ता|राहण्याचा\s+पत्ता|पिकअप\s+पत्ता)\s*(?:is|to|at|:|-)?\s*(.+)$/i);
  if (addressMatch?.[1]) {
    const address = stripTrailingFillers(addressMatch[1]);
    if (address.length >= 2 && !/^(?:please|update|change|set|करा|दाखवा)$/i.test(address)) {
      return { type: 'UPDATE_FORM_FIELD', field: 'address', value: address, cleanedText };
    }
  }

  // Hinglish and native-language weight updates: “weight 12 kg”, “12 kilo weight”.
  const weightMatch = value.match(/(?:weight|wajan|vajan|tolai|वजन|तौल|वज़न)\s*(?:is|to|at|:)?\s*(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilo|kilos|किलो|किग्रा)?|(?:^|\s)(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilo|kilos|किलो|किग्रा)\s*(?:weight|wajan|vajan|वजन|तौल)?/i);
  const weightValue = weightMatch ? Number(weightMatch[1] || weightMatch[2]) : NaN;
  if (Number.isFinite(weightValue) && weightValue > 0 && weightValue <= 5000 && /weight|wajan|vajan|tolai|वजन|तौल|वज़न|\bkg\b|kilo|किलो|किग्रा/i.test(value)) {
    return { type: 'UPDATE_FORM_FIELD', field: 'weight', value: weightValue, cleanedText };
  }

  const proofMatch = cleanedText.match(/(?:kyc\s+)?(?:proof|document|doc|पुरावा|दस्तावेज़|दस्तावेज|कागदपत्र)\s*(?:is|to|as|:)?\s*(.+)$/i);
  if (proofMatch?.[1]) {
    const spoken = stripTrailingFillers(proofMatch[1]).toLowerCase();
    const proofValue = /aadhaar|aadhar|आधार/i.test(spoken)
      ? 'Aadhaar Masked Simulation'
      : /noc|society|सोसायटी/i.test(spoken)
        ? 'Housing Society NOC'
        : /electric|bill|वीज|बिल/i.test(spoken)
          ? 'Electricity Bill / Address Proof'
          : stripTrailingFillers(proofMatch[1]);
    if (proofValue) return { type: 'UPDATE_FORM_FIELD', field: 'kycProof', value: proofValue, cleanedText };
  }

  return { type: 'NO_FORM_UPDATE', cleanedText };
}

export function voiceUpdateConfirmation(update: Pick<VoiceFormUpdate, 'field' | 'value'>, lang: Language): string {
  if (update.field === 'address') {
    return lang === 'mr' ? `पत्ता ${update.value} असा अपडेट केला.` : lang === 'hi' ? `पता ${update.value} अपडेट किया गया।` : `Address updated to ${update.value}.`;
  }
  if (update.field === 'weight') {
    return lang === 'mr' ? `अंदाजे वजन ${update.value} किलो असे अपडेट केले.` : lang === 'hi' ? `अनुमानित वजन ${update.value} किलो अपडेट किया गया।` : `Estimated weight updated to ${update.value} kg.`;
  }
  return lang === 'mr' ? 'KYC पुरावा प्रकार अपडेट केला.' : lang === 'hi' ? 'KYC प्रमाण दस्तावेज़ अपडेट किया गया।' : `KYC proof updated to ${update.value}.`;
}

export type VoiceWorkflowAction = 'ACCEPT_REQUEST' | 'NAVIGATE_DASHBOARD' | 'SUBMIT_KYC' | 'OPEN_KYC' | 'NONE';

export function dispatchVoiceWorkflowAction(input: string): VoiceWorkflowAction {
  const text = cleanSpeechTranscript(input).toLowerCase();
  if (/(?:complete|submit|finish|पूर्ण|समाप्त).{0,12}(?:kyc|केवायसी|केवाईसी)|(?:kyc|केवायसी|केवाईसी).{0,12}(?:complete|submit|finish|पूर्ण|समाप्त)|\bkyc complete\b/.test(text)) return 'SUBMIT_KYC';
  if (/(?:open|show|start|उघडा|दाखवा).{0,10}(?:kyc|केवायसी|केवाईसी)|(?:kyc|केवायसी|केवाईसी).{0,10}(?:open|दाखवा|उघडा)/.test(text)) return 'OPEN_KYC';
  if (/(?:accept|aksept|स्वीकार).{0,15}(?:request|pickup|विनंती|पिकअप)|(?:request|pickup|विनंती|पिकअप).{0,15}(?:accept|aksept|स्वीकार)/.test(text)) return 'ACCEPT_REQUEST';
  if (/(?:show|open|view|navigate|दाखव|दाखवा|उघडा).{0,15}(?:dashboard|डॅशबोर्ड)|(?:dashboard|डॅशबोर्ड).{0,15}(?:show|open|view|dakh|दाखव)/.test(text)) return 'NAVIGATE_DASHBOARD';
  return 'NONE';
}
