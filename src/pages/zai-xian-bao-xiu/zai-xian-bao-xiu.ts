import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { ZaiXianBaoXiuDetailPage } from '../zai-xian-bao-xiu-detail/zai-xian-bao-xiu-detail'
import { ZaiXianBaoXiuAddPage } from '../zai-xian-bao-xiu-add/zai-xian-bao-xiu-add'
import { LoginPage } from '../login/login'



@Component({
  selector: 'page-zxbx',
  templateUrl: 'zai-xian-bao-xiu.html'
})

export class ZaiXianBaoXiuPage {
  tabNum: any = 1;
  param: any = {
    pageNum: 1,
    pageSize: 10,
    type: null,
  }
  data: any = [];
  daiban: any = [];
  scrollShow: boolean = true;
  constructor(public navCtrl: NavController, public service: AppService) {
  }

  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/repair/list', this.param).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.param.pages = success.data.pages
        this.data = success.data.rows;
        this.data.forEach(element => {
          if (element.status != 3) {
            this.daiban.push(element);
          }
        });
      }
    })
  }
  //在线报修详情
  toZaiXianBaoXiuDetail(id?: any) {
    this.navCtrl.push(ZaiXianBaoXiuDetailPage, { id: id })
  }
  //在线报修新增
  toZaiXianBaoXiuAdd(id?: any) {
    this.navCtrl.push(ZaiXianBaoXiuAddPage)
  }



  //下拉刷型界面
  doRefresh(refresher) {
    this.param.pageSize = this.param.pageNum * this.param.pageSize;
    this.param.pageNum = 1;
    this.service.post('/api/repair/list', this.param).then(success => {
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
          this.daiban = [];
          this.data.forEach(element => {
            if (element.status != 3) {
              this.daiban.push(element);
            }
          });
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
    this.service.post('/api/repair/list', this.param).then(success => {
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
        this.daiban = [];
        this.data.forEach(element => {
          if (element.status != 3) {
            this.daiban.push(element);
          }
        });
        if (this.param.pageNum == this.param.pages) {
          this.scrollShow = false;
        }
      }
    })
  }

}
