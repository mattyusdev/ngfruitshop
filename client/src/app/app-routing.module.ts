import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { ShopComponent } from "./components/shop/shop.component";
import { OrderComponent } from "./components/order/order.component";
import { ContactComponent } from "./components/contact/contact.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "shop",
    component: ShopComponent,
  },
  {
    path: "shop/search/:name",
    component: ShopComponent,
  },
  {
    path: "shop/category/:categoryName",
    component: ShopComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "order",
    component: OrderComponent,
  },
  {
    path: "contact",
    component: ContactComponent,
  },
  {
    path: "**",
    redirectTo: "/",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
