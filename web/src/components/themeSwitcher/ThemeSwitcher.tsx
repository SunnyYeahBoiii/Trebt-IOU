import { useEffect, useState } from "react";


export function ThemeSwitch() {
    const [isLightTheme , setTheme] = useState<boolean>(localStorage.getItem('isLightTheme') !== '0');

    useEffect(() => {
        if(!isLightTheme){
            document.documentElement.style.setProperty('--bg' , 'var(--dark-bg)');
            document.documentElement.style.setProperty('--clr' , 'var(--dark-clr)');
            document.documentElement.style.setProperty('--btn' , 'var(--dark-btn)');
            localStorage.setItem('isLightTheme' , '0');
        }else{
            document.documentElement.style.setProperty('--bg' , 'var(--light-bg)');
            document.documentElement.style.setProperty('--clr' , 'var(--light-clr)');
            document.documentElement.style.setProperty('--btn' , 'var(--light-btn)');
            localStorage.setItem('isLightTheme' , '1');
        }
    } , [isLightTheme])

    return (
        <div
            className="bg-(--bg) w-18 h-10 rounded-full cursor-pointer flex items-center px-1"
            onClick={() => setTheme(!isLightTheme)}
        >
        <div
            className={`bg-(--text) w-8 h-8 rounded-full transition-all duration-300 ${isLightTheme ? "translate-x-0" : "translate-x-8"}`}
        />
        </div>
    );
}
