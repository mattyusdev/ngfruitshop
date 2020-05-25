import { Component, OnInit, VERSION, Pipe, PipeTransform } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UsersService } from "./services/users.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "highlight",
})
export class HighlightSearch implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    const re = new RegExp(args, "gi");
    const match = value.match(re);

    if (!match) {
      return value;
    }

    const replacedValue = value.replace(re, "<mark>" + match[0] + "</mark>");
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "client";

  constructor(
    public _us: UsersService,
    public http: HttpClient,
    public router: Router,
    public location: Location
  ) {}

  ngOnInit(): void {
    if (localStorage.token) {
      this.http
        .get(environment.apiUrl + "/api/auth/userdata", {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          responseType: "json",
        })
        .subscribe(
          (res: any) => {
            this._us.isLogged = true;
            this._us.userData = res;

            if (res.isAdmin && this.location.path() === "") {
              this.router.navigateByUrl("shop");
            }

            if (this.location.path() === "/register") {
              this.router.navigateByUrl("");
            }
          },
          (err) => {
            this._us.isLogged = false;

            this.router.navigateByUrl("");
          }
        );
    } else {
      this._us.isLogged = false;

      if (
        this.location.path() === "/shop" ||
        this.location.path() === "/order"
      ) {
        this.router.navigateByUrl("");
      }
    }
  }
}
