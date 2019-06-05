"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ResetpwdPage = (function () {
    function ResetpwdPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.phoneCode = 0;
        this.reg_param = {
            account: null,
            code: null,
            newPwd: null,
            type: null
        };
    }
    ResetpwdPage.prototype.backHome = function () {
        this.navCtrl.pop();
    };
    ResetpwdPage.prototype.ionViewWillEnter = function () {
        this.service.statusBar.styleBlackTranslucent();
    };
    //获取验证码
    ResetpwdPage.prototype.getCode = function () {
        var _this = this;
        if (this.phoneCode == 0) {
            if (!this.reg_param.account) {
                this.service.dialogs.alert('请输入手机或者邮箱', '提示', '确定');
                return false;
            }
            if (/^1[34578]\d{9}$/.test(this.reg_param.account)) {
                this.reg_param.type = 'changePhone';
            }
            else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.reg_param.account)) {
                this.reg_param.type = 'changeEmail';
            }
            else {
                this.service.dialogs.alert('请输入正确的手机号码或邮箱地址', '提示', '确定');
                return false;
            }
            this.phoneCode = 60;
            this.upCodeNum();
            this.service.post('/v2/api/mobile/validCode/sendValidCode', {
                account: this.reg_param.account,
                type: this.reg_param.type
            }).then(function (success) {
                console.log(success);
            }, function (error) {
                _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
            });
        }
    };
    //更新数字
    ResetpwdPage.prototype.upCodeNum = function () {
        var _this = this;
        if (this.phoneCode > 0) {
            this.phoneCode -= 1;
            setTimeout(function () {
                _this.upCodeNum();
            }, 1000);
        }
        else {
            this.phoneCode = 0;
        }
    };
    //注册用户
    ResetpwdPage.prototype.subUserForm = function () {
        if (!this.reg_param.account) {
            this.service.dialogs.alert('请输入手机或者邮箱', '提示', '确定');
            return false;
        }
        if (!this.reg_param.code) {
            this.service.dialogs.alert('请输入验证码', '提示', '确定');
            return false;
        }
        if (!this.reg_param.newPwd) {
            this.service.dialogs.alert('请输入密码', '提示', '确定');
            return false;
        }
        if (/^1[34578]\d{9}$/.test(this.reg_param.account)) {
            this.reg_param.type = 'changePhone';
            this.viladate_code();
        }
        else if (/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(this.reg_param.account)) {
            this.reg_param.type = 'changeEmail';
            this.viladate_code();
        }
        else {
            this.service.dialogs.alert('请输入正确的手机号码或邮箱地址', '提示', '确定');
        }
    };
    ResetpwdPage.prototype.viladate_code = function () {
        var _this = this;
        this.service.post('/v2/api/mobile/validCode/matchValidCode', this.reg_param).then(function (success) {
            if (success.code == 0) {
                _this.service.post('/v2/api/mobile/forgetPwd', _this.reg_param).then(function (success) {
                    if (success.code == 0) {
                        _this.service.dialogs.alert('密码已重新修改，请牢记并妥善保管!', '提示', '确定').then(function () {
                            _this.backHome();
                        });
                    }
                    else {
                        _this.service.dialogs.alert(success.message, '修改失败', '确定');
                    }
                });
            }
            else {
                _this.service.dialogs.alert('验证码不正确，请重新获取', '提示', '确定');
            }
        }, function (error) {
            _this.service.dialogs.alert('网络异常，请检查你的网络状态正常后再试!', '提示', '确定');
        });
    };
    return ResetpwdPage;
}());
ResetpwdPage = __decorate([
    core_1.Component({
        selector: 'page-resetpwd',
        templateUrl: 'resetpwd.html'
    })
], ResetpwdPage);
exports.ResetpwdPage = ResetpwdPage;
