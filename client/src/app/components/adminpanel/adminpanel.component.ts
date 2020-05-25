import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { StoreService } from "src/app/services/store.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-adminpanel",
  templateUrl: "./adminpanel.component.html",
  styleUrls: ["./adminpanel.component.css"],
})
export class AdminpanelComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public _ss: StoreService,
    public http: HttpClient
  ) {}

  public form = this.fb.group({
    name: ["", Validators.required],
    categories: ["", Validators.required],
    price: [0, Validators.min(1)],
  });

  addMode() {
    this.form.reset();

    this._ss.fileName = undefined;
    this._ss.adminMode = "add";
  }

  onFileChanged(event) {
    this._ss.fileName = event.target.files[0].name;
    this._ss.selectedFile = event.target.files[0];
  }

  submitAdd() {
    if (!this.form.invalid) {
      this._ss.addProduct(this.form.value);
    }
  }

  submitEdit() {
    const _id = this._ss.editProductInfo._id;
    const newProduct = { ...this._ss.editProductInfo };
    delete newProduct._id;
    delete newProduct.image;

    this._ss.editProduct(_id, newProduct);
  }

  ngOnInit(): void {
    this._ss.adminMode = "none";
  }
}
