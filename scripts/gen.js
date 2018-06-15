const yaml = require('js-yaml');
const fs   = require('fs');

try {
  const doc = yaml.safeLoad(fs.readFileSync('scripts/fonts.yaml', 'utf8'));
  const types = {
    'bold-italic': 'bold, italic',
    'bold': 'bold, normal',
    'italic': 'normal, italic',
    'normal': 'normal, normal',
  }
  const fontsless = ["@import 'functions';", ""]
  for (const [font, conf] of Object.entries(doc)) {
    if (typeof conf === 'string') {
      fontsless.push(`.font ( '${font}', normal, normal, '${conf}' );`)
    } else {
      if (Object.keys(conf).length === 1 && Object.keys(conf)[0] === 'normal') {
        console.warn(`Invalid normal-only font definition: ${font}`)
      }
      if (!Object.keys(conf).includes('normal')) {
        console.warn(`No normal variant for: ${font}`)
      }
      for (const [type, path] of Object.entries(conf)) {
        const css = types[type]
        if (css) {
          fontsless.push(`.font ( '${font}', ${css}, '${path}' );`)
        } else {
          console.warn(`Unknown type for ${font}: ${type}`)
        }
      }
    }
  }
  fs.writeFileSync('styles/fonts.less', fontsless.join('\n')+'\n', 'utf8')
} catch (e) {
  console.log(e);
}
