import { Component, ViewChild } from '@angular/core';
import { Platform, IonicApp, Nav, ToastController, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppService } from './app.service';
import { Device } from '@ionic-native/device';
import { HomePage } from '../pages/home/home'
import { LoginPage } from '../pages/login/login'
import { MyShengHuoFuWuPage } from '../pages/my-sheng-huo-fu-wu/my-sheng-huo-fu-wu';
import { ZaiXianBaoXiuPage } from '../pages/zai-xian-bao-xiu/zai-xian-bao-xiu';
import { TouSuJianYiPage } from '../pages/tou-su-jian-yi/tou-su-jian-yi';
import { YiJianDiaoChaPage } from '../pages/yi-jian-diao-cha/yi-jian-diao-cha';
import { TuiSongXiaoXiPage } from '../pages/tui-song-xiao-xi/tui-song-xiao-xi';
import { Myinfo } from '../pages/myInfo/myinfo';
import { JPush } from '@jiguang-ionic/jpush';
declare let cordova: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  @ViewChild('mycontent') nav: Nav;
  public registrationId: string;
  devicePlatform: string;
  sequence: number = 0;

  // //标签结果处理
  // tagResultHandler = function (result) {
  //   var sequence: number = result.sequence;
  //   var tags: Array<string> = result.tags == null ? [] : result.tags;
  //   alert('Success!' + '\nSequence: ' + sequence + '\nTags: ' + tags.toString());
  // };

  // //别名结果处理
  // aliasResultHandler = function (result) {
  //   var sequence: number = result.sequence;
  //   var alias: string = result.alias;
  //   alert('Success!' + '\nSequence: ' + sequence + '\nAlias: ' + alias);
  // };

  // //错误处理
  // errorHandler = function (err) {
  //   var sequence: number = err.sequence;
  //   var code = err.code;
  //   alert('Error!' + '\nSequence: ' + sequence + '\nCode: ' + code);
  // };
  constructor(public jpush: JPush, public menuCtrl: MenuController, public ionicApp: IonicApp, device: Device, private platform: Platform, private splashScreen: SplashScreen, public service: AppService, public toastCtrl: ToastController) {
    platform.ready().then(() => {
      this.service.init(() => {
        //判断是否有网络
        if (this.service.getNetEork() != 'none' || this.service.platformName == 'weixin') {
          this.service.post('/api/wy/org/list', {}).then(success => {
            if (success.code == 0) {
              this.service.orgList = success.data;
              if (!this.service.LoginUserInfo.org_id) {
                this.service.LoginUserInfo.org_id = this.service.orgList[0].org_id;
              }
              this.jpush.setTags({ sequence: this.sequence++, tags: [this.service.LoginUserInfo.org_id.toString()] })
              if (this.service.LoginUserInfo.member_id) {
                this.jpush.setAlias({ sequence: this.sequence++, alias: this.service.LoginUserInfo.member_id.toString() })
              }
              this.rootPage = HomePage;
              this.splashScreen.hide();
            }
          })
        }
        else {
          //隐藏启动页
          this.splashScreen.hide();
        }
        if (platform.is('ios')) {
          let
            appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
            appElHeight = appEl.clientHeight;

          cordova.plugins.Keyboard.disableScroll(true);

          window.addEventListener('native.keyboardshow', (e) => {
            appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
          });

          window.addEventListener('native.keyboardhide', () => {
            appEl.style.height = '100%';
          });
        }
      });
    });
    // this.jpush.init();
    this.devicePlatform = device.platform;
    //处于后台，收到推送通知，点击通知进入app，jpush.receiveNotification不会触发
    // document.addEventListener('jpush.receiveNotification', (event: any) => {
    //   var content;
    //   if (this.devicePlatform == 'Android') {
    //     content = event.alert;
    //   } else {
    //     content = event.aps.alert;
    //   }
    //   alert('receive local notification: ' + JSON.stringify(event));
    // }, false);

    //处于后台，收到推送通知，点击通知进入app，jpush.openNotification方法会触发
    document.addEventListener('jpush.openNotification', (event: any) => {
      var content;
      if (this.devicePlatform == 'Android') {
        content = event.alert;
      } else {  // iOS
        if (event.aps == undefined) { // 本地通知
          content = event.content;
        } else {  // APNS
          content = event.aps.alert;
        }
      }
      console.log(content)
      this.nav.push(TuiSongXiaoXiPage)
    }, false);

    // document.addEventListener('jpush.receiveLocalNotification', (event: any) => {
    //   // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发。
    //   var content;
    //   if (this.devicePlatform == 'Android') {
    //   } else {
    //     content = event.content;
    //   }
    //   // alert('receive local notification: ' + JSON.stringify(event));
    // }, false);
  }

  //获取设备ID
  getRegistrationID() {
    this.jpush.getRegistrationID()
      .then(rId => {
        this.registrationId = rId;
      });
  }

  // //设置标签
  // setTags() {
  //   this.jpush.setTags({ sequence: this.sequence++, tags: ['Tag1', 'Tag2'] })
  //     .then(this.tagResultHandler)
  //     .catch(this.errorHandler);
  // }

  // //新增标签
  // addTags() {
  //   this.jpush.addTags({ sequence: this.sequence++, tags: ['Tag3', 'Tag4'] })
  //     .then(this.tagResultHandler)
  //     .catch(this.errorHandler);
  // }

  // checkTagBindState() {
  //   this.jpush.checkTagBindState({ sequence: this.sequence++, tag: 'Tag1' })
  //     .then(result => {
  //       var sequence = result.sequence;
  //       var tag = result.tag;
  //       var isBind = result.isBind;
  //       alert('Sequence: ' + sequence + '\nTag: ' + tag + '\nIsBind: ' + isBind);
  //     }).catch(this.errorHandler);
  // }

  // //删除标签
  // deleteTags() {
  //   this.jpush.deleteTags({ sequence: this.sequence++, tags: ['Tag4'] })
  //     .then(this.tagResultHandler)
  //     .catch(this.errorHandler);
  // }

  // //获取所有标签
  // getAllTags() {
  //   this.jpush.getAllTags({ sequence: this.sequence++ })
  //     .then(this.tagResultHandler)
  //     .catch(this.errorHandler);
  // }

  // //清空标签
  // cleanTags() {
  //   this.jpush.cleanTags({ sequence: this.sequence++ })
  //     .then(this.tagResultHandler)
  //     .catch(this.errorHandler);
  // }

  // //设置别名
  // setAlias() {
  //   this.jpush.setAlias({ sequence: this.sequence++, alias: 'TestAlias' })
  //     .then(this.aliasResultHandler)
  //     .catch(this.errorHandler);
  // }

  // //获取别名
  // getAlias() {
  //   this.jpush.getAlias({ sequence: this.sequence++ })
  //     .then(this.aliasResultHandler)
  //     .catch(this.errorHandler);
  // }

  // //删除别名
  // deleteAlias() {
  //   this.jpush.deleteAlias({ sequence: this.sequence++ })
  //     .then(this.aliasResultHandler)
  //     .catch(this.errorHandler);
  // }

  // //发送测试消息
  // addLocalNotification() {
  //   if (this.devicePlatform == 'Android') {
  //     this.jpush.addLocalNotification(0, 'Hello JPush', 'JPush', 1, 5000);
  //   } else {
  //     this.jpush.addLocalNotificationForIOS(5, 'Hello JPush', 1, 'localNoti1');
  //   }
  // }
  //去个人信息
  toMyInfo() {
    this.menuCtrl.close();
    this.nav.push(Myinfo);
  }

  toMyShengHuoFuWu() {
    this.menuCtrl.close();
    this.nav.push(MyShengHuoFuWuPage);
  }
  toZaiXianBaoXiu() {
    this.menuCtrl.close();
    this.nav.push(ZaiXianBaoXiuPage);
  }
  toTouSuJianYi() {
    this.menuCtrl.close();
    this.nav.push(TouSuJianYiPage);
  }
  toYiJianDiaoCha() {
    this.menuCtrl.close();
    this.nav.push(YiJianDiaoChaPage);
  }
  toTuiSongXiaoXi() {
    this.menuCtrl.close();
    this.nav.push(TuiSongXiaoXiPage)
  }
  //退出登录
  loginOut() {
    this.service.LoginUserInfo.member_token = null;
    localStorage.setItem('LoginUserInfo', JSON.stringify(this.service.LoginUserInfo))
    this.service.token = null;
    this.menuCtrl.close();
    this.nav.setRoot(LoginPage)
    this.nav.popToRoot()
  }
  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'top'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
}
