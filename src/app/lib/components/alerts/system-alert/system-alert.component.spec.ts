import { TestBed } from '@angular/core/testing';
import { SystemAlertComponent } from './system-alert.component';

describe('SystemAlertComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAlertComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SystemAlertComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'meu-projeto' title`, () => {
    const fixture = TestBed.createComponent(SystemAlertComponent);
    const app = fixture.componentInstance;
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(SystemAlertComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, meu-projeto');
  });
});
