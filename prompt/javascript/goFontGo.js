// ============================================================
// FONT SYSTEM
// Every character on screen is a 12x12 div of class `font` that shows one
// cell of a bitmap font sheet. The sheet is 192x192: a 16x16 grid of 12px
// glyphs laid out by character code, so code N sits at column N % 16, row
// N / 16. Colour is not drawn — each of the 16 palette colours has its own
// pre-coloured copy of the sheet, f12.<index>.png, and a glyph changes
// colour by swapping its background image.
// ============================================================
function goFontGo() {
  // One rule per character code, .f-0 to .f-255, that shifts the sheet so
  // that glyph's cell shows through the 12x12 div.
  var strStyle = '',
    fontMapCharWidth = 12,
    fontMapCharHeight = 12;
  for (var i = 0; i < 16 * 16; i++) {
    var x = i % 16;
    var y = (i - x) / 16;
    strStyle +=
      '.f-' +
      i +
      ' { background-position:-' +
      (x * fontMapCharWidth - 0) +
      'px -' +
      (y * fontMapCharHeight - 0) +
      'px; } ';
  }

  // .f-n is the newline: zero width and not floated, so it ends the row of
  // floated glyphs before it. .f-cursor's negative margin stops the cursor
  // pushing the text after it along by a whole cell.
  var fontStyle = document.createElement('style');
  fontStyle.type = 'text/css';
  if (fontStyle.styleSheet) {
    // Old Internet Explorer, which cannot append text to a <style> element.
    fontStyle.styleSheet.cssText =
      strStyle +
      ' .f-n { background-position:0px 0px; float:none; width:0px;} .f-cursor { margin-right:-8px; }';
  } else {
    fontStyle.appendChild(
      document.createTextNode(
        strStyle +
          ' .f-n { background-position:0px 0px; float:none; width:0px;} .f-cursor { margin-right:-8px; }',
      ),
    );
  }
  document.body.appendChild(fontStyle);

  // Load every coloured copy of the sheet into the hidden #fonts div, so
  // the first character typed in a new colour does not wait on a fetch,
  // and record each resolved URL in fontSrc by palette index.
  var fontsDiv = document.getElementById('fonts');
  for (var i = 0; i < pal.length; i++) {
    var img = document.createElement('img');
    img.src = '../systems/_shared/styles/VGA_font/f12.' + i + '.png';
    fontSrc[i] = img.src;
    img.id = 'font-' + i;
    fontsDiv.appendChild(img);
  }
}
