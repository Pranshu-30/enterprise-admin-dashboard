import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

/**
 * Highlights inactive users (e.g. dimmed style). Use with [appInactiveUser]="user.isActive === false"
 */
@Directive({
  selector: '[appInactiveUser]',
  standalone: true,
})
export class InactiveUserDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input() set appInactiveUser(value: boolean) {
    this.isInactive = value === true;
    this.applyStyle();
  }

  private isInactive = false;

  ngOnInit(): void {
    this.applyStyle();
  }

  private applyStyle(): void {
    const native = this.el.nativeElement;
    if (this.isInactive) {
      native.classList.add('user-inactive');
      native.style.setProperty('opacity', '0.7');
    } else {
      native.classList.remove('user-inactive');
      native.style.removeProperty('opacity');
    }
  }
}
