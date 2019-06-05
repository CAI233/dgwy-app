import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { LoginPage } from '../login/login'
import { ShengHuoFuWuPage } from '../sheng-huo-fu-wu/sheng-huo-fu-wu';
@Component({
  selector: 'page-yjdcd',
  templateUrl: 'yi-jian-diao-cha-detail.html'
})
export class YiJianDiaoChaDetailPage {
  id: any;
  detail: any = {};
  comment_content: any;
  constructor(public navCtrl: NavController, public params: NavParams, public service: AppService) {
    this.id = this.params.get('id');
  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/opinion/Survey/details', { id: this.id }).then(success => {
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

  //发送评论
  sendComment() {
    if (!this.comment_content) {
      this.service.dialogs.alert('请输入评论内容', '提示', '确定');
      return false;
    }
    this.service.post('/api/opinion/Survey/add/reply', {
      org_id: this.service.LoginUserInfo.org_id,
      opinion_id: this.detail.id,
      content: this.comment_content
    }).then(success => {
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.service.dialogs.alert('评论发送成功', '提示', '确定');
        this.comment_content = null;
        this.ionViewDidLoad()
      }
    })
  }

  //删除评论
  delComment(id) {
    this.service.post('/api/opinion/Survey/del/reply', {
      opinion_id: this.detail.id,
      id: id
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
