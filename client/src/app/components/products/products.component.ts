import { Component, OnInit } from "@angular/core";
import { StoreService } from "src/app/services/store.service";
import { ModalComponent } from "../modal/modal.component";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { UsersService } from "src/app/services/users.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  constructor(
    public _ss: StoreService,
    public _us: UsersService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public location: Location
  ) {}

  public api;

  public activeCategory;

  public form = this.fb.group({
    name: ["", [Validators.required]],
  });

  openDialog(productId, name, price): void {
    this._ss.productInfo = {
      productId,
      name,
      price,
    };

    const dialogRef = this.dialog.open(ModalComponent, {
      width: "400px",
      height: "340px",
    });
  }

  submitSearch() {
    if (!this.form.invalid) {
      this.router.navigateByUrl("shop/search/" + this.form.value.name);
    }
  }

  resetSearch() {
    this.router.navigateByUrl("shop");
  }

  goToCategory(categoryName) {
    this.router.navigateByUrl(
      "shop/category/" + categoryName.toLocaleLowerCase()
    );
  }

  editProductMode(productInfo) {
    this._ss.editProductInfo = {
      _id: productInfo._id,
      name: productInfo.name,
      categories: productInfo.categories[0]._id,
      price: productInfo.price,
      image: productInfo.image,
    };
    this._ss.fileName = undefined;
    this._ss.adminMode = "edit";
  }

  getLinkPicture(link) {
    return link + "?" + this._ss.timeStamp;
  }

  ngOnInit(): void {
    this.api = environment.apiUrl;

    if (this.location.path() === "/shop") {
      this._ss.getProducts();
    } else {
      this.route.params.subscribe(
        (params) => {
          if (params.name) {
            this.form.patchValue({ name: params.name });
            this._ss.getProductsByName(params.name);
          } else if (params.categoryName) {
            this.activeCategory = params.categoryName;
            this._ss.getProductsByCategory(params.categoryName);
          }
        },
        (err) => console.log(err)
      );
    }

    this._ss.getCategories();
  }
}
