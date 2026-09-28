import { SupportedRole } from '../types';

/**
 * Detect user role from natural language text
 * Supported roles:
 * - HOUSEHOLD ("मी घरातून कबाड विकतो", "household", "citizen", "घरगुती", "घरातून", "घर", "नागरिक")
 * - KABADIWALA ("मी कबाडीवाला आहे", "कबाडीवाला", "kabadiwala", "भंगारवाला", "रद्दीवाला", "scrap collector", "collector")
 * - RECYCLER ("मी recycler आहे", "recycler", "factory", "प्लास्टिक फॅक्टरी", "रिसायकलर", "b2b recycler")
 * - GOVERNMENT ("मी government officer आहे", "government", "officer", "mpcb", "cpcb", "मनपा", "शासकीय")
 */
export function detectUserRoleFromText(input: string): SupportedRole | null {
  const text = (input || '').toLowerCase().trim();

  // Government / Regulator
  if (
    text.includes('government') ||
    text.includes('officer') ||
    text.includes('शासकीय') ||
    text.includes('सरकारी') ||
    text.includes('शासन') ||
    text.includes('mpcb') ||
    text.includes('cpcb') ||
    text.includes('regulator') ||
    text.includes('मनपा') ||
    text.includes('अधिकारी') ||
    text.includes('regulatory')
  ) {
    return 'GOVERNMENT';
  }

  // Recycler
  if (
    text.includes('recycler') ||
    text.includes('रिसायकलर') ||
    text.includes('फॅक्टरी') ||
    text.includes('factory') ||
    text.includes('granules') ||
    text.includes('processing plant') ||
    text.includes('रीसाइक्लर') ||
    text.includes('रिसायकलिंग') ||
    text.includes('recycling plant')
  ) {
    return 'RECYCLER';
  }

  // Kabadiwala
  if (
    text.includes('कबाडीवाला') ||
    text.includes('कबाडी') ||
    text.includes('kabadiwala') ||
    text.includes('kabadi') ||
    text.includes('कबाड़ीवाला') ||
    text.includes('कबाड़ी') ||
    text.includes('भंगारवाला') ||
    text.includes('रद्दीवाला') ||
    text.includes('collector') ||
    text.includes('scrap dealer') ||
    text.includes('स्क्रॅप डीलर') ||
    text.includes('संकलक')
  ) {
    return 'KABADIWALA';
  }

  // Household
  if (
    text.includes('घरातून') ||
    text.includes('household') ||
    text.includes('विकतो') ||
    text.includes('विकायचं') ||
    text.includes('घरगुती') ||
    text.includes('citizen') ||
    text.includes('घरेलू') ||
    text.includes('कबाड विकायचं') ||
    text.includes('बेचना') ||
    text.includes('घर') ||
    text.includes('नागरिक') ||
    text.includes('कबाड़ बेचना') ||
    text.includes('scrap seller')
  ) {
    return 'HOUSEHOLD';
  }

  return null;
}
