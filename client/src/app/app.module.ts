import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent, HighlightSearch } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from "@angular/material/badge";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { NavComponent } from "./components/nav/nav.component";
import { LoginComponent } from "./components/login/login.component";
import { AboutComponent } from "./components/about/about.component";
import { HomeComponent } from "./components/home/home.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { RegisterComponent } from "./components/register/register.component";
import { ShopComponent } from "./components/shop/shop.component";
import { CartComponent } from "./components/cart/cart.component";
import { ProductsComponent } from "./components/products/products.component";
import { ModalComponent } from "./components/modal/modal.component";
import { OrderComponent } from "./components/order/order.component";
import { MatNativeDateModule } from "@angular/material/core";
import { OrderModalComponent } from "./components/order-modal/order-modal.component";
import { AdminpanelComponent } from "./components/adminpanel/adminpanel.component";
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    AboutComponent,
    HomeComponent,
    NotificationsComponent,
    RegisterComponent,
    ShopComponent,
    CartComponent,
    ProductsComponent,
    ModalComponent,
    OrderComponent,
    HighlightSearch,
    OrderModalComponent,
    AdminpanelComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatBadgeModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
