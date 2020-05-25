import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  constructor(public http: HttpClient, public router: Router) {}

  public cartInfo;

  public products = [];

  public productInfo = {
    productId: "",
    name: "",
    price: 0,
  };

  public categories;

  public orderId;

  public adminMode = "none";

  public editProductInfo = {
    _id: "",
    name: "",
    categories: "",
    price: 0,
    image: "",
  };

  public selectedFile: File;

  public fileName;

  public timeStamp;

  public change = false;

  public getStats(): Observable<any> {
    return this.http.get(environment.apiUrl + "/api/store/stats", {
      responseType: "json",
    });
  }

  public getCart(): Observable<any> {
    return this.http.get(environment.apiUrl + "/api/store/carts", {
      responseType: "json",
      headers: {
        token: localStorage.token,
      },
    });
  }

  public removeCartItem(id) {
    this.http
      .delete(environment.apiUrl + "/api/store/carts/items/" + id, {
        responseType: "text",
        headers: {
          token: localStorage.token,
        },
      })
      .subscribe(
        (res) =>
          this.getCart().subscribe(
            (res) => (this.cartInfo = res),
            (err) => console.log(err)
          ),
        (err) => console.log(err)
      );
  }

  public removeCart() {
    this.http
      .delete(environment.apiUrl + "/api/store/carts/items", {
        responseType: "text",
        headers: {
          token: localStorage.token,
        },
      })
      .subscribe(
        (res) =>
          this.getCart().subscribe(
            (res) => (this.cartInfo = res),
            (err) => console.log(err)
          ),
        (err) => console.log(err)
      );
  }

  public getProducts() {
    this.http
      .get(environment.apiUrl + "/api/store/products", {
        responseType: "json",
        headers: {
          token: localStorage.token,
        },
      })
      .subscribe(
        (res: any[]) => (this.products = res),
        (err) => console.log(err)
      );
  }

  public addCartItem(product, quantity) {
    this.http
      .post(
        environment.apiUrl + "/api/store/carts/items",
        { product, quantity },
        {
          headers: {
            token: localStorage.token,
          },
          responseType: "text",
        }
      )
      .subscribe(
        (res) => {
          this.getCart().subscribe(
            (res) => (this.cartInfo = res),
            (err) => console.log(err)
          );
        },
        (err) => console.log(err)
      );
  }

  public getProductsByName(name) {
    this.http
      .get(environment.apiUrl + "/api/store/products/search/" + name, {
        responseType: "json",
        headers: {
          token: localStorage.token,
        },
      })
      .subscribe(
        (res: any[]) => (this.products = res),
        (err) => console.log(err)
      );
  }

  public getCategories() {
    this.http
      .get(environment.apiUrl + "/api/store/products/categories", {
        responseType: "json",
        headers: {
          token: localStorage.token,
        },
      })
      .subscribe(
        (res) => (this.categories = res),
        (err) => console.log(err)
      );
  }

  public getProductsByCategory(categoryName) {
    this.http
      .get(
        environment.apiUrl + "/api/store/products/categories/" + categoryName,
        {
          responseType: "json",
          headers: {
            token: localStorage.token,
          },
        }
      )
      .subscribe(
        (res: any[]) => (this.products = res),
        (err) => this.router.navigateByUrl("shop")
      );
  }

  public postOrderDate(arrDate): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/api/store/orders/arrivedate",
      { arrDate },
      {
        headers: {
          token: localStorage.token,
        },
        responseType: "text",
      }
    );
  }

  public postOrder(form): Observable<any> {
    return this.http.post(environment.apiUrl + "/api/store/orders", form, {
      headers: {
        token: localStorage.token,
      },
      responseType: "json",
    });
  }

  public getOrderPDF(id): Observable<any> {
    return this.http.get(environment.apiUrl + "/api/store/orders/" + id, {
      responseType: "blob",
      headers: {
        token: localStorage.token,
      },
    });
  }

  public uploadImage(id) {
    // this.http is the injected HttpClient
    const uploadData = new FormData();
    uploadData.append("image", this.selectedFile, this.selectedFile.name);
    this.http
      .post(
        environment.apiUrl + "/api/store/products/upload/" + id,
        uploadData,
        {
          responseType: "text",
        }
      )
      .subscribe(
        (res) => {
          this.timeStamp = new Date().getTime();
          this.change = true;
          this.selectedFile = undefined;
          this.getProducts();
          this.adminMode = "none";
        },
        (err) => console.log(err)
      );
  }

  public editProduct(id, form) {
    this.http
      .put(environment.apiUrl + "/api/store/products/" + id, form, {
        headers: {
          token: localStorage.token,
        },
        responseType: "text",
      })
      .subscribe(
        (res) => {
          if (this.selectedFile) {
            this.uploadImage(id);
          } else {
            this.getProducts();
            this.adminMode = "none";
          }
        },
        (err) => console.log(err)
      );
  }

  public addProduct(form) {
    this.http
      .post(environment.apiUrl + "/api/store/products", form, {
        headers: {
          token: localStorage.token,
        },
        responseType: "json",
      })
      .subscribe(
        (res) => {
          this.uploadImage(res);
        },
        (err) => console.log(err)
      );
  }
}
