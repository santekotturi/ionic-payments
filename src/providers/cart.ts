import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import _ from 'lodash';
import { Api } from './api';
import { Storage } from '@ionic/storage';

import { IProduct } from '../models/Product'

@Injectable()
export class Cart {

    products: IProduct[] = [];

    constructor(
        public http: Http,
        public api: Api,
        private storage: Storage) {

    }

    addProductToCart(product) {
        // if the product is already in the cart, increase the qty
        let existingIds = _.map(this.products, 'id')
        if (product.id in existingIds) {
            let existingProduct = _.find(this.products, (item) => {
                return item.id === product.id
            })
            existingProduct.qty++;
        }
        // add the item because its not already in the cart
        else {
            product.qty = 1;
            this.products.push(product)
        }

        console.log('products in cart -> ', this.products);

        this.storage.set('cart', this.products)
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

}