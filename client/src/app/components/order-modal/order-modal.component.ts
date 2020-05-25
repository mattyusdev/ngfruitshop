import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { StoreService } from "src/app/services/store.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-order-modal",
  templateUrl: "./order-modal.component.html",
  styleUrls: ["./order-modal.component.css"],
})
export class OrderModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OrderModalComponent>,
    public _ss: StoreService
  ) {}

  download() {
    let filename = "order.pdf";
    this._ss.getOrderPDF(this._ss.orderId).subscribe(
      (pdf) => {
        saveAs(pdf, filename);
      },
      (err) => {
        alert("Problem while downloading the file.");
        console.error(err);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
