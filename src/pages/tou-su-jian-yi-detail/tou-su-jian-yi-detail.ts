import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { LoginPage } from '../login/login'
declare let jQuery: any;
@Component({
  selector: 'page-tsjyd',
  templateUrl: 'tou-su-jian-yi-detail.html'
})
export class TouSuJianYiDetailPage {
  id: any;
  detail: any = {};
  constructor(public navCtrl: NavController, public params: NavParams, public service: AppService) {
    this.id = this.params.get('id');
  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/complaint/details', {id: this.id }).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.detail = success.data;
      }
    })
  }

  imgBigs: any = [];
  //图片放大
  imgBig(item) {
    this.imgBigs = this.detail.img_path.split(',')
    jQuery('#imgBig').show().click(() => {
      jQuery('#imgBig').hide();
    });

  }
}
