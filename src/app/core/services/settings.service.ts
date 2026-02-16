import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es';

const THEME_KEY = 'enterprise_admin_theme';
const LANG_KEY = 'enterprise_admin_lang';

/**
 * App settings with BehaviorSubject-style state via signals. Persists theme in localStorage.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly themeSignal = signal<Theme>(this.getStoredTheme());
  private readonly langSignal = signal<Language>(this.getStoredLang());

  readonly theme = this.themeSignal.asReadonly();
  readonly language = this.langSignal.asReadonly();
  readonly isDark = computed(() => this.themeSignal() === 'dark');

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem(THEME_KEY, theme);
    this.applyThemeOnBody(theme);
  }

  setLanguage(lang: Language): void {
    this.langSignal.set(lang);
    localStorage.setItem(LANG_KEY, lang);
  }

  toggleTheme(): void {
    const next: Theme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  /** Call once at app init to apply stored theme to body */
  applyStoredTheme(): void {
    this.applyThemeOnBody(this.themeSignal());
  }

  private getStoredTheme(): Theme {
    const t = localStorage.getItem(THEME_KEY);
    return (t === 'dark' || t === 'light') ? t : 'light';
  }

  private getStoredLang(): Language {
    const l = localStorage.getItem(LANG_KEY);
    return (l === 'es' || l === 'en') ? l : 'en';
  }

  private applyThemeOnBody(theme: Theme): void {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  }
}
