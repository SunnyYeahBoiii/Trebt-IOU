import { useEffect, useState } from "react";
import { applyTheme } from "../../tokens";
import { Button } from "../../ui";

export function ThemeSwitch() {
    const [isLightTheme, setTheme] = useState<boolean>(
        localStorage.getItem('isLightTheme') !== '0'
    );

    useEffect(() => {
        if (!isLightTheme) {
            applyTheme('dark');
            localStorage.setItem('isLightTheme', '0');
        } else {
            applyTheme('light');
            localStorage.setItem('isLightTheme', '1');
        }
    }, [isLightTheme]);

    // Apply theme on mount
    useEffect(() => {
        applyTheme(isLightTheme ? 'light' : 'dark');
    }, []);

    return (
        <Button
            variant="ghost"
            onClick={() => setTheme(!isLightTheme)}
            className="w-18 h-10 rounded-full px-1"
        >
            <div
                className={`bg-(--text) w-8 h-8 rounded-full transition-all duration-300 ${
                    isLightTheme ? "translate-x-0" : "translate-x-8"
                }`}
            />
        </Button>
    );
}
