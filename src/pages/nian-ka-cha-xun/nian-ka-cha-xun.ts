import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';

import { LoginPage } from '../login/login'
@Component({
  selector: 'page-nkcx',
  templateUrl: 'nian-ka-cha-xun.html'
})
export class NianKaChaXunPage {
  data: any = [];
  constructor(public navCtrl: NavController, public service: AppService) { }

  ionViewDidLoad() {
    this.service.loadingStart();
    this.service.post('/api/car/detail', {}).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.data = success.data;
        this.data.forEach(element => {
          let endTime = new Date(element.end_time).getTime();
          let dqTime = new Date().getTime();
          let tt: any = (endTime - dqTime) / 1000 / 60 / 60 / 24;
          if (parseInt(tt) <= 10) {
            element.end_status = true;
          }
        });
      }
    })
  }

  
}
