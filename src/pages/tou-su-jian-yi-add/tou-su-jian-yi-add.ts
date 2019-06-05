import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginPage } from '../login/login'
import { ImagePicker } from '@ionic-native/image-picker';
@Component({
  selector: 'page-tsjya',
  templateUrl: 'tou-su-jian-yi-add.html'
})
export class TouSuJianYiAddPage {
  files: any = [];
  addParam: any = {
    org_id: this.service.LoginUserInfo.org_id,
    content: '',
    img_path: [],
  }
  constructor(public navCtrl: NavController, public actionsheetCtrl: ActionSheetController,
    public camera: Camera, private service: AppService, public imagePicker: ImagePicker) {
  }
  set_user_head() {
    if (this.files.length == 6) {
      this.service.dialogs.alert("只能上传6张图片", '提示', '确定');
      return false;
    }
    let actionSheet = this.actionsheetCtrl.create({
      title: '',
      cssClass: 'action-my-sheets',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          icon: 'pp-center',
          handler: () => {
            this.paizhao();
          }
        },
        {
          text: '从相册选择',
          icon: 'pp-center',
          handler: () => {
            this.xiangche();
          }
        }
      ]
    });
    actionSheet.present();
  }
  paizhao() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG
    }
    this.camera.getPicture(options).then((imageURI) => {
      this.uploadFile(imageURI);
    }, (err) => {
      //this.service.dialogs.alert(err, '提示', '确定');
    });
  }
  xiangche() {
    const options: any = {
      maximumImagesCount: 6
    }
    this.imagePicker.getPictures(options).then((results) => {
      if (this.files.length + results.length > 6) {
        this.service.dialogs.alert("只能上传6张图片", '提示', '确定');
        return false;
      }
      for (var i = 0; i < results.length; i++) {
        this.uploadFile(results[i]);
      }
    }, (err) => {
      this.service.dialogs.alert(err, '提示', '确定');
    });
  }
  uploadFile(imageURI) {
    if (imageURI) {
      let url = '';
      url = this.service.ctxPath + "/file/upload";
      this.service.loadingStart();
      this.service.fileTransfer.upload(imageURI, encodeURI(url)).then(result => {
        this.service.loadingEnd();
        let res = eval("(" + result.response + ")");
        if (res.data[0].url) {
          this.files.push(res.data[0].url)
        }
      }, err => {
        this.service.loadingEnd();
        this.service.dialogs.alert(err, '提示', '确定');
      })
    }
  }

  //删除
  removeFile(index) {
    this.files.splice(index, 1);
  }
  //提交
  formSubmit() {
    if (!this.addParam.content) {
      this.service.dialogs.alert("请输入您的建议", '提示', '确定');
      return false;
    }
    this.addParam.img_path = this.files.join(',');
    this.service.loadingStart();
    this.service.post('/api/complaint/add/complaint', this.addParam).then(success => {
      this.service.loadingEnd();
      if (success.code == 600) {
        this.navCtrl.push(LoginPage);
      }
      else if (success.code != 0) {
        this.service.dialogs.alert(success.message, '提示', '确定');
      }
      else {
        this.navCtrl.pop()
      }
    })
  }
}
