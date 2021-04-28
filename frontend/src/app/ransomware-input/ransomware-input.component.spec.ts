import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RansomwareInputComponent } from './ransomware-input.component';

describe('RansomwareInputComponent', () => {
  let component: RansomwareInputComponent;
  let fixture: ComponentFixture<RansomwareInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RansomwareInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RansomwareInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
