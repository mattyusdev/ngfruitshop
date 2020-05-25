import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(public http: HttpClient, public router: Router) {}

  public isLogged: Boolean;

  public userData;

  public notification = "";

  public loginResponse = "";

  public registerResponse = "";

  public registerNextStep: Boolean;

  public resume: Boolean;

  public cities = [
    "Tel-Aviv",
    "Jerusalem",
    "Rishon-Lezion",
    "Holon",
    "Haifa",
    "Ramat Gan",
    "Netanya",
    "Eilat",
    "Bat-Yam",
    "Raanana",
  ];

  public postLogin(form) {
    this.http
      .post(environment.apiUrl + "/api/auth/login", form, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "json",
      })
      .subscribe(
        (res) => {
          localStorage.token = res[0];
          this.isLogged = true;
          this.userData = res[1];

          if (res[1].isAdmin) {
            this.router.navigateByUrl("shop");
          }

          this.getNotifications();
          // console.log(res);
        },
        (err) => (this.loginResponse = err.error)
      );
  }

  public postRegisterValidation(form) {
    this.http
      .post(environment.apiUrl + "/api/auth/register/validation", form, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "text",
      })
      .subscribe(
        (res) => {
          this.registerNextStep = true;
        },
        (err) => (this.registerResponse = err.error)
      );
  }

  public postRegister(form) {
    this.http
      .post(environment.apiUrl + "/api/auth/register", form, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "json",
      })
      .subscribe(
        (res) => {
          localStorage.token = res[0];
          this.userData = res[1];
          this.getNotifications();
          this.registerNextStep = false;
          this.isLogged = true;

          this.router.navigateByUrl("");
        },
        (err) => (this.loginResponse = err.error)
      );
  }

  public getNotifications() {
    this.http
      .get(environment.apiUrl + "/api/store/notifications", {
        responseType: "json",
        headers: {
          token: localStorage.token,
        },
      })
      .subscribe(
        (res) => {
          if (res[0].cart) {
            this.resume = true;
            this.notification = `You have an open cart from ${new Date(
              res[1].date
            ).toLocaleDateString()}, total price: $${res[1].price}`;
          } else if (!res[0].cart && res[1]) {
            this.resume = false;
            this.notification = `Your last purchase was on ${new Date(
              res[1].orderDate
            ).toLocaleDateString()}, total price: $${res[1].price}`;
          } else {
            this.resume = false;
            if (!this.userData.isAdmin) {
              this.notification = "Welcome to your first purchase!";
            } else {
              this.notification = "";
            }
          }
        },
        (err) => console.log(err)
      );
  }

  public getUserShippingData(): Observable<any> {
    return this.http.get(environment.apiUrl + "/api/auth/usershippingdata", {
      responseType: "json",
      headers: {
        token: localStorage.token,
      },
    });
  }
}
