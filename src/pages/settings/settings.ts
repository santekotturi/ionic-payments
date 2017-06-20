import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, Events } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';
import { TutorialPage } from '../tutorial/tutorial';
import { Settings } from '../../providers/settings';

import { TranslateService } from '@ngx-translate/core';

import { User } from '../../providers/user'

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main'
  pageTitleKey: string = 'SETTINGS_TITLE'
  pageTitle: string
  _user = {}


  constructor(
    public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public user: User,
    public events: Events) {
    user.getUser()
      .then(user => this._user = user)

  }

  ngOnInit() {

  }

  logout() {
    this.user.logout()
    this.events.publish('user:logout')
  }

}
