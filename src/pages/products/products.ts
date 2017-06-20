import { Component } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';

import { CartPage } from '../cart/cart'
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
    public cart: Cart,
    public events: Events) {
    this.currentProducts = this.products.get();
    this.currentProducts.forEach(product => product.fav = false)
    events.subscribe('cart:changed', (products) => this.updateCartItemCount(products))
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.cart.getCartProductCount()
      .then((count: number) => {
        this.cartCount = count;
        console.log('Cart item count = ', this.cartCount)
      })
  }

  showCart() {
    let cartModal = this.modalCtrl.create(CartPage);
    cartModal.present()
  }

  addToCart(product: IProduct) {
    this.events.publish('cart:added', product);
  }

  updateCartItemCount(products: any[]) {
    this.cartCount = 0;

    products.forEach(product => {
      this.cartCount += product.qty
    });
  }

  fav(product) {
    product.fav = !product.fav
  }

}
