import { getSettings, saveSettings as saveSettingsRepository } from "@/services/settingsRepository";
import { Settings } from "@/types/settings";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SettingsContextType = {
    settings: Settings | null;
    saveSettings: (value: Settings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export default function SettingsProvider({ children }: {children: ReactNode}){

    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        (async () => {
            const res = await getSettings();

            setSettings(res);
        })()
    }, []);

      async function saveSettings(value: Settings) {
        await saveSettingsRepository(value);
        setSettings(value);
      }

    return (
        <SettingsContext.Provider value={{settings, saveSettings}}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if(!context){
        throw new Error("useSettings must be used within a SettingsProvider.")
    }

    return context;
}