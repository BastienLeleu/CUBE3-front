import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should open legal modals when triggered', () => {
    const mockEvent = { preventDefault: vi.fn() } as unknown as Event;
    
    component.openMentionsLegales(mockEvent);
    expect(component.showMentionsLegales()).toBe(true);

    component.openCGU(mockEvent);
    expect(component.showCGU()).toBe(true);

    component.openPrivacy(mockEvent);
    expect(component.showPrivacy()).toBe(true);
  });
});
