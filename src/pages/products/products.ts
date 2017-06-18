import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

// import { ItemCreatePage } from '../item-create/item-create';
// import { ItemDetailPage } from '../item-detail/item-detail';

import { Products, Cart } from '../../providers/providers';

import { IProduct } from '../../models/product';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {
  currentProducts: IProduct[];
  cartCount: number;

  constructor(
    public navCtrl: NavController,
    public products: Products,
    public modalCtrl: ModalController,
    public cart: Cart) {
    this.currentProducts = this.products.get();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.updateCartItemCount()
  }

  showCart() {
    alert('not yet implemented')
  }

  addToCart(product: IProduct) {
    this.cart.addProductToCart(product)
    this.updateCartItemCount()
  }

  updateCartItemCount() {
    this.cart.getCartProductCount()
      .then((count: number) => {
        this.cartCount = count;
        console.log('Cart item count = ', this.cartCount)
      })
  }
}
