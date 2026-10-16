import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Services } from '../services/services';

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

  constructor(private service: Services) { }

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      topic: new FormControl(''),
      message: new FormControl('', [Validators.required]),
    })
  }

  handleSubmit() {

    //If Form Is Invalid Send Alert
    if (this.contactForm.invalid) {
      alert("Please Fill Out The Required Fields")
    }

    const payload = this.contactForm.value

    this.service.sendMessage(payload)
      .subscribe({
        next: (result: any) => {
          console.log(result)
          setTimeout(() => {
            //Set Submitted as true, leave error as false and reset form after submision
            this.submitted = true
            this.error = false
            this.contactForm.reset()
          }, 1500)
        },
        error: (err) => {
          this.submitted = false
          this.error = true
          console.log('api error', err)
          alert('An unexpected error occured please try again')
        }
      })
  //   //log form values to console
  //   console.log(this.contactForm)
  //   console.log(this.contactForm.value)

  //   //Wait 1.5 secs before sending confirmation
  //   setTimeout(() => {
  //     //Set Submitted as true, leave error as false and reset form after submision
  //     this.submitted = true
  //     this.error = false
  //     this.contactForm.reset()
  //   }, 1500)
  }

  //Access Form With A Getter
  get c() {
    return this.contactForm.controls
  }
}
