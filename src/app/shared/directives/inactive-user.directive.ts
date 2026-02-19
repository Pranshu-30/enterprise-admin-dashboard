import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appInactiveUser]',
  standalone: true,
})
export class InactiveUserDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);

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
