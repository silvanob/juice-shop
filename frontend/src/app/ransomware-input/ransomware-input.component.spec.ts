import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RansomwareInputComponent } from './ransomware-input.component';
import { TranslateModule } from '@ngx-translate/core'
import { RouterModule } from '@angular/router';
import { RansomwareService } from '../Services/ransomware.service'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('RansomwareInputComponent', () => {
  let component: RansomwareInputComponent;
  let fixture: ComponentFixture<RansomwareInputComponent>;
  let ransomwareService: any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RansomwareInputComponent ],
      imports: [
        TranslateModule.forRoot(),
        RouterModule.forRoot([{ path: "", component: RansomwareInputComponent}]),
        MatDialogModule,
      ],
      providers: [
        { provide: RansomwareService, useValue: ransomwareService },
        { provide: MatDialogRef }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RansomwareInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should receive an error message when the wrong key has been entered', () => {
    ransomwareService.decrypt.and.returnValue({ error: 'Error' })
    component.send()
    expect(component.error).toBeTruthy()
  });
});
