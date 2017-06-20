import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { IProduct } from '../models/product';

@Injectable()
export class Products {

  products : IProduct[] = [
      {
        id: 1,
        name: 'Product 1',
        details: 'Something about product 1',
        price: 9,
      },
      {
        id: 2,
        name: 'Product 2',
        details: 'Something about product 2',
        price: 12
      },
      {
        id: 3,
        name: 'Product 3',
        details: 'Something about product 3',
        price: 6
      },
      {
        id: 4,
        name: 'Product 4',
        details: 'Something about product 4',
        price: 45
      },
      {
        id: 5,
        name: 'Product 5',
        details: 'Something about product 5',
        price: 16
      },
      {
        id: 6,
        name: 'Product 6',
        details: 'Something about product 6',
        price: 27
      },
      {
        id: 7,
        name: 'Product 7',
        details: 'Something about product 7',
        price: 67
      },
      {
        id: 8,
        name: 'Product 8',
        details: 'Something about product 8',
        price: 8
      }
    ]


 
  constructor(public http: Http, public api: Api) {
  }

  get(params?: any) {
    // return this.api.get('/products', params)
    //   .map(resp => resp.json());
    return this.products
  }

}