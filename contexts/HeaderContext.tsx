import { HeaderConfig } from "@/types";
import { createContext, ReactNode, SetStateAction, useContext, useState } from "react";

type HeaderContextType = {
    headerConfig: HeaderConfig | null;
    setHeaderConfig: React.Dispatch<SetStateAction<HeaderConfig | null>>
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export default function HeaderProvider({children}: {children: ReactNode}){

    const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null);

    return (
        <HeaderContext.Provider value={{headerConfig, setHeaderConfig}}>
            {children}
        </HeaderContext.Provider>
    )
}

export const useHeaderConfig = () => {
    const context = useContext(HeaderContext);

    if(!context){
        throw new Error("O hook useHeaderConfig deve ser usado dentro de um HeaderProvider")
    }

    return context;
}