import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'
import { FormSubmitService } from '../Services/form-submit.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-ransomware-input',
  templateUrl: './ransomware-input.component.html',
  styleUrls: ['./ransomware-input.component.scss']
})
export class RansomwareInputComponent implements OnInit {
  public codeControl = new FormControl('', [Validators.required])
  constructor(private readonly formSubmitService: FormSubmitService, private readonly router: Router) {}

  ngOnInit(): void {
    this.formSubmitService.attachEnterKeyHandler('decrypt-form', 'submit', () => this.send())
  }

  send () {
    this.router.navigate(['/rest/ransomware/decrypt'])
  }

}
