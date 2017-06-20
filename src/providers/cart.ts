import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import _ from 'lodash';
import { Api } from './api';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { IProduct } from '../models/Product'

@Injectable()
export class Cart {

    products: IProduct[] = [];

    constructor(
        public http: Http,
        public api: Api,
        private storage: Storage,
        public events: Events) {

        events.subscribe('cart:added', (product) => this.addProductToCart(product))
    }

    addProductToCart(product) {
        console.log(product)

        let existingProduct = _.find(this.products, (item) => {
            return product.id === item.id
        })
        // if the product is already in the cart, increase the qty
        if (existingProduct) {
            existingProduct.qty++
        }
        else {
            product.qty = 1;
            this.products.push(product)
        }

        console.log('products in cart -> ', this.products);
        this.storage.set('cart', this.products)
        this.events.publish('cart:changed', this.products)
    }

    getCartProductCount() {
        let count = 0;
        return new Promise((resolve, reject) => {
            this.storage.get('cart').then((products) => {
                if (!products || products.length === 0) {
                    resolve(count)
                }
                else {
                    products.forEach(product => {
                        count += product.qty
                    });
                    resolve(count)
                }
            })
        })
    }

    getCartItems() {
        return new Promise((resolve, reject) => {
            this.storage.get('cart').then((products) => {
                resolve(products)
            })
        })
    }

    empty() {
        this.products = [];
        this.storage.remove('cart')
        this.events.publish('cart:changed', this.products)

    }

}