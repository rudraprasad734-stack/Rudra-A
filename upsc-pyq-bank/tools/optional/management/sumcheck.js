const r=require("fs").readFileSync(__dirname+"/questions.txt","utf8").split("\n").filter(l=>/^\d{4}\|/.test(l)).map(l=>l.split("|"));const s={};r.forEach(a=>{const k=a[0]+"|"+a[1]+"|"+a[2][0];s[k]=(s[k]||0)+ +a[3]});
const bad=Object.keys(s).filter(k=>s[k]!==50);console.log(Object.keys(s).length,"questions; not 50:",bad.map(k=>k+"="+s[k]).join(", ")||"none");
