import { TestBed } from '@angular/core/testing';
import { InputTextComponent } from './input.component';

describe('InputTextComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(InputTextComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'meu-projeto' title`, () => {
    const fixture = TestBed.createComponent(InputTextComponent);
    const app = fixture.componentInstance;
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(InputTextComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, meu-projeto');
  });
});
