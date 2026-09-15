import { ALIASES } from "./icon-aliases.ts";

export const resolveIcon = (icon: string) =>
  icon
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => ALIASES[token] ?? token)
    .join(" ");

export { ALIASES as iconAliases };
