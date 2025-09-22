import { Theme } from './types';

export const MIUI_THEME: Theme = {
    name: "MIUI Dark",
    colors: {
        background: "#000000",
        displayBackground: "#000000",
        textPrimary: "#ffffff",
        textSecondary: "#a0a0a0",
        accent: "#ff9800",
        accentHover: "#fb8c00",
        buttonBackground: "#333333",
        buttonBackgroundHover: "#424242",
        buttonOperatorBackground: "#333333",
        buttonOperatorBackgroundHover: "#424242",
        buttonAdvancedBackground: "#333333",
        buttonAdvancedBackgroundHover: "#424242",
        buttonSpecial1Background: "#333333",
        buttonSpecial1BackgroundHover: "#424242",
        buttonSpecial2Background: "#ff9800",
        buttonSpecial2BackgroundHover: "#fb8c00",
    }
};

export const DEFAULT_THEME: Theme = MIUI_THEME;

export const PREDEFINED_THEMES: Theme[] = [
    MIUI_THEME,
    {
        name: "Midnight",
        colors: {
            background: "#0a0a0a",
            displayBackground: "rgba(30, 41, 59, 0.5)",
            textPrimary: "#ffffff",
            textSecondary: "#94a3b8",
            accent: "#22d3ee",
            accentHover: "#67e8f9",
            buttonBackground: "rgba(51, 65, 85, 0.8)",
            buttonBackgroundHover: "#334155",
            buttonOperatorBackground: "rgba(249, 115, 22, 0.8)",
            buttonOperatorBackgroundHover: "#f97316",
            buttonAdvancedBackground: "rgba(71, 85, 105, 0.8)",
            buttonAdvancedBackgroundHover: "#475569",
            buttonSpecial1Background: "rgba(239, 68, 68, 0.8)",
            buttonSpecial1BackgroundHover: "#ef4444",
            buttonSpecial2Background: "rgba(34, 197, 94, 0.8)",
            buttonSpecial2BackgroundHover: "#22c55e",
        }
    },
    {
        name: "Daylight",
        colors: {
            background: "#f1f5f9",
            displayBackground: "rgba(255, 255, 255, 0.5)",
            textPrimary: "#0f172a",
            textSecondary: "#475569",
            accent: "#0ea5e9",
            accentHover: "#38bdf8",
            buttonBackground: "#e2e8f0",
            buttonBackgroundHover: "#cbd5e1",
            buttonOperatorBackground: "#f59e0b",
            buttonOperatorBackgroundHover: "#facc15",
            buttonAdvancedBackground: "#d1d5db",
            buttonAdvancedBackgroundHover: "#9ca3af",
            buttonSpecial1Background: "#ef4444",
            buttonSpecial1BackgroundHover: "#f87171",
            buttonSpecial2Background: "#22c55e",
            buttonSpecial2BackgroundHover: "#4ade80",
        }
    },
    {
        name: "Material You",
        colors: {
            background: "#f7f9fc",
            displayBackground: "rgba(224, 228, 235, 0.6)",
            textPrimary: "#1f1f1f",
            textSecondary: "#5f6368",
            accent: "#8ab4f8",
            accentHover: "#a1c2fa",
            buttonBackground: "#e8eaed",
            buttonBackgroundHover: "#dadce0",
            buttonOperatorBackground: "#d2e3fc",
            buttonOperatorBackgroundHover: "#c1d3f0",
            buttonAdvancedBackground: "#e8eaed",
            buttonAdvancedBackgroundHover: "#dadce0",
            buttonSpecial1Background: "#fddde0",
            buttonSpecial1BackgroundHover: "#f7c9cd",
            buttonSpecial2Background: "#8ab4f8",
            buttonSpecial2BackgroundHover: "#a1c2fa",
        }
    },
    {
        name: "Material You (Dark)",
        colors: {
            background: "#1c1b1f",
            displayBackground: "rgba(45, 43, 49, 0.7)",
            textPrimary: "#e6e1e5",
            textSecondary: "#938f94",
            accent: "#d0bcff",
            accentHover: "#eaddff",
            buttonBackground: "#484649",
            buttonBackgroundHover: "#504e51",
            buttonOperatorBackground: "#635c70",
            buttonOperatorBackgroundHover: "#6b6478",
            buttonAdvancedBackground: "#484649",
            buttonAdvancedBackgroundHover: "#504e51",
            buttonSpecial1Background: "#8c1d18",
            buttonSpecial1BackgroundHover: "#9e2f29",
            buttonSpecial2Background: "#4a4458",
            buttonSpecial2BackgroundHover: "#524c60",
        }
    },
    {
        name: "Terminal",
        colors: {
            background: "#000000",
            displayBackground: "rgba(20, 20, 20, 0.8)",
            textPrimary: "#34d399",
            textSecondary: "#059669",
            accent: "#a3e635",
            accentHover: "#bef264",
            buttonBackground: "#1f2937",
            buttonBackgroundHover: "#374151",
            buttonOperatorBackground: "#1f2937",
            buttonOperatorBackgroundHover: "#374151",
            buttonAdvancedBackground: "#1f2937",
            buttonAdvancedBackgroundHover: "#374151",
            buttonSpecial1Background: "#1f2937",
            buttonSpecial1BackgroundHover: "#374151",
            buttonSpecial2Background: "#1f2937",
            buttonSpecial2BackgroundHover: "#374151",
        }
    }
];