import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './buttom.component';

describe('ButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'meu-projeto' title`, () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    const app = fixture.componentInstance;
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, meu-projeto');
  });
});
