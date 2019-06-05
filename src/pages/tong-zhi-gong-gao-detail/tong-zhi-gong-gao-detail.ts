import { Component} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { LoginPage } from '../login/login'

@Component({
  selector: 'page-tzggd',
  templateUrl: 'tong-zhi-gong-gao-detail.html'
})
export class TongZhiGongGaoDetailPage {
  id: any;
  detail: any = {};
  constructor(public navCtrl: NavController, public params: NavParams, public service: AppService) {
    this.id = this.params.get('id');
  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/apinews/details', {id:this.id}).then(success => {
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


}
