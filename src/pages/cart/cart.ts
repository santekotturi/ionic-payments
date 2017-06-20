import { Component } from '@angular/core';
import { NavController, ViewController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';

import { Cart, User } from '../../providers/providers';

import { IProduct } from '../../models/product'


@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  handler;
  items: IProduct[];
  subtotal: number = 0;
  shipping: number = 0;
  total: number = 0;
  stripe_publish_key: string = 'pk_test_jFNCSG7D9hn0ivJeRe0yafZ4';
  card = {
    name: 'Early Adopter',
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2020,
    cvc: '220'
  };
  loading;
  hasItems: boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private cart: Cart,
    private user: User,
    private stripe: Stripe,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {

    // init stripe for mobile
    if (platform.is('cordova')) {
      stripe.setPublishableKey(this.stripe_publish_key);
    }
    // web
    else {
      (<any>window).Stripe.setPublishableKey(this.stripe_publish_key);
    }

    this.loading = loadingCtrl.create({
      duration: 3000
    });

  }

  ngOnInit() {
    this.cart.getCartItems()
      .then((items: any[]) => {
        this.items = items
        if (this.items && this.items.length > 0) {
          this.hasItems = true;
        }
        this.calculateTotals()
      })
  }

  ionViewDidLoad() {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  checkout() {
    console.log('checking out')
    console.log('Card detials -> ', this.card)

    this.loading.present()

    if (this.platform.is('cordova')) {
      this.stripe.createCardToken({
        number: this.card.number,
        expMonth: this.card.expMonth,
        expYear: this.card.expYear,
        cvc: this.card.cvc
      })
        .then(token => {
          this.user.checkout(token, this.total * 100)
            .then((res) => {
              this._orderComplete()
              console.log('checkout server response -> ', res)
            }, (err) => console.error('Checkout server err -> ', err))
        })
        .catch(error => console.error(error))

    }
    else {
      (<any>window).Stripe.card.createToken({
        number: this.card.number,
        exp_month: this.card.expMonth,
        exp_year: this.card.expYear,
        cvc: this.card.cvc
      },
        (status: number, response: any) => {
          if (status === 200) {
            console.log('Success! Web Card token', response);
            this.user.checkout(response.id, this.total * 100)
              .then((res) => {
                this._orderComplete()
                console.log('checkout server response -> ', res)
              }, (err) => console.error('Checkout server err -> ', err))
          } else {
            console.error(response.error.message);
          }
        });
    }

  }

  emptyCart() {
    this.hasItems = false
    this.items = []
    this.cart.empty()
    this.calculateTotals()
  }

  clearCard() {
    this.card = {
      name: '',
      number: '',
      expMonth: null,
      expYear: null,
      cvc: ''

    };
  }

  calculateTotals() {
    this.subtotal = 0;
    if (this.items && this.items.length > 0) {
      this.items.forEach((item: IProduct) => {
        this.subtotal += item.price * item.qty
        console.log(this.subtotal)
      })
    }
    this.total = this.subtotal + this.shipping;
  }

  _orderComplete() {
    this.loading.dismiss()
    this.emptyCart()
    this.clearCard()
    this.successPurchaseAlert()
    this.navCtrl.pop();
  }

  successPurchaseAlert() {
    let alert = this.alertCtrl.create({
      title: 'Thanks!',
      subTitle: 'Your order successfully processed. We\'ve emailed your order confirmation to you',
      buttons: ['OK']
    });
    alert.present();
  }

}
