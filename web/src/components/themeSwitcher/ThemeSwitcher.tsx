import { useEffect, useState } from "react";
import { applyTheme } from "../../tokens";
import { Switch } from "../../ui";

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

    return (
        <Switch
            checked={!isLightTheme}
            onCheckedChange={(checked) => setTheme(!checked)}
            aria-label="Đổi giao diện sáng tối"
            title={isLightTheme ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
        />
    );
}
