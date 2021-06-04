import { Component, NgZone, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { FormSubmitService } from '../Services/form-submit.service'
import { Router } from '@angular/router'
import { MatDialogRef } from '@angular/material/dialog'

import { RansomwareService } from '../Services/ransomware.service'

@Component({
  selector: 'app-ransomware-input',
  templateUrl: './ransomware-input.component.html',
  styleUrls: ['./ransomware-input.component.scss']
})
export class RansomwareInputComponent implements OnInit {
  public codeControl = new FormControl('', [Validators.required])
  public decryptionCode: string
  public error: any
  public success: any
  constructor (private readonly formSubmitService: FormSubmitService, private readonly router: Router, private readonly ransomwareService: RansomwareService, private readonly ngZone: NgZone, private readonly dialogRef: MatDialogRef<RansomwareInputComponent>) {}

  ngOnInit () {
    this.formSubmitService.attachEnterKeyHandler('decrypt-form', 'submit', () => this.send())
  }

  send () {
    const myObserver = {
      next: ({ text }) => {
        console.log(text)
        this.success = text
        setTimeout(() => {
          this.ngZone.run(async () => await this.router.navigate(['/search']))
          this.dialogRef.close()
        }, 3000)
      },
      error: ({ error }) => {
        console.table(error)
        this.error = error
      }
    }
    this.decryptionCode = this.codeControl.value
    this.error = ''
    this.ransomwareService.decrypt(this.decryptionCode).subscribe(myObserver)
  }
}
