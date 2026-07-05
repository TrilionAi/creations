/* Each post-it runs in its own webview window, so a module-level
 * flag is scoped per note. While shaded (rolled up to the title bar),
 * window resize events must not be persisted as the note's size. */
export const shadeState = { active: false };

/* Window height when rolled up: container padding (12) + title bar (40) + border (2) */
export const SHADE_HEIGHT = 54;
