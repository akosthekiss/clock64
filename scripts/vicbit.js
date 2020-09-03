#!/usr/bin/env node

/*
 * Copyright (c) 2020 Akos Kiss.
 *
 * Licensed under the BSD 3-Clause License
 * <LICENSE.md or https://opensource.org/licenses/BSD-3-Clause>.
 * This file may not be copied, modified, or distributed except
 * according to those terms.
 */

const argv = require('yargs')
  .usage('$0 <file>',
         'Convert bitmap glyphs described in JSON format to PNG images',
         (yargs) => {
    yargs
    .positional('file', {
      describe: 'Bitmap font in JSON format',
      type: 'string',
    })
    .option('out', {
      alias: 'o',
      describe: 'Output directory of PNG images',
      type: 'string',
      default: '.',
    })
    .option('scale', {
      alias: 's',
      describe: 'Scale factor',
      type: 'number',
      default: 1,
    })
    .option('glyph', {
      alias: 'g',
      describe: 'Glyphs to convert',
      type: 'array',
      default: [],
      defaultDescription: 'all glyphs',
    })
    ;
  })
  .help()
  .argv
  ;

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;


const font = JSON.parse(fs.readFileSync(argv.file));

if (!fs.existsSync(argv.out)) {
    fs.mkdirSync(argv.out, { recursive: true });
}

let width = null;
let height = null;

for (let i = 0; i < argv.glyph.length; i++) {
  argv.glyph[i] = String(argv.glyph[i]);
}

for (const c in font) {
  if ((argv.glyph.length != 0) && !argv.glyph.includes(c)) {
    continue;
  }

  const bitmap = font[c];
  const cheight = bitmap.length;
  const cwidth = bitmap[0].length;
  if ((width === null) && (height == null)) {
    width = cwidth;
    height = cheight;
  }
  assert.deepEqual([width, height], [cwidth, cheight]);

  let png = new PNG({
    width: width * argv.scale,
    height: height * argv.scale,
  });

  for (let y = 0; y < height; y++) {
    assert.equal(bitmap[y].length, width);
    for (let x = 0; x < width; x++) {
      const bit = bitmap[y].charAt(x);
      assert.ok(['0', '1'].includes(bit));
      const color = bit === '1' ? 255 : 0;

      for (let ys = 0; ys < argv.scale; ys++) {
        for (let xs = 0; xs < argv.scale; xs++) {
          const index = ((y * argv.scale + ys) * width * argv.scale + x * argv.scale + xs) * 4;
          png.data[index + 0] = color;
          png.data[index + 1] = color;
          png.data[index + 2] = color;
          png.data[index + 3] = 255;
        }
      }
    }
  }

  fs.writeFileSync(path.join(argv.out, c + '.png'), PNG.sync.write(png, { colorType: 0 }));
}
