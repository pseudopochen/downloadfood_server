# DownloadFood server
This repository contains server-side code for the mobile app "DownloadFood". 

The client-side code is a separate repository "downloadfood".

## Project Setup

I used ES6 and Nodejs, with "MongoDB atlas" and "mongoose" for database access, and "expressjs" for routing.

Auto-login of the user was managed using session, which stores a cookie with a life span of 1 day.

Inside the user controller (controllers/user.js), I implemented two types of authorization: one based on password and captcha, the other based on phone number and the SMS verification code sent by the server to the user's phone.

The captcha images were created using "svg-captcha" and given to the client for display.

The password was md5-encoded using "blueimp-md5".

The SMS verification code was sent to the user's phone by using "https://app.cloopen.com:8883". This implemenation needs to be changed for regions outside of China. Authorization info was encoded using Base64 ("js-base64").

I got the mock data and images of restaraunts from "http://cangdu.org:8001/v4/restaurants" usig ajax calls (controllers/ajax.js), which is written using "axios" and promise.

Mock data for restaurants and categories are store in json under "data/". 

### Note:

It does not work anymore to use "require" to load the mock json data in ESM. I read the json files as plain text using "fs.readFileSync()" and then parse the string using "JSON.parse()".

Another choice is to use the "--experimental-json-modules" option (https://nodejs.org/api/esm.html#esm_json_modules), which allows using "import" to load the json data. An example file is "data/read_json.js" and it can be run as "node --experimental-json-modules read_json.js".




