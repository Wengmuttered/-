const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  let files = fs.readdirSync(dir);
  for (let f of files) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      replaceInDir(p);
    } else if (p.match(/\.(vue|js|ts)$/)) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('http://127.0.0.1:8080/api')) {
        let step1 = content.replace(/['"]http:\/\/127\.0\.0\.1:8080\/api/g, "__API_BASE__ + '");
        let step2 = step1.replace(/`http:\/\/127\.0\.0\.1:8080\/api/g, '__API_BASE__ + `');
        
        fs.writeFileSync(p, step2, 'utf8');
        console.log('🚀 核心 API 网关已自动接入宏定义:', p);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('>>> 全部 API 地址已成功切为动态侦测阵列模式 <<<');
