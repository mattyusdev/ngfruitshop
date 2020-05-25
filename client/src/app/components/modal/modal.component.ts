import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { StoreService } from "src/app/services/store.service";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent implements OnInit {
  constructor(
    public _ss: StoreService,
    public dialogRef: MatDialogRef<ModalComponent>,
    public fb: FormBuilder
  ) {}

  form = this.fb.group({
    quantity: [1, [Validators.min(1)]],
  });

  onSubmit() {
    if (!this.form.invalid) {
      this._ss.addCartItem(
        this._ss.productInfo.productId,
        this.form.value.quantity
      );
      this.dialogRef.close();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
