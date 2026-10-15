import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-app',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styles: ``,
})
export class App implements OnInit {
  submitted = false
  error = false
  
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      topic: new FormControl(''),
      message: new FormControl('', [Validators.required]),
    })
  }

  handleSubmit() {
    //log form values to console
    console.log(this.contactForm)
    console.log(this.contactForm.value)

    //Wait 1.5 secs before sending confirmation
    setTimeout(() => {
      //Set Submitted as true, leave error as false and reset form after submision
      this.submitted = true
      this.error = false
      this.contactForm.reset()
    }, 1500)
  }

  //Access Form With A Getter
  get c() {
    return this.contactForm.controls
  }
}
