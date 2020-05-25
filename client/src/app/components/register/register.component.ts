import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  constructor(public fb: FormBuilder, public _us: UsersService) {}

  public stepOneForm = this.fb.group(
    {
      idNumber: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    },
    {
      validator: this.MustMatch("password", "confirmPassword"),
    }
  );

  public stepTwoForm = this.fb.group({
    city: ["", Validators.required],
    street: ["", Validators.required],
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
  });

  public submitStepOne() {
    if (!this.stepOneForm.invalid) {
      const { email, idNumber } = this.stepOneForm.value;
      this._us.postRegisterValidation({ email, idNumber });
    } else {
      this._us.registerResponse = "Missing Info";
    }
  }

  public submitStepTwo() {
    if (!this.stepTwoForm.invalid)
      this._us.postRegister({
        ...this.stepOneForm.value,
        ...this.stepTwoForm.value,
      });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnInit(): void {}
}
