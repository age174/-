/*
软件名称:千禾阅读 微信扫描二维码打开
更新时间：2021-04-28 @肥皂
脚本说明：千禾阅读自动阅读
脚本为自动完成千禾阅读的阅读任务

每天1到4元不等。

千禾使用方法: 共四个步骤
1-扫码进入千禾任务界面，点击我的,获得个人信息数据
2-点击阅读任务,点击一键领取,获得一键领取数据
3-禁用千禾阅读个人信息和领取重写,打开千禾阅读任务重写
4-复制阅读任务链接到微信打开，打开之后获得任务数据

4.15修复个人信息显示不全
4.17修复千禾官方加密导致阅读任务无法领取的问题
阅读任务重写无法抓包的问题。自己更换一下新的重写和mitm

扫描二维码打开:https://ae01.alicdn.com/kf/U0c6b7cea29354290b97a747f1133c1cfm.jpg

或复制链接到微信打开 https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6048923d456554e8&redirect_uri=https%3A%2F%2Fwww.qliang2.com%2F%23%2Fauthorize&response_type=code&scope=snsapi_userinfo&state=eyJudW0iOiA0NjgsICJhcHBfaWQiOiBudWxsLCAidXNlcl9pZCI6IDMxMTE5OTI4fQ%3D%3D%23wechat_redirect

本脚本以学习为主！

TG通知群:https://t.me/Ariszy_Scripts
TG电报交流群: https://t.me/hahaha8028

boxjs地址 :  

https://raw.githubusercontent.com/age174/-/main/feizao.box.json

千禾阅读
圈X配置如下，其他软件自行测试，定时可以多设置几次，没任务会停止运行的
[task_local]
#千禾阅读
35 9-22 * * * https://raw.githubusercontent.com/age174/-/main/qhyd.js, tag=千禾阅读, img-url=https://ae01.alicdn.com/kf/U413ab7460abb4a28b11deac3c5034243N.jpg, enabled=true


[rewrite_local]
#千禾阅读个人信息和领取重写
https://www.qianhe5.com/ url script-request-header https://raw.githubusercontent.com/age174/-/main/qhyd.js
#千禾阅读任务重写
https://www.*com/read/v1/get_time_list url script-request-body https://raw.githubusercontent.com/age174/-/main/qhyd.js

#loon
https://www.qianhe5.com/ script-path=https://raw.githubusercontent.com/age174/-/main/qhyd.js, requires-header=true, timeout=10, tag=千禾阅读个人信息和领取重写
https://www.*com/read/v1/get_time_list script-path=https://raw.githubusercontent.com/age174/-/main/qhyd.js, requires-body=true, timeout=10, tag=千禾阅读任务重写

#surge
千禾阅读个人信息和领取重写 = type=http-request,pattern=https://www.qianhe5.com/,requires-header=1,max-size=0,script-path=https://raw.githubusercontent.com/age174/-/main/qhyd.js,script-update-interval=0
千禾阅读任务重写 = type=http-request,pattern=https://www.*com/read/v1/get_time_list,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/age174/-/main/qhyd.js,script-update-interval=0

[MITM]
hostname = www.qianhe5.com,www.qianhe9.com

*/


const $ = new Env('千禾阅读自动阅读');
let status;
status = (status = ($.getval("qhydstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const qhydurlArr = [], qhydhdArr = [],qhydlqhdArr = [],qhydbodyArr = [],qhydcount = ''
let times = Math.round(Date.now() / 1000)
let qhydurl = $.getdata('qhydurl')
let qhydhd = $.getdata('qhydhd')
let qhydlqhd = $.getdata('qhydlqhd')
let qhydbody = $.getdata('qhydbody')
let qhydkey = '',id = '',uid='',tid='',name='',ye='',strid = ''
!(async () => {
  if (typeof $request !== "undefined") {
    await qhydck()
   
  } else {qhydurlArr.push($.getdata('qhydurl'))
    qhydhdArr.push($.getdata('qhydhd'))
    qhydlqhdArr.push($.getdata('qhydlqhd'))
    qhydbodyArr.push($.getdata('qhydbody'))
    let qhydcount = ($.getval('qhydcount') || '1');
    //qhydcount=1;
  for (let i = 2; i <= qhydcount; i++) {
    qhydurlArr.push($.getdata(`qhydurl${i}`))
    qhydhdArr.push($.getdata(`qhydhd${i}`))
    qhydlqhdArr.push($.getdata(`qhydlqhd${i}`))
    qhydbodyArr.push($.getdata(`qhydbody${i}`))
  }
    console.log(`------------- 共${qhydhdArr.length}个账号-------------\n`)
      for (let i = 0; i < qhydhdArr.length; i++) {
        if (qhydhdArr[i]) {
          qhydbody = qhydbodyArr[i];
          qhydurl = qhydurlArr[i];
          qhydhd = qhydhdArr[i];
          qhydlqhd = qhydlqhdArr[i];
          $.index = i + 1;
          console.log(`\n开始【千禾阅读${$.index}】`)
          await qhydlb();
          await qhydxx();
          await qhydye();

  }
}}

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//千禾阅读数据获取


function qhydck() {
   if ($request.url.indexOf("get_time_list") > -1) {
  const qhydhd = JSON.stringify($request.headers)
        if(qhydhd)    $.setdata(qhydhd,`qhydhd${status}`)
$.log(qhydhd)
const qhydbody = $request.body
        if(qhydbody)    $.setdata(qhydbody,`qhydbody${status}`)
$.log(qhydbody)
   $.msg($.name,"",'千禾阅读'+`${status}` +'阅读数据获取成功！')
  }else if ($request.url.indexOf("click_collection") > -1) {
 const qhydlqhd = JSON.stringify($request.headers)
  if(qhydlqhd)     $.setdata(qhydlqhd,`qhydlqhd${status}`)
    $.log(qhydlqhd)
 $.msg($.name,"",'千禾阅读'+`${status}` +'一键领取数据获取成功！')
}else if ($request.url.indexOf("info?token") > -1) {
 const qhydurl = $request.url
  if(qhydurl)     $.setdata(qhydurl,`qhydurl${status}`)
    $.log(qhydurl)
$.msg($.name,"",'千禾阅读'+`${status}` +'个人信息数据获取成功！')
}
}

//千禾阅读列表id
function qhydlb(timeout = 0) {
  return new Promise((resolve) => {
key = JSON.parse(qhydbody)
key = key.urlKey
time = parseInt((new Date).getTime() / 1e3)
sign = md5(`<span>span.qianhe</span>${time}<span>span.qianhe</span>`)
let url = {
        url : `https://www.qliang2.com/read/v1/get_time_list`,
        headers : JSON.parse(qhydhd),
        body : `{"urlKey":"${key}","time":${time},"sign":"${sign}"}`,
}
//console.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)
        if(result.code== 200){
if(result.data[0] == undefined){
console.log('\n千禾阅读没有匹配到阅读列表ID,尝试执行一键领取')
await $.wait(3000);
await qhyd();
}
        tid = result.data[0].id
        console.log('\n千禾阅读获取任务列表ID成功')
        await $.wait(1000);
        await qhydrw();
} else {
       console.log('\n千禾阅读获取任务列表ID失败'+result.message)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}






//千禾阅读列表
function qhydrw(timeout = 0) {
  return new Promise((resolve) => {
key = JSON.parse(qhydbody)
key = key.urlKey
time = parseInt((new Date).getTime() / 1e3)
sign = md5(`<span>span.qianhe</span>${time}<span>span.qianhe</span>`)
let url = {
        url : `https://www.qianhe9.com/read/v1/get_time_list_task`,
        headers : JSON.parse(qhydhd),
        body : `{"urlKey":"${key}","time_id":${tid},"time":${time},"sign":"${sign}"}`,
}
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)

        if(result.code== 200){
        id = result.data.list[0].id
        name = result.data.list[0].title
        uid = result.data.list[0].user_url
        console.log(`\n千禾阅读获取任务列表成功,当前共有:${result.data.list.length}个任务\n当前任务ID:${id}\n任务名:${name}\n开始执行阅读`)
        await $.wait(1000);
        await qhyd1();
} else {
       console.log('\n千禾阅读获取任务列表失败'+result.message)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


function randomRangec () {
                    for (var i = "",
                    s = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], a = 0; a < 11; a++) {
                        i += s[Math.round(Math.random() * (s.length - 1))]
                    }
                    return i
}

//千禾阅读
function qhyd1(timeout = 1000) {
  return new Promise((resolve) => {
key = JSON.parse(qhydbody)
key = key.urlKey
time = parseInt((new Date).getTime() / 1e3)
sign = md5(`<span>span.qianhe</span>${time}<span>span.qianhe</span>`)
let t = {};
	t.str_id = "xxxx-xxxx-xxxx-xxxx-yxxx-xxxx".replace(/[xy]/g, 
	function(t) {
		var i = 16 * Math.random() | 0;
		return ("x" === t ? i : 3 & i | 8).toString(16)
	});

uid = t.str_id
let url = {
        url : `https://www.qianhe9.com/read/v1/get_click_task?urlKey=${key}&task_id=${id}&type=1&str_id=${uid}&sign=${sign}&time=${time}`,
        headers : JSON.parse(qhydhd),
}
      $.get(url, async (err, resp, data) => {
        try {
        if(resp.statusCode == 200){
        let r = randomRangec()
	   let o = randomRangec()
	   let d = randomRangec()
	   let m = t.str_id[3] + "" + t.str_id[8] + t.str_id[22] + t.str_id[18] + t.str_id[10]
	   let c = t.str_id[12] + "" + o + t.str_id[7] + m + t.str_id[6]
	   let l = t.str_id[3] + "" + t.str_id[12] + t.str_id[8] + t.str_id[10] + t.str_id[3] + t.str_id[12] + t.str_id[5] + t.str_id[22]
	   let u = t.str_id[22] + "" + l + t.str_id[26] + d + t.str_id[12]
        strid = c + "" + r + u
        console.log('\n千禾阅读提交任务成功')
        let waittime = Math.round(Math.random()*4000+4000)
        console.log(`等待${waittime/1000}秒后去领取奖励`)
        await $.wait(waittime);
        await qhyd2();
} else {
       console.log('\n千禾阅读提交任务失败'+result.message)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//千禾阅读领取奖励
function qhyd2(timeout = 0) {
  return new Promise((resolve) => {
key = JSON.parse(qhydbody)
key = key.urlKey
time = parseInt((new Date).getTime() / 1e3)
sign = md5(`<span>span.qianhe</span>${time}<span>span.qianhe</span>`)
let url = {
        url : `https://www.qianhe9.com/read/v1/get_click_task`,
        headers : JSON.parse(qhydhd),
        body : `{"urlKey":"${key}","task_id":${id},"time":${times},"type":2,"str_id":"${strid}","time":${time},"sign":"${sign}"}`,
}
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)

        if(result.code== 200){
        console.log('\n千禾阅读领取奖励成功,获得金币:'+result.data.number)
        await $.wait(1000);
        await qhydrw();
} else {
       console.log('\n千禾阅读领取奖励失败'+result.message)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//千禾阅读一键领取
function qhyd(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : `https://www.qianhe5.com/read/v1/click_collection`,
        headers : JSON.parse(qhydlqhd),
}
      $.get(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)

        if(result.code == 200){
        console.log('\n千禾阅读一键领取任务成功')
        await $.wait(1000);
        await qhydlb();
} else {
       console.log('\n千禾阅读一键领取任务失败'+result.message)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}

//千禾阅读信息
function qhydxx(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : qhydurl,
        headers : JSON.parse(qhydlqhd),
}
      $.get(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)

        if(result.code == 0){
        ye+=`\n千禾阅读用户信息获取成功\n【当前用户名】:${result.data.username}`
        
} else {
       console.log('\n千禾阅读一键领取任务失败'+result.message)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}
//千禾阅读余额
function qhydye(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : 'https://www.qianhe5.com/api/user/money',
        headers : JSON.parse(qhydlqhd),
}
      $.get(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)

        if(result.code == 0){
        console.log(`${ye}\n【当前总收益】:${result.data.total_amount}\n【当前余额】:${result.data.balance}\n【师徒收益】:${result.data.prent_amount}\n【损失收益】:${result.data.total_loss_amount}`)
        
} else {
       console.log('\n千禾阅读一键领取任务失败'+result.message)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}
function md5(string){
                function md5_RotateLeft(lValue, iShiftBits) {
                        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
                }
                function md5_AddUnsigned(lX,lY){
                        var lX4,lY4,lX8,lY8,lResult;
                        lX8 = (lX & 0x80000000);
                        lY8 = (lY & 0x80000000);
                        lX4 = (lX & 0x40000000);
                        lY4 = (lY & 0x40000000);
                        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
                        if (lX4 & lY4) {
                                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                        }
                        if (lX4 | lY4) {
                                if (lResult & 0x40000000) {
                                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                                } else {
                                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                                }
                        } else {
                                return (lResult ^ lX8 ^ lY8);
                        }
                }         
                function md5_F(x,y,z){
                        return (x & y) | ((~x) & z);
                }
                function md5_G(x,y,z){
                        return (x & z) | (y & (~z));
                }
                function md5_H(x,y,z){
                        return (x ^ y ^ z);
                }
                function md5_I(x,y,z){
                        return (y ^ (x | (~z)));
                }
                function md5_FF(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_GG(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_HH(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_II(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_ConvertToWordArray(string) {
                        var lWordCount;
                        var lMessageLength = string.length;
                        var lNumberOfWords_temp1=lMessageLength + 8;
                        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
                        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
                        var lWordArray=Array(lNumberOfWords-1);
                        var lBytePosition = 0;
                        var lByteCount = 0;
                        while ( lByteCount < lMessageLength ) {
                                lWordCount = (lByteCount-(lByteCount % 4))/4;
                                lBytePosition = (lByteCount % 4)*8;
                                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                                lByteCount++;
                        }
                        lWordCount = (lByteCount-(lByteCount % 4))/4;
                        lBytePosition = (lByteCount % 4)*8;
                        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
                        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
                        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
                        return lWordArray;
                };
                function md5_WordToHex(lValue){
                        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
                        for(lCount = 0;lCount<=3;lCount++){
                                lByte = (lValue>>>(lCount*8)) & 255;
                                WordToHexValue_temp = "0" + lByte.toString(16);
                                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
                        }
                        return WordToHexValue;
                };
                function md5_Utf8Encode(string){
                        string = string.replace(/\r\n/g,"\n");
                        var utftext = "";
                        for (var n = 0; n < string.length; n++) {
                                var c = string.charCodeAt(n);
                                if (c < 128) {
                                        utftext += String.fromCharCode(c);
                                }else if((c > 127) && (c < 2048)) {
                                        utftext += String.fromCharCode((c >> 6) | 192);
                                        utftext += String.fromCharCode((c & 63) | 128);
                                } else {
                                        utftext += String.fromCharCode((c >> 12) | 224);
                                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                        utftext += String.fromCharCode((c & 63) | 128);
                                }
                        }
                        return utftext;
                };
                var x=Array();
                var k,AA,BB,CC,DD,a,b,c,d;
                var S11=7, S12=12, S13=17, S14=22;
                var S21=5, S22=9 , S23=14, S24=20;
                var S31=4, S32=11, S33=16, S34=23;
                var S41=6, S42=10, S43=15, S44=21;
                string = md5_Utf8Encode(string);
                x = md5_ConvertToWordArray(string);
                a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
                for (k=0;k<x.length;k+=16) {
                        AA=a; BB=b; CC=c; DD=d;
                        a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
                        d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
                        c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
                        b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
                        a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
                        d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
                        c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
                        b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
                        a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
                        d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
                        c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
                        b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
                        a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
                        d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
                        c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
                        b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
                        a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
                        d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
                        c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
                        b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
                        a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
                        d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
                        c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
                        b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
                        a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
                        d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
                        c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
                        b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
                        a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
                        d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
                        c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
                        b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
                        a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
                        d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
                        c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
                        b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
                        a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
                        d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
                        c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
                        b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
                        a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
                        d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
                        c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
                        b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
                        a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
                        d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
                        c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
                        b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
                        a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
                        d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
                        c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
                        b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
                        a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
                        d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
                        c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
                        b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
                        a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
                        d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
                        c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
                        b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
                        a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
                        d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
                        c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
                        b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
                        a=md5_AddUnsigned(a,AA);
                        b=md5_AddUnsigned(b,BB);
                        c=md5_AddUnsigned(c,CC);
                        d=md5_AddUnsigned(d,DD);
                }
        return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
