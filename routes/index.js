import express from "express";
import {
  userLoginPWD,
  userLoginSMS,
  userLogout,
  getCaptcha,
  sendCode,
  getUserInfo,
} from "../controllers/user.js";

import { getCategory } from "../controllers/category.js";
import { getPosition } from "../controllers/position.js";
import { getShops, searchShops } from "../controllers/shop.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//
router.post("/login_pwd", userLoginPWD);
router.post("/login_sms", userLoginSMS);
router.get("/logout", userLogout);
router.get("/captcha", getCaptcha);
router.get("/sendcode", sendCode);
router.get("/userinfo", getUserInfo);
//
router.get("/position/:geohash", getPosition);
//
router.get("/index_category", getCategory);
//
router.get("/shops", getShops);
router.get("/search_shops", searchShops);

export default router;
