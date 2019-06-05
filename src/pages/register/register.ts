import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  phoneCode: number = 0;
  reg_param = {
    phone: null,
    valid_code: null,
    password: null,
    type: null
  }
  constructor(public navCtrl: NavController, public service: AppService) {

  }
  backHome() {
    this.navCtrl.pop();
  }
  ionViewWillEnter() {
    this.service.statusBar.styleBlackTranslucent();
  }
  //获取验证码
  getCode() {
    if (this.phoneCode == 0) {
      if (!this.reg_param.phone) {
        this.service.dialogs.alert('请输入手机', '提示', '确定');
        return false;
      }
      if (/^1[34578]\d{9}$/.test(this.reg_param.phone)) {
        this.reg_param.type = 'changePhone';
      }
      else {
        this.service.dialogs.alert('请输入正确的手机号码', '提示', '确定');
        return false;
      }
      this.phoneCode = 60;
      this.upCodeNum();
      this.service.post('/api/validCode/sendValidCode', {
        phone: this.reg_param.phone,
        type: this.reg_param.type
      }).then(success => {
        console.log(success);
      }, error => {
        this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
      })
    }
  }
  //更新数字
  upCodeNum() {
    if (this.phoneCode > 0) {
      this.phoneCode -= 1;
      setTimeout(() => {
        this.upCodeNum();
      }, 1000)
    }
    else {
      this.phoneCode = 0;
    }
  }
  //注册用户
  subUserForm() {
    if (!this.reg_param.phone) {
      this.service.dialogs.alert('请输入手机号码', '提示', '确定');
      return false;
    }
    if (!this.reg_param.valid_code) {
      this.service.dialogs.alert('请输入验证码', '提示', '确定');
      return false;
    }
    if (!this.reg_param.password) {
      this.service.dialogs.alert('请输入密码', '提示', '确定');
      return false;
    }
    if (/^1[34578]\d{9}$/.test(this.reg_param.phone)) {
      this.reg_param.type = 'changePhone';
      this.viladate_code();
    }
    else {
      this.service.dialogs.alert('请输入正确的手机号码', '提示', '确定');
    }
  }
  viladate_code() {
    this.service.post('/api/member/register', this.reg_param).then(success => {
      console.log(success);
      if (success.code == 0) {
        this.service.dialogs.alert('恭喜你注册成功!', '提示', '确定').then(() => {
          this.backHome();
        });
      }
      else {
        this.service.dialogs.alert(success.message,'提示', '确定');
      }
    }, error => {
      this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
    })
  }
}
