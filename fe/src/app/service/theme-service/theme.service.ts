import {Injectable} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {BehaviorSubject, Observable, Observer, Subject} from 'rxjs';

/*
.theme-deeppurple-amber
.theme-indigo-pink
.theme-pink-bluegrey
.theme-purple-green
 */

export enum Themes {
  THEME_DEEPPURPLE_AMBER_LIGHT      = 'deeppurple_amber_light' as any,
  THEME_DEEPPURPLE_AMBER_DARK       = 'deeppurple_amber_dark' as any,
  THEME_INDIGO_PINK_LIGHT           = 'indigo_pink_light' as any,
  THEME_INDIGO_PINK_DARK            = 'indigo_pink_dark' as any,
  THEME_PINK_BLUEGREY_LIGHT         = 'pink_bluegrey_light' as any,
  THEME_PINK_BLUEGREY_DARK          = 'pink_bluegrey_dark' as any,
  THEME_PURPLE_GREEN_LIGHT          = 'purple_green_light' as any,
  THEME_PURPLE_GREEN_DARK           = 'purple_green_dark' as any,
  THEME_INDIGO_LIGHTBLUE_LIGHT      = 'indigo_lightblue_light' as any,
  THEME_INDIGO_LIGHTBLUE_DARK       = 'indigo_lightblue_dark' as any
}

export interface Theme {
  cssClassName: string;
  theme: Themes;
  description: string;
}

export const ALL_THEMES: Theme[] = [
  {
    cssClassName: 'theme-deeppurple-amber-light',
    theme: Themes.THEME_DEEPPURPLE_AMBER_LIGHT,
    description: 'Deeppurple Amber Light Theme'
  } as Theme,
  {
    cssClassName: 'theme-deeppurple-amber-dark',
    theme: Themes.THEME_DEEPPURPLE_AMBER_DARK,
    description: 'Deeppurple Amber Dark Theme'
  } as Theme,
  {
    cssClassName: 'theme-indigo-pink-light',
    theme: Themes.THEME_INDIGO_PINK_LIGHT,
    description: 'Indigo Pink Light Theme'
  } as Theme,
  {
    cssClassName: 'theme-indigo-pink-dark',
    theme: Themes.THEME_INDIGO_PINK_DARK,
    description: 'Indigo Pink Dark Theme'
  } as Theme,
  {
    cssClassName: 'theme-pink-bluegrey-light',
    theme: Themes.THEME_PINK_BLUEGREY_LIGHT,
    description: 'Pink Bluegrey Light Theme'
  } as Theme,
  {
    cssClassName: 'theme-pink-bluegrey-dark',
    theme: Themes.THEME_PINK_BLUEGREY_DARK,
    description: 'Pink Bluegrey Dark Theme'
  } as Theme,
  {
    cssClassName: 'theme-purple-green-light',
    theme: Themes.THEME_PURPLE_GREEN_LIGHT,
    description: 'Purple Green Light Theme'
  } as Theme,
  {
    cssClassName: 'theme-purple-green-dark',
    theme: Themes.THEME_PURPLE_GREEN_DARK,
    description: 'Purple Green Dark Theme'
  } as Theme,
  {
    cssClassName: 'theme-indigo-lightblue-light',
    theme: Themes.THEME_INDIGO_LIGHTBLUE_LIGHT,
    description: 'Indigo Lightblue Light Theme'
  } as Theme,
  {
    cssClassName: 'theme-indigo-lightblue-dark',
    theme: Themes.THEME_INDIGO_LIGHTBLUE_DARK,
    description: 'Indigo Lightblue Dark Theme'
  } as Theme
];

const ALL_THEMES_MAP: Map<Themes, Theme> = new Map<Themes, Theme>( ALL_THEMES.map((t: Theme) => [t.theme, t] as [Themes, Theme]));

@Injectable()
export class ThemeService {

  private subject: BehaviorSubject<Theme>;

  constructor() {
    this.subject = new BehaviorSubject(ALL_THEMES_MAP.get(Themes.THEME_PINK_BLUEGREY_DARK));
  }

  allThemes(): Theme[] {
    return Array.from(ALL_THEMES_MAP.values());
  }

  setTheme(theme: Theme) {
    this.subject.next(theme);
  }

  observer(): Observable<Theme> {
    return this.subject.asObservable();
  }
}
