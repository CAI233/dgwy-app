import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { LoginPage } from '../login/login'
import { YiJianDiaoChaDetailPage } from '../yi-jian-diao-cha-detail/yi-jian-diao-cha-detail'
@Component({
  selector: 'page-yjdc',
  templateUrl: 'yi-jian-diao-cha.html'
})
export class YiJianDiaoChaPage {
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
    this.service.post('/api/opinion/Survey/list', this.param).then(success => {
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
          let endTime = new Date(element.end_time).getTime();
          let dqTime = new Date().getTime();
          if (endTime < dqTime) {
            element.status = true;
          }
        });
      }
    })
  }

  toYiJianDiaoChaDetail(id, status) {
    if (status) {
      this.navCtrl.push(YiJianDiaoChaDetailPage, { id: id })
    } else {
      this.service.dialogs.alert("调查已结束", '提示', '确定');
    }
  }


  //下拉刷型界面
  doRefresh(refresher) {
    this.param.pageSize = this.param.pageNum * this.param.pageSize;
    this.param.pageNum = 1;
    this.service.post('/api/opinion/Survey/list', this.param).then(success => {
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
          this.data.forEach(element => {
            let endTime = new Date(element.end_time).getTime();
            let dqTime = new Date().getTime();
            if (endTime < dqTime) {
              element.status = true;
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
    this.service.post('/api/opinion/Survey/list', this.param).then(success => {
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
        this.data.forEach(element => {
          let endTime = new Date(element.end_time).getTime();
          let dqTime = new Date().getTime();
          if (endTime < dqTime) {
            element.status = true;
          }
        });
        if (this.param.pageNum == this.param.pages) {
          this.scrollShow = false;
        }
      }
    })
  }
}
