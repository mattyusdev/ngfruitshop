import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  constructor(public _us: UsersService, public router: Router) {}

  public logOut() {
    localStorage.clear();
    this._us.isLogged = false;
    this._us.userData = "";
    this.router.navigate(["/"]);
  }

  ngOnInit(): void {}
}
