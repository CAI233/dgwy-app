import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { LoginPage } from '../login/login'
declare let jQuery: any;
@Component({
  selector: 'page-shfwd',
  templateUrl: 'sheng-huo-fu-wu-detail.html'
})
export class ShengHuoFuWuDetailPage {
  id: any;
  detail: any = {};
  comment_content: any;
  constructor(public navCtrl: NavController, public params: NavParams, public service: AppService) {
    this.id = this.params.get('id');
  }
  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/life/details', { id: this.id }).then(success => {
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
    this.service.post('/api/life/add/comment', {
      service_id: this.detail.id,
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

  //点赞
  likeClick() {
    this.service.post('/api/life/liked/life', {
      service_id: this.detail.id,
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
  //删除生活服务
  delLife() {
    this.service.loadingStart();
    this.service.post('/api/life/del/life', { id: this.id }).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.navCtrl.pop();
      }
    })
  }
  //删除评论
  delComment(id) {
    this.service.post('/api/life/del/comment', {
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

  imgBigs: any = [];
  //图片放大
  imgBig(item) {
    this.imgBigs = this.detail.img_path.split(',')
    jQuery('#imgBig').show().click(() => {
      jQuery('#imgBig').hide();
    });

  }
}
