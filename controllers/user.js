import md5 from "blueimp-md5";
import svgCaptcha from "svg-captcha";
import moment from "moment";
import request from "request";
import { Base64 } from "js-base64";

import UserModel from "../models/UserModel.js";

const users = {};

export const userLoginPWD = function (req, res) {
  const name = req.body.name;
  const pwd = md5(req.body.pwd);
  const captcha = req.body.captcha.toLowerCase();
  console.log("/login_pwd", name, pwd, captcha, req.session);
  if (captcha !== req.session.captcha) {
    return res.send({ code: 1, msg: "wrong verification code" });
  }
  delete req.session.captcha;
  UserModel.findOne({ name }, function (err, user) {
    if (user) {
      console.log("findUser", user);
      if (user.pwd !== pwd) {
        res.send({ code: 1, msg: "wrong username or password!" });
      } else {
        req.session.userid = user._id;
        res.send({
          code: 0,
          data: { _id: user._id, name: user.name, phone: user.phone },
        });
      }
    } else {
      const userModel = new UserModel({ name, pwd });
      userModel.save(function (err, user) {
        // 向浏览器端返回cookie(key=value)
        // res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
        req.session.userid = user._id;
        const data = { _id: user._id, name: user.name };
        // 3.2. 返回数据(新的user)
        res.send({ code: 0, data });
      });
    }
  });
};

export const getCaptcha = function (req, res) {
  let captcha = svgCaptcha.create({
    ignoreChars: "0o1l",
    noise: 2,
    color: true,
  });
  req.session.captcha = captcha.text.toLowerCase();
  console.log(req.session.captcha);
  /*res.type('svg');                                                                                
      res.status(200).send(captcha.data);*/
  res.type("svg");
  res.send(captcha.data);
};

function randomCode(length) {
  var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var result = ""; //统一改名: alt + shift + R
  for (var i = 0; i < length; i++) {
    var index = Math.ceil(Math.random() * 9);
    result += chars[index];
  }
  return result;
}

function sendCodeCloopen(phone, code, callback) {
  var ACCOUNT_SID = "8aaf070855b647ab0155b9f80994058a";
  var AUTH_TOKEN = "aa8aa679414e49df8908ea5b3d043c24";
  var Rest_URL = "https://app.cloopen.com:8883";
  var AppID = "8aaf070855b647ab0155b9f809f90590";
  //1. 准备请求url
  /*                                                                                                                                          
     1.使用MD5加密（账户Id + 账户授权令牌 + 时间戳）。其中账户Id和账户授权令牌根据url的验证级别对应主账户。                                     
     时间戳是当前系统时间，格式"yyyyMMddHHmmss"。时间戳有效时间为24小时，如：20140416142030                                                     
     2.SigParameter参数需要大写，如不能写成sig=abcdefg而应该写成sig=ABCDEFG                                                                     
     */
  var sigParameter = "";
  var time = moment().format("YYYYMMDDHHmmss");
  sigParameter = md5(ACCOUNT_SID + AUTH_TOKEN + time);
  var url =
    Rest_URL +
    "/2013-12-26/Accounts/" +
    ACCOUNT_SID +
    "/SMS/TemplateSMS?sig=" +
    sigParameter;

  //2. 准备请求体
  var body = {
    to: phone,
    appId: AppID,
    templateId: "1",
    datas: [code, "1"],
  };
  //body = JSON.stringify(body);
  //3. 准备请求头
  /*                                                                                                                                          
     1.使用Base64编码（账户Id + 冒号 + 时间戳）其中账户Id根据url的验证级别对应主账户                                                            
     2.冒号为英文冒号                                                                                                                           
     3.时间戳是当前系统时间，格式"yyyyMMddHHmmss"，需与SigParameter中时间戳相同。                                                               
     */
  var authorization = ACCOUNT_SID + ":" + time;
  authorization = Base64.encode(authorization);
  var headers = {
    Accept: "application/json",
    "Content-Type": "application/json;charset=utf-8",
    "Content-Length": JSON.stringify(body).length + "",
    Authorization: authorization,
  };

  //4. 发送请求, 并得到返回的结果, 调用callback
  // callback(true);
  request(
    {
      method: "POST",
      url: url,
      headers: headers,
      body: body,
      json: true,
    },
    function (error, response, body) {
      console.log(error, response, body);
      callback(body.statusCode === "000000");
      // callback(true);
    }
  );
}

export const sendCode = function (req, res, next) {
  //1. 获取请求参数数据
  var phone = req.query.phone;
  //2. 处理数据
  //生成验证码(6位随机数)
  var code = randomCode(6);
  //发送给指定的手机号
  console.log(`send to phone ${phone} SMS code ${code}`);
  sendCodeCloopen(phone, code, function (success) {
    //success表示是否成功
    if (success) {
      users[phone] = code;
      console.log("save verification code: ", phone, code);
      res.send({ code: 0 });
    } else {
      //3. 返回响应数据
      res.send({ code: 1, msg: "error sending SMS verification code!" });
    }
  });
};

export const userLoginSMS = function (req, res, next) {
  var phone = req.body.phone;
  var code = req.body.code;
  console.log("/login_sms", phone, code);
  if (users[phone] != code) {
    res.send({ code: 1, msg: "wrong phone number or verification code!" });
    return;
  }
  //删除保存的code
  delete users[phone];

  UserModel.findOne({ phone }, function (err, user) {
    if (user) {
      req.session.userid = user._id;
      res.send({ code: 0, data: user });
    } else {
      //存储数据
      const userModel = new UserModel({ phone });
      userModel.save(function (err, user) {
        req.session.userid = user._id;
        res.send({ code: 0, data: user });
      });
    }
  });
};

export const getUserInfo = function (req, res) {
  const userid = req.session.userid;
  // 查询
  UserModel.findOne({ _id: userid }, _filter, function (err, user) {
    // 如果没有, 返回错误提示
    if (!user) {
      // 清除浏览器保存的userid的cookie
      delete req.session.userid;

      res.send({ code: 1, msg: "please login" });
    } else {
      // 如果有, 返回user
      res.send({ code: 0, data: user });
    }
  });
};

export const userLogout = function (req, res) {
  // 清除浏览器保存的userid的cookie
  delete req.session.userid;
  // 返回数据
  res.send({ code: 0 });
};
