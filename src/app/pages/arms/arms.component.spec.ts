import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmsComponent } from './arms.component';

describe('ArmsComponent', () => {
  let component: ArmsComponent;
  let fixture: ComponentFixture<ArmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
