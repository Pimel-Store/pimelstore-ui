import { TestBed } from '@angular/core/testing';
import { ToggleComponent } from './toggle.component';

describe('ToggleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ToggleComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'meu-projeto' title`, () => {
    const fixture = TestBed.createComponent(ToggleComponent);
    const app = fixture.componentInstance;
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(ToggleComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, meu-projeto');
  });
});
