# gallery
gallery

#### 相簿資料來源
* picasa data(google picasa相簿資料)
* google sheets(自定義不顯示的相簿名稱)

#### 聯繫表單
* 確認填入表單對象(相同ip)一小時內是否已留言五次，超過不可留言。
* 輸入內容經過驗證，資料寫入google sheets並發送mail通知網站所有者。

#### 使用api
* picasa api(google提供，json格式)
* google app scripts(google提供的服務)
  1. 取出自定義不顯示的相簿資料，json格式
  2. check相同ip留言者一小時內是否已留言五次
  3. 聯繫表單寫入google sheets並發送mail通知網站所有者。

#### 引用library & 使用前端框架
* jquery、jqueryblockUI.js、jqueryvalidate.js
* vue.js(1.0)
* jgallery.js

#### 網站demo
<a href="https://leelyleely.github.io/gallery/" target="_blank">https://leelyleely.github.io/gallery/</a>
