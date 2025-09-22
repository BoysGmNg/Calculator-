import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HistoryItem, Theme } from './types';
import { calculateWithGemini } from './services/geminiService';
import Display from './components/Display';
import Keypad from './components/Keypad';
import { evaluate } from 'mathjs';
import ThemeCustomizer from './components/ThemeCustomizer';
import { PREDEFINED_THEMES, DEFAULT_THEME } from './themes';
import Converter from './components/Converter';

// FIX: Add SpeechRecognition types to the global window object to fix TypeScript errors.
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const App: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<string>('0');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGemini, setIsGemini] = useState<boolean>(false);
    const [isDegrees, setIsDegrees] = useState<boolean>(false);
    const [is2nd, setIs2nd] = useState<boolean>(false);
    const [showThemeCustomizer, setShowThemeCustomizer] = useState<boolean>(false);
    const [themeAnimationKey, setThemeAnimationKey] = useState(0);
    const [errorKey, setErrorKey] = useState(0);
    const [activeView, setActiveView] = useState<'calculator' | 'converter'>('calculator');
    const [isScientific, setIsScientific] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const recognitionRef = useRef<any>(null);

    const [customThemes, setCustomThemes] = useState<Theme[]>(() => {
        try {
            const saved = localStorage.getItem('calculator-custom-themes');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    });

    const [activeTheme, setActiveTheme] = useState<Theme>(() => {
        try {
            const allThemes = [...PREDEFINED_THEMES, ...customThemes];
            const savedName = localStorage.getItem('calculator-active-theme-name');
            const savedTheme = allThemes.find(t => t.name === savedName);
            return savedTheme || DEFAULT_THEME;
        } catch (error) {
            return DEFAULT_THEME;
        }
    });
    
    useEffect(() => {
        const root = document.documentElement;
        for (const [key, value] of Object.entries(activeTheme.colors)) {
            root.style.setProperty(`--color-${key}`, value);
        }
        document.body.style.backgroundColor = activeTheme.colors.background;
        
        try {
            if (activeTheme.name !== 'Custom') {
                localStorage.setItem('calculator-active-theme-name', activeTheme.name);
            }
        } catch (error) {
            console.error("Could not save active theme name to localStorage", error);
        }

    }, [activeTheme]);

    const setTheme = useCallback((newTheme: Theme) => {
        if (activeTheme.name === newTheme.name && newTheme.name !== 'Custom') {
            return;
        }
        setActiveTheme(newTheme);
        setThemeAnimationKey(k => k + 1);
    }, [activeTheme.name]);

    const saveCustomTheme = useCallback((theme: Theme) => {
        const newCustomThemes = [...customThemes.filter(t => t.name !== theme.name), theme];
        setCustomThemes(newCustomThemes);
        setActiveTheme(theme);
        try {
            localStorage.setItem('calculator-custom-themes', JSON.stringify(newCustomThemes));
        } catch (error) {
            console.error("Could not save custom themes to localStorage", error);
        }
    }, [customThemes]);

    const deleteCustomTheme = useCallback((themeName: string) => {
        const newCustomThemes = customThemes.filter(t => t.name !== themeName);
        setCustomThemes(newCustomThemes);
        if (activeTheme.name === themeName) {
            setActiveTheme(DEFAULT_THEME);
        }
        try {
            localStorage.setItem('calculator-custom-themes', JSON.stringify(newCustomThemes));
        } catch (error) {
            console.error("Could not save custom themes to localStorage", error);
        }
    }, [customThemes, activeTheme.name]);


    const handleClear = useCallback(() => {
        setInput('');
        setResult('0');
        setIsGemini(false);
    }, []);

    const handleCalculate = useCallback(async () => {
        if (!input) return;
        setIsLoading(true);
        setResult('');
        try {
            let expression = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi');
            expression = expression.replace(/lg\(/g, 'log10(').replace(/ln\(/g, 'log(');
            
            const scope = isDegrees ? {
                sin: (x: number) => Math.sin(x * Math.PI / 180),
                cos: (x: number) => Math.cos(x * Math.PI / 180),
                tan: (x: number) => Math.tan(x * Math.PI / 180),
                asin: (x: number) => Math.asin(x) * 180 / Math.PI,
                acos: (x: number) => Math.acos(x) * 180 / Math.PI,
                atan: (x: number) => Math.atan(x) * 180 / Math.PI,
            } : {};

            const mathResult = evaluate(expression, scope);
            const formattedResult = Number(mathResult.toFixed(10)).toString();
            setResult(formattedResult);
            setHistory(prev => [{ input, result: formattedResult, date: new Date() }, ...prev].slice(0, 20));
            setInput(formattedResult);
            setIsGemini(false);
        } catch (error) {
            try {
                const geminiResult = await calculateWithGemini(input);
                if (geminiResult && geminiResult.result !== "Error") {
                    setResult(geminiResult.result);
                    setHistory(prev => [{ input, result: geminiResult.result, date: new Date() }, ...prev].slice(0, 20));
                    setInput(geminiResult.result);
                    setIsGemini(true);
                } else {
                    setResult('Error');
                    setInput('');
                    setErrorKey(k => k + 1);
                }
            } catch (apiError) {
                console.error("Gemini API Error:", apiError);
                setResult('API Error');
                setInput('');
                setErrorKey(k => k + 1);
            }
        } finally {
            setIsLoading(false);
        }
    }, [input, isDegrees]);

    const handleMicClick = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported by your browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = 'en-US'; // Set to English for better accuracy
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
             if (event.error !== 'aborted') {
               alert(`Speech recognition error: ${event.error}`);
            }
            setIsListening(false);
            recognitionRef.current = null;
        };

        recognition.onresult = (event: any) => {
            let transcript = event.results[0][0].transcript.toLowerCase();

            // Replace spoken numbers, operators, and common misinterpretations with symbols
            transcript = transcript
                .replace(/\b(one|won)\b/gi, '1')
                .replace(/\b(two|to|too)\b/gi, '2')
                .replace(/\bthree\b/gi, '3')
                .replace(/\b(four|for)\b/gi, '4')
                .replace(/\bfive\b/gi, '5')
                .replace(/\bsix\b/gi, '6')
                .replace(/\bseven\b/gi, '7')
                .replace(/\beight\b/gi, '8')
                .replace(/\bnine\b/gi, '9')
                .replace(/\bzero\b/gi, '0')
                .replace(/\b(plus|add)\b/gi, '+')
                .replace(/\b(minus|subtract)\b/gi, '-')
                .replace(/\b(times|multiply|multiplied by)\b/gi, '*')
                .replace(/\b(divided by|divide|over)\b/gi, '/')
                .replace(/\b(point|dot)\b/gi, '.')
                .replace(/\bx\b/gi, '*') // 'x' for multiplication
                .replace(/\b(power|to the power of)\b/gi, '^')
                .replace(/\bopen parenthesis\b/gi, '(')
                .replace(/\bclose parenthesis\b/gi, ')');
                
            // Remove all characters that are not part of a valid calculation
            // This ensures that only numbers and operators are kept, as requested.
            const sanitizedTranscript = transcript.replace(/[^0-9+\-*/^().]/g, '');
                
            setInput(prev => prev + sanitizedTranscript);
        };

        recognition.start();
    }, [isListening]);

    const handleButtonClick = useCallback((value: string) => {
        if (isLoading) return;

        const functions: { [key: string]: string } = {
            'sin': is2nd ? 'asin(' : 'sin(',
            'cos': is2nd ? 'acos(' : 'cos(',
            'tan': is2nd ? 'atan(' : 'tan(',
            'lg': is2nd ? '10^' : 'lg(',
            'ln': is2nd ? 'e^' : 'ln(',
            '√': is2nd ? '^2' : 'sqrt(',
        };

        if (functions[value]) {
            setInput(prev => prev + functions[value]);
            return;
        }

        switch (value) {
            case 'AC': handleClear(); break;
            case '=': handleCalculate(); break;
            case '(': setInput(prev => prev + '('); break;
            case ')': setInput(prev => prev + ')'); break;
            case 'Deg': setIsDegrees(prev => !prev); break;
            case '2nd': setIs2nd(prev => !prev); break;
            case 'x^y': setInput(prev => prev + '^'); break;
            case '!': setInput(prev => prev + '!'); break;
            case '1/x': setInput(prev => prev + '1/'); break;
            case 'e': setInput(prev => prev + 'e'); break;
            case 'π': setInput(prev => prev + 'π'); break;
            case 'MIC': handleMicClick(); break;
            case 'DEL': setInput(prev => prev.slice(0, -1)); break;
            default:
                if (result !== '0' && input === result && !['+', '-', '×', '÷', '%', '^'].includes(value)) {
                    setInput(value);
                } else {
                    setInput(prev => prev + value);
                }
                break;
        }
    }, [isLoading, handleClear, handleCalculate, result, input, is2nd, handleMicClick]);

    const handleHistoryClick = useCallback((value: string) => {
        setInput(value);
        setResult(value);
        setIsGemini(false);
    }, []);
    
    const allThemes = [...PREDEFINED_THEMES, ...customThemes];

    return (
        <div className="min-h-screen bg-[--color-background] text-[--color-textPrimary] flex items-center justify-center p-2 font-sans transition-colors duration-300">
             <style>{`
                @keyframes theme-scale-in {
                    from { transform: scale(0.98); opacity: 0.8; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-theme-change {
                    animation: theme-scale-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
            `}</style>
            <div className="w-full max-w-sm mx-auto relative">
                <div key={themeAnimationKey} className="animate-theme-change bg-[--color-displayBackground]/50 backdrop-blur-xl rounded-3xl p-4 shadow-2xl shadow-black/20">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveView('calculator')}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${activeView === 'calculator' ? 'bg-[--color-accent] text-[--color-background]' : 'text-[--color-textSecondary] hover:text-[--color-textPrimary]'}`}
                                aria-pressed={activeView === 'calculator'}
                            >
                                Calculator
                            </button>
                            <button
                                onClick={() => setActiveView('converter')}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${activeView === 'converter' ? 'bg-[--color-accent] text-[--color-background]' : 'text-[--color-textSecondary] hover:text-[--color-textPrimary]'}`}
                                aria-pressed={activeView === 'converter'}
                            >
                                Converter
                            </button>
                        </div>
                        <button
                            onClick={() => setShowThemeCustomizer(prev => !prev)}
                            className="p-2 rounded-full text-[--color-textSecondary] hover:text-[--color-textPrimary] transition-colors"
                            aria-label="Customize theme"
                            aria-expanded={showThemeCustomizer}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" />
                            </svg>
                        </button>
                    </div>

                    <ThemeCustomizer
                        show={showThemeCustomizer}
                        activeTheme={activeTheme}
                        setTheme={setTheme}
                        allThemes={allThemes}
                        onSaveTheme={saveCustomTheme}
                        onDeleteTheme={deleteCustomTheme}
                    />

                    {activeView === 'calculator' ? (
                        <>
                            <Display
                                input={input}
                                result={result}
                                isLoading={isLoading}
                                isGemini={isGemini}
                                errorKey={errorKey}
                                history={history}
                                onHistoryClick={handleHistoryClick}
                                isScientific={isScientific}
                                onToggleScientific={() => setIsScientific(p => !p)}
                            />
                            <Keypad
                                onButtonClick={handleButtonClick}
                                isDegrees={isDegrees}
                                is2nd={is2nd}
                                isScientific={isScientific}
                                isListening={isListening}
                            />
                        </>
                    ) : (
                        <Converter />
                    )}
                </div>

            </div>
        </div>
    );
};

export default App;