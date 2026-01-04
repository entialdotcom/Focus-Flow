import { Mode, Quote } from '../types';

interface QuoteData {
  quotes: {
    quote: string;
    author: string;
    category: string;
  }[];
}

// Cache for loaded quotes
let innerPeaceQuotes: QuoteData | null = null;
let successWealthQuotes: QuoteData | null = null;

// Determine which quote file to use based on mode
const getQuoteFileForMode = (mode: Mode): 'inner_peace' | 'success_wealth' => {
  switch (mode) {
    case Mode.FOCUS:
    case Mode.MOTIVATION:
      return 'success_wealth';
    case Mode.RELAX:
    case Mode.MEDITATE:
    case Mode.SLEEP:
    default:
      return 'inner_peace';
  }
};

// Load quotes from JSON file
const loadQuotes = async (type: 'inner_peace' | 'success_wealth'): Promise<QuoteData> => {
  if (type === 'inner_peace' && innerPeaceQuotes) {
    return innerPeaceQuotes;
  }
  if (type === 'success_wealth' && successWealthQuotes) {
    return successWealthQuotes;
  }

  const filename = type === 'inner_peace'
    ? '/json/inner_peace_wisdom_quotes.json'
    : '/json/success_wealth_quotes.json';

  const response = await fetch(filename);
  const data: QuoteData = await response.json();

  if (type === 'inner_peace') {
    innerPeaceQuotes = data;
  } else {
    successWealthQuotes = data;
  }

  return data;
};

// Get a random quote for the given mode
export const getRandomQuote = async (mode: Mode): Promise<Quote> => {
  const quoteType = getQuoteFileForMode(mode);
  const data = await loadQuotes(quoteType);

  const randomIndex = Math.floor(Math.random() * data.quotes.length);
  const quoteItem = data.quotes[randomIndex];

  return {
    text: quoteItem.quote,
    author: quoteItem.author
  };
};

// Get the next quote (for cycling through quotes)
let lastQuoteIndex: Record<string, number> = {};

export const getNextQuote = async (mode: Mode): Promise<Quote> => {
  const quoteType = getQuoteFileForMode(mode);
  const data = await loadQuotes(quoteType);

  // Get next index, wrapping around
  const currentIndex = lastQuoteIndex[quoteType] ?? -1;
  const nextIndex = (currentIndex + 1) % data.quotes.length;
  lastQuoteIndex[quoteType] = nextIndex;

  const quoteItem = data.quotes[nextIndex];

  return {
    text: quoteItem.quote,
    author: quoteItem.author
  };
};
