export const colors = {
  light: {
    bg: "#EAE0CC",
    btn: "#856A5D",
    clr: "#B6AE9F",
    text: "#1a1a1a",
    border: "#ffffff",
    err: "#960200",
    ac: "#A2FAA3",
  },
  dark: {
    bg: "#171614",
    btn: "#312F2F",
    clr: "#393E41",
    text: "#e8e8e8",
    border: "#ffffff",
    err: "#ff4d4d",
    ac: "#A2FAA3",
  },
} as const;

export type ColorTheme = keyof typeof colors;
export type ColorKey = keyof (typeof colors)["light"];

export function applyTheme(theme: ColorTheme) {
  const root = document.documentElement.style;
  const palette = colors[theme];
  for (const [key, value] of Object.entries(palette)) {
    root.setProperty(`--${key}`, value);
  }
  root.setProperty("--text", palette.text);
}
