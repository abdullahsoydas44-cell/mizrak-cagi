// Oyunu internetsiz çalışacak şekilde www klasörüne hazırlar:
// three.js ve yazı tipleri CDN yerine uygulamanın içine kopyalanır.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const nm = path.join(root, 'node_modules');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'lib'), { recursive: true });
fs.mkdirSync(path.join(www, 'fonts'), { recursive: true });

// 1) three.js
const three = path.join(nm, 'three', 'build', 'three.min.js');
if (!fs.existsSync(three)) {
  console.error('three.js bulunamadı. Önce "npm install" çalıştırın.');
  process.exit(1);
}
fs.copyFileSync(three, path.join(www, 'lib', 'three.min.js'));

// 2) Yazı tipleri (Türkçe karakterler için latin-ext dahil)
const ranges = {
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext': 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'
};
const fonts = [
  ['Rubik Dirt', 'rubik-dirt', [400]],
  ['Nunito', 'nunito', [600, 700, 800, 900]]
];
let css = '';
for (const [family, pkg, weights] of fonts) {
  for (const w of weights) {
    for (const sub of ['latin', 'latin-ext']) {
      const file = `${pkg}-${sub}-${w}-normal.woff2`;
      const src = path.join(nm, '@fontsource', pkg, 'files', file);
      if (!fs.existsSync(src)) { console.warn('Yazı tipi dosyası yok, atlandı:', file); continue; }
      fs.copyFileSync(src, path.join(www, 'fonts', file));
      css += `@font-face{font-family:'${family}';font-style:normal;font-weight:${w};font-display:swap;src:url(${file}) format('woff2');unicode-range:${ranges[sub]};}\n`;
    }
  }
}
fs.writeFileSync(path.join(www, 'fonts', 'fonts.css'), css);

// 3) Oyun sayfası
let game = fs.readFileSync(path.join(root, 'src', 'game.html'), 'utf8');
game = game
  .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"><\/script>/, '<script src="lib/three.min.js"></script>')
  .replace(/<link rel="preconnect"[^>]*>\s*/g, '')
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts/fonts.css">');

if (/cdnjs\.cloudflare|fonts\.googleapis/.test(game)) {
  console.warn('Uyarı: oyunda hâlâ internet bağlantısı gerektiren bir adres var.');
}

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
</head>
<body>
${game}
</body>
</html>
`;
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log('Hazır: www/index.html (internetsiz çalışır)');
