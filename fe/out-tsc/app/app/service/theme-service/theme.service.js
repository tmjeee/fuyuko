import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export var Themes;
(function (Themes) {
    Themes[Themes["THEME_DEEPPURPLE_AMBER_LIGHT"] = 'deeppurple_amber_light'] = "THEME_DEEPPURPLE_AMBER_LIGHT";
    Themes[Themes["THEME_DEEPPURPLE_AMBER_DARK"] = 'deeppurple_amber_dark'] = "THEME_DEEPPURPLE_AMBER_DARK";
    Themes[Themes["THEME_INDIGO_PINK_LIGHT"] = 'indigo_pink_light'] = "THEME_INDIGO_PINK_LIGHT";
    Themes[Themes["THEME_INDIGO_PINK_DARK"] = 'indigo_pink_dark'] = "THEME_INDIGO_PINK_DARK";
    Themes[Themes["THEME_PINK_BLUEGREY_LIGHT"] = 'pink_bluegrey_light'] = "THEME_PINK_BLUEGREY_LIGHT";
    Themes[Themes["THEME_PINK_BLUEGREY_DARK"] = 'pink_bluegrey_dark'] = "THEME_PINK_BLUEGREY_DARK";
    Themes[Themes["THEME_PURPLE_GREEN_LIGHT"] = 'purple_green_light'] = "THEME_PURPLE_GREEN_LIGHT";
    Themes[Themes["THEME_PURPLE_GREEN_DARK"] = 'purple_green_dark'] = "THEME_PURPLE_GREEN_DARK";
    Themes[Themes["THEME_INDIGO_LIGHTBLUE_LIGHT"] = 'indigo_lightblue_light'] = "THEME_INDIGO_LIGHTBLUE_LIGHT";
    Themes[Themes["THEME_INDIGO_LIGHTBLUE_DARK"] = 'indigo_lightblue_dark'] = "THEME_INDIGO_LIGHTBLUE_DARK";
})(Themes || (Themes = {}));
export const ALL_THEMES = [
    {
        cssClassName: 'theme-deeppurple-amber-light',
        theme: Themes.THEME_DEEPPURPLE_AMBER_LIGHT,
        description: 'Deeppurple Amber Light Theme'
    },
    {
        cssClassName: 'theme-deeppurple-amber-dark',
        theme: Themes.THEME_DEEPPURPLE_AMBER_DARK,
        description: 'Deeppurple Amber Dark Theme'
    },
    {
        cssClassName: 'theme-indigo-pink-light',
        theme: Themes.THEME_INDIGO_PINK_LIGHT,
        description: 'Indigo Pink Light Theme'
    },
    {
        cssClassName: 'theme-indigo-pink-dark',
        theme: Themes.THEME_INDIGO_PINK_DARK,
        description: 'Indigo Pink Dark Theme'
    },
    {
        cssClassName: 'theme-pink-bluegrey-light',
        theme: Themes.THEME_PINK_BLUEGREY_LIGHT,
        description: 'Pink Bluegrey Light Theme'
    },
    {
        cssClassName: 'theme-pink-bluegrey-dark',
        theme: Themes.THEME_PINK_BLUEGREY_DARK,
        description: 'Pink Bluegrey Dark Theme'
    },
    {
        cssClassName: 'theme-purple-green-light',
        theme: Themes.THEME_PURPLE_GREEN_LIGHT,
        description: 'Purple Green Light Theme'
    },
    {
        cssClassName: 'theme-purple-green-dark',
        theme: Themes.THEME_PURPLE_GREEN_DARK,
        description: 'Purple Green Dark Theme'
    },
    {
        cssClassName: 'theme-indigo-lightblue-light',
        theme: Themes.THEME_INDIGO_LIGHTBLUE_LIGHT,
        description: 'Indigo Lightblue Light Theme'
    },
    {
        cssClassName: 'theme-indigo-lightblue-dark',
        theme: Themes.THEME_INDIGO_LIGHTBLUE_DARK,
        description: 'Indigo Lightblue Dark Theme'
    }
];
const ALL_THEMES_MAP = new Map(ALL_THEMES.map((t) => [t.theme, t]));
let ThemeService = class ThemeService {
    constructor() {
        this.subject = new BehaviorSubject(ALL_THEMES_MAP.get(Themes.THEME_PINK_BLUEGREY_DARK));
    }
    allThemes() {
        return Array.from(ALL_THEMES_MAP.values());
    }
    setTheme(theme) {
        if (theme) {
            if (typeof theme === 'string') {
                const t = ALL_THEMES.find((t) => t.theme.toString() === theme);
                if (t) {
                    this.subject.next(t);
                }
            }
            else {
                this.subject.next(theme);
            }
        }
    }
    observer() {
        return this.subject.asObservable();
    }
};
ThemeService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], ThemeService);
export { ThemeService };
//# sourceMappingURL=theme.service.js.map