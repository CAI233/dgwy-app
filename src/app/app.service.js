"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppService = (function () {
    function AppService(loadingCtrl, http, device, ngFile, dialogs, transfer, statusBar) {
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.device = device;
        this.ngFile = ngFile;
        this.dialogs = dialogs;
        this.transfer = transfer;
        this.statusBar = statusBar;
        this.savePath = ''; //保存地址
        this.unRefreshBookshelf = false; //是否刷新书架
        this.updateBookInfoReviews = false;
        this.network = 'wifi';
        // this.ctxPath = 'http://cjzww.cjszyun.cn';
        this.ctxPath = 'http://cjzww.cjszyun.net';
    }
    //服务初始化
    AppService.prototype.init = function (callback) {
        var _this = this;
        this.version = '2.2.7';
        this.version_code = 227;
        this.version_remark = '长江阅读APP发布!';
        this.platformName = this.device.platform ? this.device.platform.toLocaleLowerCase() : 'weixin';
        this.LoginUserInfo = JSON.parse(localStorage.getItem('LoginUserInfo'));
        this.token = this.LoginUserInfo ? this.LoginUserInfo.token : null;
        if (callback) {
            callback();
        }
        if (this.platformName != 'weixin') {
            //初始化文件对象
            this.fileTransfer = this.transfer.create();
            if (this.platformName == 'ios') {
                //文件存储路径
                this.savePath = this.ngFile.dataDirectory;
            }
            else {
                //文件存储路径
                this.savePath = this.ngFile.externalApplicationStorageDirectory;
            }
            //删除原来的目录
            //判断是否已经存在默认必须的3个文件路径  book  cover  user
            this.ngFile.checkDir(this.savePath + 'files/', 'book').then(function (success) {
                console.log('存在book目录');
            }, function (error) {
                _this.ngFile.createDir(_this.savePath + 'files/', 'book', false);
            });
            this.ngFile.checkDir(this.savePath + 'files/', 'cover').then(function (success) {
                console.log('存在cover目录');
            }, function (error) {
                _this.ngFile.createDir(_this.savePath + 'files/', 'cover', false);
            });
            this.ngFile.checkDir(this.savePath + 'files/', 'user').then(function (success) {
                console.log('存在user目录');
            }, function (error) {
                _this.ngFile.createDir(_this.savePath + 'files/', 'user', false);
            });
        }
    };
    AppService.prototype.loadingStart = function (txt) {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
    };
    AppService.prototype.loadingEnd = function () {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    };
    AppService.prototype.getNetEork = function () {
        return this.network;
    };
    AppService.prototype.post = function (url, body) {
        var _this = this;
        body = body ? body : {};
        body.token_type = this.platformName;
        body.member_token = this.token;
        body.client_type = 'DZ';
        url = url.indexOf('http://') == -1 || url.indexOf('https://') == -1 ? this.ctxPath + url : url;
        console.log(url);
        body = jQuery.param(body);
        console.log(body);
        //let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        //let options = new RequestOptions({headers: headers});
        this.network = 'wifi';
        var pos = this.http.post(url, body).toPromise();
        //异常就 设置为没有网络
        pos.catch(function (error) {
            _this.network = 'none';
        });
        return pos;
    };
    AppService.prototype.getUserInfo = function () {
        var _this = this;
        this.post('/v2/api/mobile/memberInfo').then(function (success) {
            var data = success.data;
            data.pwd = _this.LoginUserInfo.pwd;
            data.token = _this.LoginUserInfo.token;
            _this.LoginUserInfo = data;
            //存储用户信息
            localStorage.setItem('LoginUserInfo', JSON.stringify(_this.LoginUserInfo));
        });
    };
    return AppService;
}());
AppService = __decorate([
    core_1.Injectable()
], AppService);
exports.AppService = AppService;
