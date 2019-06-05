import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { RegisterPage } from '../register/register';
import { ResetpwdPage } from '../resetpwd/resetpwd';
// import { JPush } from '@jiguang-ionic/jpush';
import { HomePage } from '../home/home'
import { JPush } from '@jiguang-ionic/jpush';
declare let jQuery: any;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  param = {
    phone: this.service.LoginUserInfo.phone,
    password: this.service.LoginUserInfo.password
  }
  sequence: number = 0;
  constructor(public navCtrl: NavController, public service: AppService, public jpush: JPush) {
    console.log('-----login------')
  }
  ionViewWillEnter() {
    this.service.statusBar.styleBlackTranslucent();
  }
  ionViewWillLeave() {
    this.service.statusBar.styleDefault();
  }
  backHome() {
    if (jQuery.readerParam) {
      this.service.dialogs.alert('请先登录!', '提示', '确定');
    }
    else {
      this.navCtrl.pop();
    }
  }
  //登录
  tologin() {
    if (!this.param.phone) {
      this.service.dialogs.alert('请填写登录账号', '提示', '确定');
      return false;
    }
    if (!this.param.password) {
      this.service.dialogs.alert('请填写登录密码', '提示', '确定');
      return false;
    }
    this.service.post('/api/member/login', this.param).then(success => {
      if (success.code == 0) {
        this.service.LoginUserInfo = success.data;
        this.service.LoginUserInfo.password = this.param.password;
        this.service.token = success.data.member_token;

        if (!this.service.LoginUserInfo.org_id) {
          this.service.LoginUserInfo.org_id = this.service.orgList[0].org_id;
        }
        this.jpush.setTags({ sequence: this.sequence++, tags: [this.service.LoginUserInfo.org_id.toString()] })
        this.jpush.setAlias({ sequence: this.sequence++, alias: this.service.LoginUserInfo.member_id.toString() })
        //存储用户信息
        localStorage.setItem('LoginUserInfo', JSON.stringify(this.service.LoginUserInfo));
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      }
      else {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
    }, error => {
      this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
    })
  }
  //前往注册
  toregister() {
    this.navCtrl.push(RegisterPage);
  }
  //找回密码
  resetpwd() {
    this.navCtrl.push(ResetpwdPage);
  }


}
