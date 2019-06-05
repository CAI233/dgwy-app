import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';

//页面
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ResetpwdPage } from '../pages/resetpwd/resetpwd';
import { DongGuangFengCaiPage } from '../pages/dong-guang-feng-cai/dong-guang-feng-cai';
import { DongGuangFengCaiDetailPage } from '../pages/dong-guang-feng-cai-detail/dong-guang-feng-cai-detail';
import { ZaiXianBaoXiuPage } from '../pages/zai-xian-bao-xiu/zai-xian-bao-xiu';
import { ZaiXianBaoXiuAddPage } from '../pages/zai-xian-bao-xiu-add/zai-xian-bao-xiu-add';
import { ZaiXianBaoXiuDetailPage } from '../pages/zai-xian-bao-xiu-detail/zai-xian-bao-xiu-detail';
import { YiJianDiaoChaPage } from '../pages/yi-jian-diao-cha/yi-jian-diao-cha';
import { YiJianDiaoChaDetailPage } from '../pages/yi-jian-diao-cha-detail/yi-jian-diao-cha-detail';
import { NianKaChaXunPage } from '../pages/nian-ka-cha-xun/nian-ka-cha-xun';
import { YuanQuHuoDongPage } from '../pages/yuan-qu-huo-dong/yuan-qu-huo-dong';
import { YuanQuHuoDongDetailPage } from '../pages/yuan-qu-huo-dong-detail/yuan-qu-huo-dong-detail';
import { ZhouBianTuiJianPage } from '../pages/zhou-bian-tui-jian/zhou-bian-tui-jian';
import { ZhouBianTuiJianDetailPage } from '../pages/zhou-bian-tui-jian-detail/zhou-bian-tui-jian-detail';
import { TouSuJianYiPage } from '../pages/tou-su-jian-yi/tou-su-jian-yi';
import { TouSuJianYiAddPage } from '../pages/tou-su-jian-yi-add/tou-su-jian-yi-add';
import { TouSuJianYiDetailPage } from '../pages/tou-su-jian-yi-detail/tou-su-jian-yi-detail';
import { ShengHuoFuWuPage } from '../pages/sheng-huo-fu-wu/sheng-huo-fu-wu';
import { MyShengHuoFuWuPage } from '../pages/my-sheng-huo-fu-wu/my-sheng-huo-fu-wu';
import { ShengHuoFuWuAddPage } from '../pages/sheng-huo-fu-wu-add/sheng-huo-fu-wu-add';
import { ShengHuoFuWuDetailPage } from '../pages/sheng-huo-fu-wu-detail/sheng-huo-fu-wu-detail';
import { DangJianDongTaiPage } from '../pages/dang-jian-dong-tai/dang-jian-dong-tai';
import { DangJianDongTaiDetailPage } from '../pages/dang-jian-dong-tai-detail/dang-jian-dong-tai-detail';
import { TongZhiGongGaoPage } from '../pages/tong-zhi-gong-gao/tong-zhi-gong-gao';
import { TongZhiGongGaoDetailPage } from '../pages/tong-zhi-gong-gao-detail/tong-zhi-gong-gao-detail';
import { TuiSongXiaoXiPage } from '../pages/tui-song-xiao-xi/tui-song-xiao-xi';
import { TuiSongXiaoXiDetailPage } from '../pages/tui-song-xiao-xi-detail/tui-song-xiao-xi-detail';

//插件
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';
import { Dialogs } from '@ionic-native/dialogs';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { JPush } from '@jiguang-ionic/jpush'

//公共服务
import { Http, HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { HttpService } from './http.service';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions) {
  let service = new HttpService(xhrBackend, requestOptions);
  return service;
}

@NgModule({
  declarations: [
    MyApp, HomePage, LoginPage, RegisterPage, ResetpwdPage,YiJianDiaoChaDetailPage,TuiSongXiaoXiPage,TuiSongXiaoXiDetailPage,MyShengHuoFuWuPage,
    DongGuangFengCaiPage,DongGuangFengCaiDetailPage, ZaiXianBaoXiuPage, ZaiXianBaoXiuAddPage,ZaiXianBaoXiuDetailPage, YiJianDiaoChaPage, NianKaChaXunPage,
    YuanQuHuoDongPage, YuanQuHuoDongDetailPage, ZhouBianTuiJianPage, ZhouBianTuiJianDetailPage, TouSuJianYiPage,TouSuJianYiAddPage,TouSuJianYiDetailPage,
    ShengHuoFuWuPage,ShengHuoFuWuAddPage,ShengHuoFuWuDetailPage,DangJianDongTaiPage, DangJianDongTaiDetailPage, TongZhiGongGaoPage, TongZhiGongGaoDetailPage,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      pageTransition: 'md-transition',
      backButtonText: '',
      backButtonIcon: 'iconfont-icon-rt',//按钮图标样式
      // tabsHideOnSubPages: 'true' //隐藏全部子页面tabs
    })
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, HomePage, LoginPage, RegisterPage, ResetpwdPage,YiJianDiaoChaDetailPage,TuiSongXiaoXiPage,TuiSongXiaoXiDetailPage,MyShengHuoFuWuPage,
    DongGuangFengCaiPage,DongGuangFengCaiDetailPage, ZaiXianBaoXiuPage, ZaiXianBaoXiuAddPage,ZaiXianBaoXiuDetailPage, YiJianDiaoChaPage, NianKaChaXunPage,
    YuanQuHuoDongPage, YuanQuHuoDongDetailPage, ZhouBianTuiJianPage, ZhouBianTuiJianDetailPage, TouSuJianYiPage,TouSuJianYiAddPage,TouSuJianYiDetailPage,
    ShengHuoFuWuPage, ShengHuoFuWuAddPage,ShengHuoFuWuDetailPage,DangJianDongTaiPage, DangJianDongTaiDetailPage, TongZhiGongGaoPage, TongZhiGongGaoDetailPage
  ],
  providers: [
    HttpService,
    {
      provide: Http,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions]
      
    },
    StatusBar, SplashScreen,
    AppService,
    JPush,
    Device, Dialogs, File, FileTransfer,
    ImagePicker, BarcodeScanner, Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
}
