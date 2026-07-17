import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';
import { PullToRefreshService } from '../../../../core/services/pull-to-refresh/pull-to-refresh.service';

const TRIGGER_DISTANCE = 130;
const MAX_PULL_DISTANCE = 170;

@Directive({
  selector: '[appPullToRefresh]',
  standalone: true
})
export class PullToRefreshDirective {
  private el: HTMLElement = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);
  private pullToRefresh = inject(PullToRefreshService);

  private indicatorEl?: HTMLElement;
  private startY = 0;
  private pulling = false;
  private currentDistance = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (this.el.scrollTop <= 0 && !this.pullToRefresh.refreshing()) {
      this.startY = event.touches[0].clientY;
      this.pulling = true;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.pulling) return;

    const delta = event.touches[0].clientY - this.startY;
    if (delta <= 0) {
      this.resetIndicator();
      this.pulling = false;
      return;
    }

    if (this.el.scrollTop > 0) {
      this.resetIndicator();
      this.pulling = false;
      return;
    }

    this.currentDistance = Math.min(delta, MAX_PULL_DISTANCE);
    this.showIndicator(this.currentDistance);
  }

  @HostListener('touchend')
  async onTouchEnd() {
    if (!this.pulling) return;
    this.pulling = false;

    if (this.currentDistance >= TRIGGER_DISTANCE) {
      this.setIndicatorSpinning();
      await this.pullToRefresh.trigger();
    }
    this.resetIndicator();
    this.currentDistance = 0;
  }

  private showIndicator(distance: number) {
    this.createIndicatorIfNeeded();
    if (!this.indicatorEl) return;
    const progress = Math.min(distance / TRIGGER_DISTANCE, 1);
    this.renderer.setStyle(this.indicatorEl, 'opacity', String(progress));
    this.renderer.setStyle(this.indicatorEl, 'transform', `translateX(-50%) translateY(${distance * 0.6}px) rotate(${progress * 360}deg)`);
  }

  private setIndicatorSpinning() {
    if (!this.indicatorEl) return;
    this.renderer.addClass(this.indicatorEl, 'ptr-spinning');
  }

  private resetIndicator() {
    if (!this.indicatorEl) return;
    this.renderer.removeClass(this.indicatorEl, 'ptr-spinning');
    this.renderer.setStyle(this.indicatorEl, 'opacity', '0');
    this.renderer.setStyle(this.indicatorEl, 'transform', 'translateX(-50%) translateY(0)');
  }

  private createIndicatorIfNeeded() {
    if (this.indicatorEl) return;

    const indicator = this.renderer.createElement('span');
    this.renderer.addClass(indicator, 'material-icons');
    this.renderer.addClass(indicator, 'ptr-indicator');
    indicator.innerText = 'refresh';
    this.renderer.setStyle(this.el.parentElement ?? this.el, 'position', 'relative');
    this.renderer.appendChild(this.el.parentElement ?? this.el, indicator);
    this.indicatorEl = indicator;
  }
}
