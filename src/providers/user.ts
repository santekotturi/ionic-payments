import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 * Most apps have the concept of a User. This is a simple provider with login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */

@Injectable()
export class User {
  _user: any;
  _token: string;

  constructor(
    public http: Http,
    public api: Api,
    private storage: Storage) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(credentials: any) {
    let seq = this.api.post('user/login', credentials).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('user/signup', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  test() {
    return new Promise((resolve, reject) => {
      this.storage.get('token')
        .then((token) => {
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('X-Access-Token', token);
          let seq = this.api.get('user/test', null, new RequestOptions({ headers: headers }))
            .map(res => res.json())
            .subscribe(res => {
              if (res.status == 'success') {
                console.log('Success with token -> ', res)
              }
            }, err => {
              console.error('ERROR', err);
            });

          resolve(seq);
        })
    })
  }

  checkout(stripeToken: string, amount: number) {
    return new Promise((resolve, reject) => {
      this.storage.get('token')
        .then((token) => {
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('X-Access-Token', token);
          this.api.post('user/checkout', { stripeToken, amount }, new RequestOptions({ headers: headers }))
            .map(res => res.json())
            .subscribe(res => {
              if (res.status == 'success') {
                console.log('Success with token -> ', res)
                resolve(res)
              }
            }, err => {
              reject(err)
              console.error('ERROR', err);
            });
        })
    })
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.storage.clear();
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    console.log('setting user -> ', resp.user)
    this._user = resp.user;
    this.storage.set('user', this._user);
    this.storage.set('token', this._user.token);
    this._token = this._user.token;
  }

  getUser() {
    return new Promise((resolve, reject) => {
      if(this._user) {
        resolve(this._user)
      } else {
        this.storage.get('user')
        .then((user) => resolve(user))
      }
    })
    
  }
}
