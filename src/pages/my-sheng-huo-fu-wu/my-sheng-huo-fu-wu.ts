import { Component} from '@angular/core';
import { NavController} from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { ShengHuoFuWuDetailPage } from '../sheng-huo-fu-wu-detail/sheng-huo-fu-wu-detail'
import { ShengHuoFuWuAddPage } from '../sheng-huo-fu-wu-add/sheng-huo-fu-wu-add'
import { LoginPage } from '../login/login'
@Component({
  selector: 'page-mshfw',
  templateUrl: 'my-sheng-huo-fu-wu.html'
})
export class MyShengHuoFuWuPage {
  param: any = {
    pageNum: 1,
    pageSize: 10,
    org_id: this.service.LoginUserInfo.org_id
  }
  data: any = [];
  constructor(public navCtrl: NavController, public service: AppService) { }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/life/list', this.param).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.data = success.data.rows;
      }
    })
  }

  toShengHuoFuWuAdd(id?:any) {
    this.navCtrl.push(ShengHuoFuWuAddPage,{id:id})
  }
  toShengHuoFuWuDetail(id) {
    this.navCtrl.push(ShengHuoFuWuDetailPage,{id:id})
  }
  delRow(id) {
    this.service.post('/api/life/del/life', { id: id }).then(success => {
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.ionViewDidLoad();
      }
    })
  }
   //点赞
   likeClick(id) {
    this.service.post('/api/life/liked/life', {
      service_id: id,
    }).then(success => {
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.ionViewDidLoad()
      }
    })
  }
}
