import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { TuiSongXiaoXiDetailPage } from '../tui-song-xiao-xi-detail/tui-song-xiao-xi-detail'
import { LoginPage } from '../login/login';
import { JPush } from '@jiguang-ionic/jpush';

@Component({
  selector: 'page-tsxx',
  templateUrl: 'tui-song-xiao-xi.html'
})
export class TuiSongXiaoXiPage {
  @ViewChild('refresher') refresher: String;
  param: any = {
    pageNum: 1,
    pageSize: 10,
    type: 2,
    org_id: this.service.LoginUserInfo.org_id
  }
  data: any = [];
  scrollShow: boolean = true;
  constructor(public navCtrl: NavController, public service: AppService, public jpush: JPush) { }

  ionViewDidLoad() {
    this.doRefresh(this.refresher)
    this.service.post('/api/inform/push/list', this.param).then(success => {
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.param.pages = success.data.pages
        this.data = success.data.rows;
      }
    })
  }
  //详情
  toTongZhiGongGaoDetail(item) {
    if (!item.click) {
      item.click = '已读'
      this.service.pushNum = this.service.pushNum - 1
      this.jpush.setBadge(this.service.pushNum);
      this.jpush.setApplicationIconBadgeNumber(this.service.pushNum);
    }
    this.navCtrl.push(TuiSongXiaoXiDetailPage, { id: item.id })
  }
  //下拉刷型界面
  doRefresh(refresher) {
    this.param.pageSize = this.param.pageNum * this.param.pageSize;
    this.param.pageNum = 1;
    this.service.post('/api/inform/push/list', this.param).then(success => {
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
    console.log('this.param.pageNum'+this.param.pageNum)
    console.log('this.param.pages'+this.param.pages)
    if (this.param.pageNum == this.param.pages) {
      console.log(111111)
      this.scrollShow = false;
      return false;
    }
    this.param.pageSize = 10;
    this.param.pageNum++
    this.service.post('/api/inform/push/list', this.param).then(success => {
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
