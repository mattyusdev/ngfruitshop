import { Component, OnInit } from "@angular/core";
import { StoreService } from "src/app/services/store.service";
import { FormBuilder, Validators } from "@angular/forms";
import { UsersService } from "src/app/services/users.service";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { MatDialog } from "@angular/material/dialog";
import { OrderModalComponent } from "../order-modal/order-modal.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  constructor(
    public _ss: StoreService,
    public _us: UsersService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router
  ) {}

  minDate = new Date();

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 5 && day !== 6;
  };

  orderSent = false;

  dateResponse = "";

  searchTerm: string;

  public form = this.fb.group({
    city: ["", [Validators.required]],
    street: ["", [Validators.required]],
    arriveDate: ["", Validators.required],
    cardType: ["Visa"],
    creditCard: [
      "",
      [
        Validators.required,
        RxwebValidators.creditCard({ fieldName: "cardType" }),
      ],
    ],
  });

  updateSearch(e) {
    if (e.target.value.length) {
      this.searchTerm = e.target.value;
      this._ss.cartInfo.cartItems = this._ss.cartInfo.cartItems.filter((i) =>
        i.product.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
    } else {
      this.searchTerm = "";
      this._ss.getCart().subscribe(
        (res) => {
          this._ss.cartInfo = res;
        },
        (err) => console.log(err)
      );
    }
  }

  openDialog(): void {
    // console.log(this.form.value.arriveDate);

    if (!this.form.invalid) {
      this._ss.postOrderDate(this.form.value.arriveDate).subscribe(
        (res) => {
          const { city, street, arriveDate, creditCard } = this.form.value;

          this._ss
            .postOrder({
              cart: this._ss.cartInfo._id,
              city,
              street,
              arriveDate,
              creditCard,
            })
            .subscribe(
              (res) => {
                this.orderSent = true;

                this._ss.orderId = res;

                const dialogRef = this.dialog.open(OrderModalComponent, {
                  width: "500px",
                  height: "400px",
                  disableClose: true,
                });
              },
              (err) => console.log(err)
            );
        },
        (err) => (this.dateResponse = err.error)
      );
    }
  }

  ngOnInit(): void {
    this._ss.getCart().subscribe(
      (res) => {
        if (res) {
          this._ss.cartInfo = res;
        } else {
          this.router.navigateByUrl("/shop");
        }
      },
      (err) => console.log(err)
    );
    this._us.getUserShippingData().subscribe(
      (res) => {
        this.form.patchValue({
          city: res.city,
          street: res.street,
        });
      },
      (err) => console.log(err)
    );
  }
}
