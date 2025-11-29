import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFloatingTooltip]',
  standalone: true
})
export class FloatingTooltipDirective {
  @Input('appFloatingTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' | 'mouse' = 'top';
  @Input() tooltipOffset = 8;
  @Input() tooltipTrigger: 'hover' | 'click' = 'hover';
  @Input() tooltipDuration?: number | string;

  private tooltipEl?: HTMLElement;
  private arrowEl?: HTMLElement;
  private isVisible = false;
  private hideTimeout?: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.tooltipTrigger === 'hover') {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipTrigger === 'hover') {
      this.destroyTooltip();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.tooltipTrigger === 'click') {
      event.stopPropagation();
      if (this.isVisible) {
        this.destroyTooltip();
      } else {
        this.showTooltip();
      }
    }
  }

  // Fecha ao clicar fora (modo click)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.tooltipTrigger === 'click' &&
      this.isVisible &&
      this.tooltipEl &&
      !this.el.nativeElement.contains(event.target)
    ) {
      this.destroyTooltip();
    }
  }

  private showTooltip() {
    this.createTooltip();
    this.positionTooltip();
    this.isVisible = true;

    if (this.tooltipDuration && Number(this.tooltipDuration) > 0) {
      this.hideTimeout = setTimeout(
        () => this.destroyTooltip(),
        Number(this.tooltipDuration) * 1000
      );
    }
  }

  private createTooltip() {
    if (this.tooltipEl) return;

    const tooltip = this.renderer.createElement('div');
    this.renderer.addClass(tooltip, 'floating-tooltip');
    this.renderer.addClass(tooltip, `tooltip-${this.tooltipPosition}`);
    tooltip.innerText = this.tooltipText.replace(/&#10;/g, '\n');

    const arrow = this.renderer.createElement('div');
    this.renderer.addClass(arrow, 'tooltip-arrow');
    this.renderer.appendChild(tooltip, arrow);

    this.renderer.appendChild(document.body, tooltip);
    this.tooltipEl = tooltip;
    this.arrowEl = arrow;
  }

  private positionTooltip() {
    if (!this.tooltipEl) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();
    const margin = this.tooltipOffset;

    let top = 0, left = 0;

    switch (this.tooltipPosition) {
      case 'bottom':
        top = hostRect.bottom + margin;
        left = hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = hostRect.top + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.left - tooltipRect.width - margin;
        break;
      case 'right':
        top = hostRect.top + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.right + margin;
        break;
      case 'top':
      default:
        top = hostRect.top - tooltipRect.height - margin;
        left = hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;
        break;
    }

    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
  }

  private destroyTooltip() {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = undefined;
      this.arrowEl = undefined;
      this.isVisible = false;

      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = undefined;
      }
    }
  }
}
