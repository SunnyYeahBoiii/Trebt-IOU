import { useEffect, useRef, useState } from "react";


export function ThemeSwitch() {
    const [isDarkTheme , setTheme] = useState<boolean>(false);
    const innerButtonRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        console.log(isDarkTheme)
        if(isDarkTheme){
            document.documentElement.style.setProperty('--bg' , 'var(--dark-bg)');
            document.documentElement.style.setProperty('--clr' , 'var(--dark-clr)');
            document.documentElement.style.setProperty('--btn' , 'var(--dark-btn)');
        }else{
            document.documentElement.style.setProperty('--bg' , 'var(--light-bg)');
            document.documentElement.style.setProperty('--clr' , 'var(--light-clr)');
            document.documentElement.style.setProperty('--btn' , 'var(--light-btn)');
        }
    } , [isDarkTheme])

    const handleChangeTheme = () => {
        setTheme(!isDarkTheme);
    }

    return (
        <div
            className="bg-[var(--bg)] w-18 h-10 rounded-full relative cursor-pointer items-center px-1 flex"
            onClick={() => handleChangeTheme()}
        >
        <div
            className={`bg-(--text) w-8 h-8 rounded-full transition-all duration-300 ${isDarkTheme ? "translate-x-0" : "translate-x-8"}`}
            ref={innerButtonRef}
        />
        </div>
    );
    }
