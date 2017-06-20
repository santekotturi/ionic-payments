import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Tab1Root, Tab3Root } from '../pages';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab3Root: any = Tab3Root;
  tabsPlacement : string = 'bottom';

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";

  constructor(
    public navCtrl: NavController,
    public platform : Platform,
    public translateService: TranslateService) {
    translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE'])
      .subscribe(values => {
        this.tab1Title = values['TAB1_TITLE'];
        this.tab2Title = values['TAB2_TITLE'];
        this.tab3Title = values['TAB3_TITLE'];
      });

      if(!platform.is('ios')) {
        this.tabsPlacement = 'top'
      }
  }
}
