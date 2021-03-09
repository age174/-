/*
软件名称:云扫码 微信扫描二维码打开
更新时间：2021-03-09 @肥皂
脚本说明：云扫码自动阅读
脚本为自动完成云扫码的阅读任务
每日收益1元左右，可多号撸。提现秒到
类似番茄看看，番茄看看黑了就跑云扫码，云扫码黑了就跑番茄看看
哈哈哈啊哈哈哈哈

任务打开二维码地址 https://raw.githubusercontent.com/age174/-/main/3B7C4F94-B961-4690-8DF7-B27998789124.png
微信扫描打开，保存临时码，再去扫码获取数据



本脚本以学习为主！
首次运行脚本，会提示获取数据
去云扫码，点击开始阅读，获得阅读数据
七八秒后返回，获得提交任务数据
跑脚本到3000金币，手动提现一次，获得自动提现数据
总共需要三个数据。。

TG电报群: https://t.me/hahaha802

3.1更新增加是否有阅读任务的判断
加入自动兑换和自动提现，当前金币大于等于3000会自动提现，请自行去获取提现数据，方法，进入云扫码，成功提现一次获取数据成功
解决多账号问题，可以多账号撸了
3.2更新,新增判断，如果提示当前任务已结束脚本会尝试继续执行不会终止循环，key提交提示失败也会尝试重新执行，增加了提现成功的通知
3.8更新，修复因官方更新无法提交key和领取任务奖励的问题
3.9更新 修复云扫码官方更新无法自动阅读的问题

boxjs地址 :  

https://raw.githubusercontent.com/age174/-/main/feizao.box.json


云扫码
圈X配置如下，其他软件自行测试，定时可以多设置几次，没任务会停止运行的
[task_local]
#云扫码
15 12,14,16,20,22 * * * https://raw.githubusercontent.com/age174/-/main/ysm.js, tag=云扫码, img-url=https://raw.githubusercontent.com/erdongchanyo/icon/main/taskicon/Yunsaoma.png, enabled=true


[rewrite_local]
#云扫码
^http://.*./yunonline/v1/ url script-request-body https://raw.githubusercontent.com/age174/-/main/ysm.js



#loon
^http://.*./yunonline/v1/ script-path=https://raw.githubusercontent.com/age174/-/main/ysm.js, requires-body=true, timeout=10, tag=云扫码



#surge

云扫码 = type=http-request,pattern=^http://.*./yunonline/v1/,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/age174/-/main/ysm.js,script-update-interval=0




[MITM]
hostname = .*.top


*/


const $ = new Env('云扫码自动阅读');
let status;
status = (status = ($.getval("ysmstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const ysmurlArr = [], ysmhdArr = [],ysmbodyArr = [],ysm2bodyArr = [],ysmtxArr = [],ysmcount = ''
let ysmurl = $.getdata('ysmurl')
let ysmhd = $.getdata('ysmhd')
let ysmbody = $.getdata('ysmbody')
let ysm2body = $.getdata('ysm2body')
let ysmtx = $.getdata('ysmtx')
let ysmkey = ''


!(async () => {
  if (typeof $request !== "undefined") {
    await ysmck()
   
  } else {ysmurlArr.push($.getdata('ysmurl'))
    ysmhdArr.push($.getdata('ysmhd'))
    ysmbodyArr.push($.getdata('ysmbody'))
    ysm2bodyArr.push($.getdata('ysm2body'))
    ysmtxArr.push($.getdata('ysmtx'))
    let ysmcount = ($.getval('ysmcount') || '1');
  for (let i = 2; i <= ysmcount; i++) {
    ysmurlArr.push($.getdata(`ysmurl${i}`))
    ysmhdArr.push($.getdata(`ysmhd${i}`))
    ysmbodyArr.push($.getdata(`ysmbody${i}`))
    ysm2bodyArr.push($.getdata(`ysm2body${i}`))
    ysmtxArr.push($.getdata(`ysmtx${i}`))
  }
    console.log(`------------- 共${ysmhdArr.length}个账号-------------\n`)
      for (let i = 0; i < ysmhdArr.length; i++) {
        if (ysmhdArr[i]) {
         
          ysmurl = ysmurlArr[i];
          ysmhd = ysmhdArr[i];
          ysmbody = ysmbodyArr[i];
          ysm2body = ysm2bodyArr[i];
          ysmtx = ysmtxArr[i];
          $.index = i + 1;
          console.log(`\n开始【云扫码${$.index}】`)
    await ysm1();

  }
  //await ysmtx();
}}

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//云扫码数据获取


function ysmck() {
   if ($request.url.indexOf("v1/task") > -1) {
 const ysmurl = $request.url
  if(ysmurl)     $.setdata(ysmurl,`ysmurl${status}`)
    $.log(ysmurl)
  const ysmhd = JSON.stringify($request.headers)
        if(ysmhd)    $.setdata(ysmhd,`ysmhd${status}`)
$.log(ysmhd)
   const ysmbody = JSON.stringify($request.body)
        if(ysmbody)    $.setdata(ysmbody,`ysmbody${status}`)
$.log(ysmbody)
   $.msg($.name,"",'云扫码'+`${status}` +'获取任务数据获取成功！')
  }
if ($request.url.indexOf("add_gold") > -1) {
 const ysm2body = $request.body
  if(ysm2body)     $.setdata(ysm2body,`ysm2body${status}`)
    $.log(ysm2body)
$.msg($.name,"",'云扫码'+`${status}` +'提交任务数据获取成功！')
   }
  if ($request.url.indexOf("withdraw") > -1) {
 const ysmtx = $request.body
  if(ysmtx)     $.setdata(ysmtx,`ysmtx${status}`)
    $.log(ysmtx)
$.msg($.name,"",'云扫码'+`${status}` +'微信提现数据获取成功！')
   }
}


//云扫码领取
function ysm3(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : "http:"+ysmurl.match(/http:(.*?)yunonline/)[1]+"yunonline/v1/add_gold",
        headers : JSON.parse(ysmhd),
        body : ysm2body,}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.errcode == 0){
        console.log('\n云扫码领取阅读奖励回执:成功🌝 '+result.data.gold+'\n今日阅读次数: '+result.data.day_read+' 今日阅读奖励: '+result.data.day_gold+' 当前余额'+result.data.last_gold+'\n')
        if(result.data.last_gold >= 3000){
    console.log('\n检测到当前金额可提现，前去执行提现,请去抓取提现的数据，如果没有提现数据脚本会自行终止!')                
await ysmdh();
}       await $.wait(2000);
        await ysm1();
        
} else {
       if(result.errcode == 405){
console.log('\n🧼来自肥皂的提示:'+result.msg+'尝试继续执行任务')
      await ysm1();
}
    console.log(result.errcode)
console.log('\n云扫码领取阅读奖励回执:失败🚫 '+result.msg)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}

//云扫码提交     
function ysm2(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : ysmkey,
        headers : JSON.parse(ysmhd),
       
}      
      $.get(url, async (err, resp, data) => {
        try {
         //console.log('\n开始重定向跳转，跳转返回结果：'+data)
        //if (err) {
        //  console.log(`\n${$.name} 🧼来自肥皂的提示:key请求提交失败,尝试重新执行任务`)
     //await ysm1();
       // } else {
           
    //const result = JSON.parse(data)
       console.log('\n云扫码key提交成功,10秒后开始领取阅读奖励') 
       
        await $.wait(9000);
        await ysm3(); 
       
        //}
      } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//云扫码key
function ysm1(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      if (typeof $.getdata('ysmhd') === "undefined") {
        $.msg($.name,"",'请先获取云扫码数据!😓',)
        $.done()
      }

let url = {
        url : "http:"+ysmurl.match(/http:(.*?)yunonline/)[1]+"yunonline/v1/task",
        headers : JSON.parse(ysmhd),
        body : 'secret='+ysmbody.match(/secret=(.*?)&/)[1]+'&type=read',
}
      $.post(url, async (err, resp, data) => {
        try {
      if(data == '{"errcode":0,"msg":"success"}'){
       console.log('\n🧼来自肥皂的提示:当前没有任务啊,手动进云扫码看看是不是一直显示更新中,别问肥皂什么原因啦～')
}
          //console.log(data)
    const result = JSON.parse(data)
        if(result.errcode == 0){
         //console.log(data)
        console.log('\n云扫码获取key回执:成功🌝 开始 循环观看💦')
      if(result.data.link === undefined){
       console.log('\n🧼来自肥皂的提示:没有匹配到key'+result.data.msg)
} else {
        ysmkey = result.data.link
        //$.log(ysmkey)
        await $.wait(1000);
        await ysm2();
        
}
        
} else {
console.log('云扫码获取key回执:失败🚫 '+result.msg+' 已停止当前账号运行!')
}
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}


//云扫码兑换
function ysmdh(timeout = 0) {
  return new Promise((resolve) => {

let url = {
        url : "http:"+ysmurl.match(/http:(.*?)yunonline/)[1]+"yunonline/v1/user_gold",
        headers : JSON.parse(ysmhd),
        body : 'openid='+ysmtx.match(/openid=(.*?)ua/)[1]+'gold=3000',
}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.errcode == 0){
        console.log('\n云扫码提现兑换:成功🌝 兑换金额'+result.data.money+'元，前去微信提现')
        await $.wait(1000);
        await ysmwx();
} else {
       console.log('\n云扫码提现兑换:失败🚫 '+result.msg)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//云扫码提现
function ysmwx(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : "http:"+ysmurl.match(/http:(.*?)yunonline/)[1]+"yunonline/v1/withdraw",
        headers : JSON.parse(ysmhd),
        body : ysmtx,}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.errcode == 0){
        console.log('\n云扫码微信提现回执:成功🌝 '+result.msg)
        $.msg($.name,"",'云扫码已成功提现至微信0.3元')
        await ysm1();
} else {
       console.log('\n云扫码微信提现回执:失败🚫 '+result.msg)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}



function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
