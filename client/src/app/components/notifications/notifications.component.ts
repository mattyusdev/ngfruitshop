import { Component, OnInit } from "@angular/core";
import { StoreService } from "src/app/services/store.service";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {
  constructor(public _ss: StoreService, public _us: UsersService) {}

  public products: Number;

  public orders: Number;

  // public notificationUpdate() {
  //   this._us.getNotifications().subscribe(
  //     res => {
  //       if (res[0].cart) {
  //         this.notification = `You have an open cart from ${new Date(
  //           res[1].date
  //         ).toLocaleDateString()}, total price: $${res[1].price}`;
  //       } else if (!res[0].cart && res[1]) {
  //         this.notification = `Your last purchase was on ${new Date(
  //           res[1].orderDate
  //         ).toLocaleDateString()}, total price: $${res[1].price}`;
  //       }
  //     },
  //     err => console.log(err)
  //   );
  // }

  ngOnInit(): void {
    this._ss.getStats().subscribe(
      res => {
        this.products = res.products;
        this.orders = res.orders;
      },
      err => console.log(err)
    );

    if (localStorage.token) this._us.getNotifications();
  }
}
