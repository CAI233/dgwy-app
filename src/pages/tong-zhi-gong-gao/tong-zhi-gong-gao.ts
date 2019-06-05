import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { TongZhiGongGaoDetailPage } from '../tong-zhi-gong-gao-detail/tong-zhi-gong-gao-detail'
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-tzgg',
  templateUrl: 'tong-zhi-gong-gao.html'
})
export class TongZhiGongGaoPage {
  param: any = {
    pageNum: 1,
    pageSize: 10,
    type:2,
    org_id: this.service.LoginUserInfo.org_id
  }
  data: any = [];
  constructor(public navCtrl: NavController, public service: AppService) { }

  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/apinews/list', this.param).then(success => {
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
  //详情
  toTongZhiGongGaoDetail(id) {
    this.navCtrl.push(TongZhiGongGaoDetailPage, { id: id })
  }

}
