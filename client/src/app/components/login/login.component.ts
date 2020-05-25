import { Component, OnInit } from "@angular/core";
import { UsersService } from "src/app/services/users.service";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(public _us: UsersService, public fb: FormBuilder) {}

  public form = this.fb.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });

  public submitHandler() {
    this._us.postLogin(this.form.value);
  }

  ngOnInit(): void {}
}
