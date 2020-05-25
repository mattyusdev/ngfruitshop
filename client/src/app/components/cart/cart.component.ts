import { Component, OnInit } from "@angular/core";
import { StoreService } from "src/app/services/store.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  constructor(public _ss: StoreService) {}

  public removeItem(id) {
    this._ss.removeCartItem(id);
  }

  public removeAllItems() {
    this._ss.removeCart();
  }

  ngOnInit(): void {
    this._ss.getCart().subscribe(
      (res) => (this._ss.cartInfo = res),
      (err) => console.log(err)
    );
  }
}
