import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, Slides } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { DongGuangFengCaiPage } from '../dong-guang-feng-cai/dong-guang-feng-cai'
import { ZaiXianBaoXiuPage } from '../zai-xian-bao-xiu/zai-xian-bao-xiu'
import { YiJianDiaoChaPage } from '../yi-jian-diao-cha/yi-jian-diao-cha'
import { NianKaChaXunPage } from '../nian-ka-cha-xun/nian-ka-cha-xun'
import { YuanQuHuoDongPage } from '../yuan-qu-huo-dong/yuan-qu-huo-dong'
import { ZhouBianTuiJianPage } from '../zhou-bian-tui-jian/zhou-bian-tui-jian'
import { TouSuJianYiPage } from '../tou-su-jian-yi/tou-su-jian-yi'
import { ShengHuoFuWuPage } from '../sheng-huo-fu-wu/sheng-huo-fu-wu'
import { DangJianDongTaiPage } from '../dang-jian-dong-tai/dang-jian-dong-tai'
import { DangJianDongTaiDetailPage } from '../dang-jian-dong-tai-detail/dang-jian-dong-tai-detail'
import { TongZhiGongGaoPage } from '../tong-zhi-gong-gao/tong-zhi-gong-gao'
import { TongZhiGongGaoDetailPage } from '../tong-zhi-gong-gao-detail/tong-zhi-gong-gao-detail'
import { TuiSongXiaoXiPage } from '../tui-song-xiao-xi/tui-song-xiao-xi'
import { LoginPage } from '../login/login'
import { JPush } from '@jiguang-ionic/jpush';
declare let IScroll: any;
declare let jQuery: any;
declare let cordova: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('slides') slides: Slides;
  param: any = {
    adv_cat_code: 111,
    org_id: null,
  }
  myScroll: any;
  topHeight: number;
  header_blank: any;
  home_header: any;
  my_refresh: boolean = false; //自己刷新
  hiddenTop: boolean = false; // 是否隐藏头部
  myScroll_Y: number = 0; //滚动条初始值
  pageHome_bg: any; //背景

  adv: any = [];
  elegant: any = [];
  news: any = [];
  party: any = [];
  constructor(public navCtrl: NavController, public service: AppService, public menuCtrl: MenuController, public jpush: JPush) { }

  ionViewWillEnter() {
    if (this.myScroll) {
      setTimeout(() => {
        this.myScroll.refresh();
      }, 500);

    }
    if (cordova) {
      if (this.myScroll && this.myScroll.y < -this.topHeight) {
        this.service.statusBar.styleDefault();
      }
      else {
        this.service.statusBar.styleBlackTranslucent();
      }
    }
    this.getPush();
  }
  //打开侧单栏
  openMenu() {
    this.menuCtrl.open();
  }
  load() {
    this.service.loadingStart();
    this.param.org_id = this.service.LoginUserInfo.org_id
    this.service.post('/api/index/data', this.param).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.adv = success.data.adv;
        this.elegant = success.data.elegant;
        this.news = success.data.news;
        this.party = success.data.party;
      }
    })

  }
  getPush() {
    console.log('获取消息数量')
    this.service.post('/api/inform/push/list', {
      pageSize: 10000,
      pageNum: 1,
      type: 2,
      org_id: this.service.LoginUserInfo.org_id
    }).then(success => {
      if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.service.pushNum = 0;
        success.data.rows.forEach(element => {
          if (!element.click) {
            this.service.pushNum++
          }
        });
        this.jpush.setBadge(this.service.pushNum);
        this.jpush.setApplicationIconBadgeNumber(this.service.pushNum);
      }
    })
  }

  //东光风采
  toDongGuangFengCai() {
    this.navCtrl.push(DongGuangFengCaiPage)
  }
  //在线报修
  toZaiXianBaoXiu() {
    this.navCtrl.push(ZaiXianBaoXiuPage)
  }
  //意见调查
  toYiJianDiaoCha() {
    this.navCtrl.push(YiJianDiaoChaPage)
  }
  //年卡查询
  toNianKaChaXun() {
    this.navCtrl.push(NianKaChaXunPage)
  }
  //园区活动
  toYuanQuHuoDong() {
    this.navCtrl.push(YuanQuHuoDongPage)
  }
  //周边推荐
  toZhouBianTuiJian() {
    this.navCtrl.push(ZhouBianTuiJianPage)
  }
  //投诉建议
  toTouSuJianYi() {
    this.navCtrl.push(TouSuJianYiPage)
  }
  //生活服务
  toShengHuoFuWu() {
    this.navCtrl.push(ShengHuoFuWuPage)
  }
  //党建动态
  toDangJianDongTai() {
    this.navCtrl.push(DangJianDongTaiPage)
  }
  //通知公告
  toTongZhiGongGao() {
    this.navCtrl.push(TongZhiGongGaoPage)
  }
  //推送消息
  toTuiSongXiaoXi() {
    this.navCtrl.push(TuiSongXiaoXiPage)
  }

  //Dom加载完成
  ionViewDidLoad() {
    this.pageHome_bg = document.querySelector('page-home');
    this.topHeight = jQuery('body').height() * .3 - 64;
    console.log(this.topHeight)
    this.header_blank = jQuery('.plan-nav-2');
    this.home_header = jQuery('#home_title');
    this.myScroll = new IScroll('#wrapper', {
      scrollbars: false,
      mouseWheel: false,
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: true,
      scrollY: true,
      probeType: 3,
      bindToWrapper: true,
      click: true,
      deceleration: 0.0012,
      taps: true
    })

    //滚动中监控
    this.myScroll.on('scroll', () => {
      if (this.myScroll.y < 0) {
        let n: number = (Number)(Math.abs((this.myScroll.y > 0 ? 0 : this.myScroll.y / this.topHeight)).toFixed(2));
        this.header_blank.css('opacity', n);
        this.home_header.css('background', `rgba(255,255,255,${n})`);
        if (cordova) {
          if (n > 0.5) {
            this.service.statusBar.styleDefault();
          }
          else {
            this.service.statusBar.styleBlackTranslucent();
          }
        }
        if (n > 0.5) {
          this.home_header.css('box-shadow', '0 0 1px #ccc');
        }
        else {
          this.home_header.css('box-shadow', 'none');
        }
      }
      else {
        this.header_blank.css('opacity', 0);
        this.home_header.css('box-shadow', 'none');
        this.home_header.css('background', `rgba(255,255,255,0)`);
        if (cordova)
          this.service.statusBar.styleBlackTranslucent();
      }
      //放大背景
      if (this.myScroll.y > 0) {
        this.pageHome_bg.style.backgroundSize = (100 + this.myScroll.y / 2.5) + '%';
      }
      else {
        this.pageHome_bg.style.backgroundSize = '100%';
      }
    })
    this.myScroll.on('scrollStart', () => {
      this.myScroll_Y = this.myScroll.y;
    });
    this.myScroll.on('scrollEnd', () => {
      if (this.my_refresh) {
        return false;
      }
      if (this.myScroll_Y > this.myScroll.y) {
        if (this.myScroll.y + this.topHeight > 0) {
          this.my_refresh = true;
          setTimeout(() => {
            this.my_refresh = false;
          }, 500);
          this.myScroll.scrollTo(0, -this.topHeight, 200);
          this.hiddenTop = true;
        }
      }
      else if (this.myScroll.y != 0 && this.myScroll.y != this.topHeight) {
        if (this.myScroll.y + this.topHeight > 0) {
          this.my_refresh = true;
          setTimeout(() => {
            this.my_refresh = false;
          }, 500);
          this.myScroll.scrollTo(0, 0, 200);
        }
      }
    });
    this.load()
    this.myScroll.refresh();
  }

  //党建动态详情
  toDangJianDongTaiDetail(id) {
    this.navCtrl.push(DangJianDongTaiDetailPage, { id: id })
  }
  //通知公告详情
  toTongZhiGongGaoDetail(id) {
    this.navCtrl.push(TongZhiGongGaoDetailPage, { id: id })
  }
  //将要离开页面
  ionViewWillLeave() {
    if (cordova)
      this.service.statusBar.styleDefault();
  }
  //下拉刷型界面
  doRefresh(refresher) {
    this.param.org_id = this.service.LoginUserInfo.org_id
    this.service.post('/api/index/data', this.param).then(success => {
      setTimeout(() => {
        refresher.complete();
        if (success.code == 600) {
          this.navCtrl.push(LoginPage);
        }
        else if (success.code != 0) {
          this.service.dialogs.alert(success.message, '提示', '确定');
        }
        else {
          this.adv = success.data.adv;
          this.elegant = success.data.elegant;
          this.news = success.data.news;
          this.party = success.data.party;
        }
      }, 1000);
    })

  }
}
