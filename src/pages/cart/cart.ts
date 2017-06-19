import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

import { Cart } from '../../providers/cart';

import { IProduct } from '../../models/product'


@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {

  items: IProduct[];
  subtotal: number = 0;
  shipping: number = 0;
  total: number = 0;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private cart: Cart) {

  }

  ngOnInit() {
    this.cart.getCartItems()
      .then((items: any[]) => {
        this.items = items
        this.calculateTotals()

      })
  }

  ionViewDidLoad() {

  }

  close() {
    this.viewCtrl.dismiss();
  }


  checkout() {
    alert("tbi")
  }

  emptyCart() {
    this.items = [];
    this.cart.empty()
    this.calculateTotals()
  }

  calculateTotals() {
    this.subtotal = 0;
    if (this.items && this.items.length > 0) {
      this.items.forEach((item: IProduct) => {
        this.subtotal += item.price
        console.log(this.subtotal)
      })
    }


    this.total = this.subtotal + this.shipping;
  }

}
