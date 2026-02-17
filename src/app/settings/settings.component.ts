import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, Theme, Language } from '../core/services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  readonly theme = this.settings.theme;
  readonly language = this.settings.language;

  constructor(readonly settings: SettingsService) {}


  setLanguage(lang: Language): void {
    this.settings.setLanguage(lang);
  }
}
