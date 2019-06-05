"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var register_1 = require("../register/register");
var resetpwd_1 = require("../resetpwd/resetpwd");
var LoginPage = (function () {
    function LoginPage(navCtrl, service, tab) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.tab = tab;
        this.param = {
            phone: null,
            password: null
        };
    }
    LoginPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleBlackTranslucent();
    };
    LoginPage.prototype.ionViewWillLeave = function () {
        this.service.statusBar.styleDefault();
    };
    LoginPage.prototype.backHome = function () {
        if (jQuery.readerParam) {
            this.service.dialogs.alert('请先登录!', '提示', '确定');
        }
        else {
            this.navCtrl.pop();
        }
    };
    //登录
    LoginPage.prototype.tologin = function () {
        var _this = this;
        if (!this.param.account) {
            this.service.dialogs.alert('请填写登录账号', '提示', '确定');
            return false;
        }
        if (!this.param.pwd) {
            this.service.dialogs.alert('请填写登录密码', '提示', '确定');
            return false;
        }
        this.service.post('/v2/api/mobile/login', this.param).then(function (success) {
            if (success.code == 0) {
                _this.service.LoginUserInfo = success.data;
                _this.service.LoginUserInfo.pwd = _this.param.pwd;
                _this.service.token = success.data.token;
                //存储用户信息
                localStorage.setItem('LoginUserInfo', JSON.stringify(_this.service.LoginUserInfo));
                _this.service.unRefreshBookshelf = true;
                console.log(_this.service.LoginUserInfo);
                _this.tab.select(0);
                _this.navCtrl.popToRoot();
            }
            else {
                _this.service.dialogs.alert(success.message, '提示', '确定');
            }
        }, function (error) {
            _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
        });
    };
    //前往注册
    LoginPage.prototype.toregister = function () {
        this.navCtrl.push(register_1.RegisterPage);
    };
    //找回密码
    LoginPage.prototype.resetpwd = function () {
        this.navCtrl.push(resetpwd_1.ResetpwdPage);
    };
    //进行注册
    LoginPage.prototype.reg_user = function (userId) {
        var _this = this;
        this.service.loadingStart();
        this.service.post("/v2/api/mobile/registe", {
            account: userId,
            pwd: '123456'
        }).then(function (success) {
            _this.service.post('/v2/api/mobile/login', {
                account: userId,
                pwd: '123456'
            }).then(function (success) {
                _this.service.loadingEnd();
                if (success.code == 0) {
                    _this.service.LoginUserInfo = success.data;
                    _this.service.LoginUserInfo.pwd = '123456';
                    _this.service.token = success.data.token;
                    //存储用户信息
                    localStorage.setItem('LoginUserInfo', JSON.stringify(_this.service.LoginUserInfo));
                    _this.service.unRefreshBookshelf = true;
                    _this.navCtrl.popToRoot();
                }
                else {
                    _this.service.dialogs.alert(success.message, '提示', '确定');
                }
            }, function (err) {
                _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            });
        }, function (err) {
            _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
        });
    };
    //微信登录
    LoginPage.prototype.weixin_login = function () {
        var _this = this;
        var scope = 'snsapi_userinfo';
        var state = '_' + (+new Date());
        Wechat.auth(scope, state, function (response) {
            var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx1726323de580e8ba&secret=80448ccbd8c9ef57a16d5a15d3dfc269&code=" + response.code + "&grant_type=authorization_code";
            _this.service.post('/v3/otherMember/getJSONString', {
                otherURL: url
            }).then(function (res) {
                var jsonData = JSON.parse(res.data);
                _this.reg_user(jsonData.openid);
                // let url_1 = "https://api.weixin.qq.com/sns/userinfo?access_token=" + jsonData.access_token + "&openid=" + jsonData.openid + "&lang=zh_CN";
                // this.service.post('/v3/otherMember/getJSONString', {
                //   otherURL: url_1
                // }).then(res_1 => {
                //   alert(res_1.data)
                // })
            }, function (err) {
                _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            });
        }, function (reason) {
            _this.service.dialogs.alert(reason, '提示', '确定');
        });
    };
    //qq 登录
    LoginPage.prototype.qq_login = function () {
        var _this = this;
        var args = {
            client: QQSDK.ClientType.QQ
        };
        QQSDK.checkClientInstalled(function () {
            QQSDK.ssoLogin(function (result) {
                _this.reg_user(result.userid);
            }, function (failReason) {
                console.log(JSON.stringify(failReason));
            }, args);
        }, function (error) {
            _this.service.dialogs.alert('未检测到QQ应用的安装，无法使用QQ第三方登录', '提示', '确定');
        }, args);
    };
    //微博登录
    LoginPage.prototype.weibo_login = function () {
        var _this = this;
        WeiboSDK.ssoLogin(function (args) {
            console.log(JSON.stringify(args));
            _this.reg_user(args.userId);
            // alert('access token is ' + args.access_token);
            // alert('userId is ' + args.userId);
            // alert('expires_time is ' + new Date(parseInt(args.expires_time)) + ' TimeStamp is ' + args.expires_time);
        }, function (failReason) {
            _this.service.dialogs.alert(failReason, '提示', '确定');
        });
    };
    return LoginPage;
}());
LoginPage = __decorate([
    core_1.Component({
        selector: 'page-login',
        templateUrl: 'login.html'
    })
], LoginPage);
exports.LoginPage = LoginPage;
