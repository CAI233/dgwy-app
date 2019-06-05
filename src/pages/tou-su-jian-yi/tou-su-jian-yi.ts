import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { TouSuJianYiDetailPage } from '../tou-su-jian-yi-detail/tou-su-jian-yi-detail'
import { TouSuJianYiAddPage } from '../tou-su-jian-yi-add/tou-su-jian-yi-add'
import { LoginPage } from '../login/login'
@Component({
  selector: 'page-tsjy',
  templateUrl: 'tou-su-jian-yi.html'
})
export class TouSuJianYiPage {
  param: any = {
    pageNum: 1,
    pageSize: 10,
    org_id: this.service.LoginUserInfo.org_id
  }
  data: any = [];
  scrollShow: boolean = true;
  constructor(public navCtrl: NavController, public service: AppService) { }

  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/complaint/list', this.param).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.param.pages=success.data.pages
        this.data = success.data.rows;
      }
    })
  }
  toTouSuJianYiDetail(id?: any) {
    this.navCtrl.push(TouSuJianYiDetailPage, { id: id })
  }
  toTouSuJianYiAdd(id?: any) {
    this.navCtrl.push(TouSuJianYiAddPage, { id: id })
  }
  delRow(id) {
    this.service.post('/api/complaint/del/complaint', { id: id }).then(success => {
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

  //下拉刷型界面
  doRefresh(refresher) {
    this.param.pageSize = this.param.pageNum * this.param.pageSize;
    this.param.pageNum = 1;
    this.service.post('/api/complaint/list', this.param).then(success => {
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        setTimeout(() => {
          this.param.pages = success.data.pages
          this.data = success.data.rows;
          refresher.complete();
        }, 1000);
      }
    })

  }
  //下滑动加载数据
  doInfinite(infiniteScroll) {
    if (this.param.pageNum == this.param.pages) {
      this.scrollShow = false;
      return false;
    }
    this.param.pageSize = 10;
    this.param.pageNum++
    this.service.post('/api/complaint/list', this.param).then(success => {
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        infiniteScroll.complete();
        success.data.rows.forEach(element => {
          this.data.push(element)
        });
        if (this.param.pageNum == this.param.pages) {
          this.scrollShow = false;
        }
      }
    })
  }
}
