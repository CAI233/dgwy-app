import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { DangJianDongTaiDetailPage } from '../dang-jian-dong-tai-detail/dang-jian-dong-tai-detail'
import { LoginPage } from '../login/login'
@Component({
  selector: 'page-djdt',
  templateUrl: 'dang-jian-dong-tai.html'
})
export class DangJianDongTaiPage {
  param: any = {
    pageNum: 1,
    pageSize: 10,
    type:3,
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
    toDangJianDongTaiDetail(id){
      this.navCtrl.push(DangJianDongTaiDetailPage,{id:id})
    }
 
}
