import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es';

const THEME_KEY = 'enterprise_admin_theme';
const LANG_KEY = 'enterprise_admin_lang';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private themeSignal = signal<Theme>(this.getStoredTheme());
  private langSignal = signal<Language>(this.getStoredLang());

    theme = this.themeSignal.asReadonly ();
    language = this.langSignal.asReadonly ();
    isDark = computed(() => this.themeSignal() === 'dark');

  setLanguage(lang: Language): void {
    this.langSignal.set(lang);
    localStorage.setItem(LANG_KEY, lang);
  }

  private getStoredTheme(): Theme {
    const t = localStorage.getItem(THEME_KEY);
    return (t === 'dark' || t === 'light') ? t : 'light';
  }

  private getStoredLang(): Language {
    const l = localStorage.getItem(LANG_KEY);
    return (l === 'es' || l === 'en') ? l : 'en';
  }

}
