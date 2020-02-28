'use strict'
module.exports = {
  NODE_ENV: '"production"',
  //將api伺服器位置設定於APIPATH中，此處設定值必須包含單引號、雙引號，內容放置路徑，設定完成dev.env.js需重新跑一次npm run dev才能正常被引用
  APIPATH:'"https://vue-course-api.herokuapp.com"',
  //將api文件中的自定義「:API_PATH」的值設定於此
  CUSTOMPATH:'"charlesliu"',
}
