export interface HistoryItem {
  input: string;
  result: string;
  date: Date;
}

export interface GeminiResponse {
    result: string;
    explanation: string;
}

export interface ThemeColors {
    background: string;
    displayBackground: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    // Button backgrounds
    buttonBackground: string;
    buttonBackgroundHover: string;
    buttonOperatorBackground: string;
    buttonOperatorBackgroundHover: string;
    buttonAdvancedBackground: string;
    buttonAdvancedBackgroundHover: string;
    buttonSpecial1Background: string; // AC
    buttonSpecial1BackgroundHover: string;
    buttonSpecial2Background: string; // =
    buttonSpecial2BackgroundHover: string;
}

export interface Theme {
    name: string;
    colors: ThemeColors;
}

// --- Converter Types ---
export interface Unit {
    name: string;
    symbol: string;
    toBase: (value: number) => number;
    fromBase: (value: number) => number;
}

export interface ConversionCategory {
    name: string;
    baseUnit: string;
    units: Unit[];
}

export type Categories = {
    [key: string]: ConversionCategory;
};
