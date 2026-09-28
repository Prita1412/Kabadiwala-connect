import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on server side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Supported intents
export const SUPPORTED_INTENTS = [
  'VIEW_TODAY_REQUESTS',
  'VIEW_NEARBY_PICKUPS',
  'VIEW_PICKUP_DETAILS',
  'VIEW_FULL_DASHBOARD',
  'ACCEPT_PICKUP',
  'START_PICKUP',
  'RECORD_WEIGHT',
  'COMPLETE_PICKUP',
  'CREATE_RECEIPT',
  'VIEW_EARNINGS',
  'SELL_SCRAP',
  'CREATE_PICKUP_REQUEST',
  'TRACK_PICKUP',
  'CREATE_BATCH',
  'VIEW_BATCH',
  'RECEIVE_BATCH',
  'VIEW_TRACEABILITY',
  'VIEW_REGULATORY_ANALYTICS',
  'VIEW_FACILITY_RISK',
] as const;

export type SupportedIntent = typeof SUPPORTED_INTENTS[number];

// Mapping intents to DynamicWorkspace UI components
export const INTENT_UI_MAP: Record<SupportedIntent, string> = {
  VIEW_TODAY_REQUESTS: 'REQUEST_LIST',
  VIEW_NEARBY_PICKUPS: 'PICKUP_MAP',
  VIEW_PICKUP_DETAILS: 'PICKUP_DETAILS',
  VIEW_FULL_DASHBOARD: 'FULL_DASHBOARD',
  ACCEPT_PICKUP: 'REQUEST_LIST',
  START_PICKUP: 'PICKUP_MAP',
  RECORD_WEIGHT: 'DIGITAL_WEIGHING',
  COMPLETE_PICKUP: 'DIGITAL_WEIGHING',
  CREATE_RECEIPT: 'DIGITAL_RECEIPT',
  VIEW_EARNINGS: 'EARNINGS',
  SELL_SCRAP: 'SELL_SCRAP',
  CREATE_PICKUP_REQUEST: 'SELL_SCRAP',
  TRACK_PICKUP: 'TRACEABILITY',
  CREATE_BATCH: 'BATCH_CREATION',
  VIEW_BATCH: 'BATCH_DETAILS',
  RECEIVE_BATCH: 'BATCH_DETAILS',
  VIEW_TRACEABILITY: 'TRACEABILITY',
  VIEW_REGULATORY_ANALYTICS: 'REGULATORY_ANALYTICS',
  VIEW_FACILITY_RISK: 'REGULATORY_ANALYTICS',
};

// Semantic fallback for multilingual classification (Marathi, Hindi, English)
function semanticFallbackClassification(text: string, role?: string): {
  intent: SupportedIntent;
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
  uiComponent: string;
  replyText: string;
} {
  const t = (text || '').toLowerCase().trim();

  // 1. VIEW_TODAY_REQUESTS
  if (
    /आज|today|aaj|किती.*request|request.*किती|काम दाखव|kaam|work|kitne request|how many request|pending pickup|today pickup|आजचे pickup/i.test(t)
  ) {
    return {
      intent: 'VIEW_TODAY_REQUESTS',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'REQUEST_LIST',
      replyText: 'आजच्या प्रलंबित पिकअप विनंत्या खालीलप्रमाणे आहेत:',
    };
  }

  // 2. VIEW_NEARBY_PICKUPS
  if (
    /जवळचे|near|nearby|पास|आसपास|map|नकाशा|route|रूट|लोकेशन|location/i.test(t)
  ) {
    return {
      intent: 'VIEW_NEARBY_PICKUPS',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'PICKUP_MAP',
      replyText: 'तुमच्या जवळचे उपलब्ध पिकअप नकाशावर दर्शविले आहेत:',
    };
  }

  // 3. VIEW_EARNINGS
  if (
    /कमाई|earning|income|revenue|पैसे|रुपये|किती.*मिळाले|faida|munafa|daily payout/i.test(t)
  ) {
    return {
      intent: 'VIEW_EARNINGS',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'EARNINGS',
      replyText: 'तुमचा आजचा एकूण जमा आणि नफा सारांश खालीलप्रमाणे आहे:',
    };
  }

  // 4. SELL_SCRAP & CREATE_PICKUP_REQUEST
  if (
    /विकायचं|bechna|sell|scrap.*sell|कबाड|रद्दी|भंगार|paper.*sell|plastic.*sell|book pickup|pickup request|घरातून कबाड/i.test(t)
  ) {
    return {
      intent: 'SELL_SCRAP',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'SELL_SCRAP',
      replyText: 'घरोघरी स्क्रॅप पिकअपसाठी साहित्याची निवड करा आणि वेळ निश्चित करा:',
    };
  }

  // 5. VIEW_FULL_DASHBOARD
  if (
    /dashboard|डॅशबोर्ड|पूर्ण|full dashboard|overview|समग्र|summary/i.test(t)
  ) {
    return {
      intent: 'VIEW_FULL_DASHBOARD',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'FULL_DASHBOARD',
      replyText: 'संपूर्ण संकलन व प्रक्रिया डॅशबोर्ड सक्रिय केला आहे:',
    };
  }

  // 6. RECORD_WEIGHT & COMPLETE_PICKUP
  if (
    /वजन|weight|scale|weighing|काटा|तारा|ताकडी|किग्र|kg/i.test(t)
  ) {
    return {
      intent: 'RECORD_WEIGHT',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'DIGITAL_WEIGHING',
      replyText: 'डिजिटल वजन काटा स्क्रीन उघडली आहे. साहित्याची वर्गवारी नोंदवा:',
    };
  }

  // 7. CREATE_RECEIPT
  if (
    /पावती|receipt|बिल|bill|रसीद|invoice/i.test(t)
  ) {
    return {
      intent: 'CREATE_RECEIPT',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'DIGITAL_RECEIPT',
      replyText: 'डिजिटल वजन पावती आणि थेट यूपीआय पेमेंट स्क्रीन:',
    };
  }

  // 8. CREATE_BATCH & VIEW_BATCH
  if (
    /बॅच|batch|bale|गाठ|बंडल|bundle|dispatch|प्रेषण|मॅचिंग|recycler matching/i.test(t)
  ) {
    return {
      intent: 'CREATE_BATCH',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'BATCH_CREATION',
      replyText: 'नवीन बल्क स्क्रॅप बॅच तयार करा आणि थेट रिसायकलर दर मिळवा:',
    };
  }

  // 9. VIEW_TRACEABILITY & TRACK_PICKUP
  if (
    /traceability|ट्रेसेबिलिटी|ट्रॅक|track|manifest|साखळी|chain of custody|audit/i.test(t)
  ) {
    return {
      intent: 'VIEW_TRACEABILITY',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'TRACEABILITY',
      replyText: 'स्क्रॅप ते रिसायकलर डिजिटल ट्रेसेबिलिटी टाइमलाइन:',
    };
  }

  // 10. VIEW_REGULATORY_ANALYTICS & VIEW_FACILITY_RISK
  if (
    /regulatory|analytics|mpcb|cpcb|नियमन|शासकीय|compliance|landfill|लँडफिल|risk/i.test(t)
  ) {
    return {
      intent: 'VIEW_REGULATORY_ANALYTICS',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'REGULATORY_ANALYTICS',
      replyText: 'शासकीय व पर्यावरणीय अनुपालन विश्लेषण अहवाल:',
    };
  }

  // Default fallback depending on role
  if (role === 'household') {
    return {
      intent: 'SELL_SCRAP',
      parameters: {},
      requiresConfirmation: false,
      uiComponent: 'SELL_SCRAP',
      replyText: 'कबाड विक्रीसाठी खालील साहित्याची निवड करा:',
    };
  }

  return {
    intent: 'VIEW_TODAY_REQUESTS',
    parameters: {},
    requiresConfirmation: false,
    uiComponent: 'REQUEST_LIST',
    replyText: 'आजच्या पिकअप विनंत्या आणि कार्यसूची खालीलप्रमाणे आहे:',
  };
}

// Intent Router API endpoint
app.post('/api/intent-router', async (req: Request, res: Response) => {
  const { message, role, language } = req.body;
  const userText = (message || '').trim();
  const currentLang = language || 'mr';

  if (!userText) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // If Gemini SDK is available and has API key, classify semantically
  if (ai) {
    try {
      const systemInstruction = `You are the core Intent Router for KabadiGpt, a circular waste management and doorstep scrap pickup platform.
Your task is to classify natural-language user messages into one of the exact supported structured intents.

Supported intents:
- VIEW_TODAY_REQUESTS (e.g., "आज किती requests आहेत?", "आजचे pickup किती आहेत?", "माझं आजचं काम दाखव", "Show today requests")
- VIEW_NEARBY_PICKUPS (e.g., "माझ्या जवळचे pickup दाखव", "Show pickups near me", "Show route map")
- VIEW_PICKUP_DETAILS (e.g., "पिकअप तपशील दाखव", "Show details of customer Anand", "REQ-101")
- VIEW_FULL_DASHBOARD (e.g., "माझा पूर्ण dashboard दाखव", "Show full dashboard")
- ACCEPT_PICKUP (e.g., "मी हे काम स्वीकारतो", "Accept this pickup")
- START_PICKUP (e.g., "पिकअप सुरू करा", "Start traveling to pickup")
- RECORD_WEIGHT (e.g., "कचरा वजन करा", "Record scrap weight", "Open smart scale")
- COMPLETE_PICKUP (e.g., "पिकअप पूर्ण करा", "Mark pickup completed")
- CREATE_RECEIPT (e.g., "पावती बनवा", "Generate digital receipt", "Show bill")
- VIEW_EARNINGS (e.g., "माझी आजची कमाई किती?", "How much did I earn today?")
- SELL_SCRAP (e.g., "मला कबाड विकायचं आहे", "I want to sell scrap", "Sell old newspapers")
- CREATE_PICKUP_REQUEST (e.g., "नवीन पिकअप बुक करा", "Book doorstep scrap pickup")
- TRACK_PICKUP (e.g., "माझा पिकअप कुठे आहे?", "Track my scrap collection")
- CREATE_BATCH (e.g., "नवीन बॅच तयार करा", "Create scrap bale batch")
- VIEW_BATCH (e.g., "बॅच तपशील दाखवा", "View batch PUN-BAL-2026-842")
- RECEIVE_BATCH (e.g., "बॅच प्राप्त झाली", "Acknowledge batch delivery at mill")
- VIEW_TRACEABILITY (e.g., "ट्रेसेबिलिटी साखळी दाखवा", "Inspect circular traceability manifest")
- VIEW_REGULATORY_ANALYTICS (e.g., "नियामक विश्लेषण दाखव", "Show MPCB landfill diversion report")
- VIEW_FACILITY_RISK (e.g., "फॅसिलिटी रिस्क ऑडिट", "Inspect recycler facility risk and EPR credits")

CRITICAL RULES:
1. Understand Marathi (मराठी), Hindi (हिंदी), and English with high semantic accuracy.
2. DO NOT rely on exact phrase matching. Infer the intent semantically from the user's meaning.
3. Map every classified intent to its corresponding uiComponent:
   - VIEW_TODAY_REQUESTS -> "REQUEST_LIST"
   - VIEW_NEARBY_PICKUPS -> "PICKUP_MAP"
   - VIEW_PICKUP_DETAILS -> "PICKUP_DETAILS"
   - VIEW_FULL_DASHBOARD -> "FULL_DASHBOARD"
   - ACCEPT_PICKUP -> "REQUEST_LIST"
   - START_PICKUP -> "PICKUP_MAP"
   - RECORD_WEIGHT -> "DIGITAL_WEIGHING"
   - COMPLETE_PICKUP -> "DIGITAL_WEIGHING"
   - CREATE_RECEIPT -> "DIGITAL_RECEIPT"
   - VIEW_EARNINGS -> "EARNINGS"
   - SELL_SCRAP -> "SELL_SCRAP"
   - CREATE_PICKUP_REQUEST -> "SELL_SCRAP"
   - TRACK_PICKUP -> "TRACEABILITY"
   - CREATE_BATCH -> "BATCH_CREATION"
   - VIEW_BATCH -> "BATCH_DETAILS"
   - RECEIVE_BATCH -> "BATCH_DETAILS"
   - VIEW_TRACEABILITY -> "TRACEABILITY"
   - VIEW_REGULATORY_ANALYTICS -> "REGULATORY_ANALYTICS"
   - VIEW_FACILITY_RISK -> "REGULATORY_ANALYTICS"
4. Output valid JSON strictly conforming to the requested schema. Provide a helpful, natural bot replyText in the user's language (${currentLang}).`;

      const prompt = `User role: ${role || 'kabadiwala'}
User language: ${currentLang}
User message: "${userText}"

Classify into structured JSON:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: {
                type: Type.STRING,
                description: 'The classified structured intent name',
              },
              parameters: {
                type: Type.OBJECT,
                description: 'Extracted parameters from the message',
              },
              requiresConfirmation: {
                type: Type.BOOLEAN,
                description: 'Whether the action needs user confirmation before executing',
              },
              uiComponent: {
                type: Type.STRING,
                description: 'The DynamicWorkspace component key to render',
              },
              replyText: {
                type: Type.STRING,
                description: 'Natural, localized conversational reply in Marathi, Hindi, or English',
              },
            },
            required: ['intent', 'parameters', 'requiresConfirmation', 'uiComponent'],
          },
        },
      });

      const rawText = response.text?.trim() || '{}';
      const parsed = JSON.parse(rawText);

      // Verify that parsed intent is one of the supported intents
      let validIntent = parsed.intent;
      if (!SUPPORTED_INTENTS.includes(validIntent)) {
        // Find best match or fallback
        const match = SUPPORTED_INTENTS.find((i) => i.toLowerCase() === (validIntent || '').toLowerCase());
        validIntent = match || 'VIEW_TODAY_REQUESTS';
      }

      const uiComponent = INTENT_UI_MAP[validIntent as SupportedIntent] || parsed.uiComponent || 'REQUEST_LIST';

      return res.json({
        intent: validIntent,
        parameters: parsed.parameters || {},
        requiresConfirmation: !!parsed.requiresConfirmation,
        uiComponent,
        replyText: parsed.replyText || 'आपली विनंती प्रक्रिया केली आहे.',
      });
    } catch (err: any) {
      console.warn('Gemini intent classification notice, using semantic classifier fallback:', err?.message || err);
      const fallback = semanticFallbackClassification(userText, role);
      return res.json(fallback);
    }
  }

  // If Gemini API key not present, use semantic classifier
  const fallback = semanticFallbackClassification(userText, role);
  return res.json(fallback);
});

// Setup Vite dev server or static dist serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(port) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`KabadiGpt Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
