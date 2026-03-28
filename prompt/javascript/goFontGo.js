function goFontGo() {
    var strStyle = "", fontMapCharWidth = 12, fontMapCharHeight = 12;
    for (var i = 0; i < (16 * 16); i++) {
        var x = i % 16;
        var y = (i - x) / 16;
        strStyle += '.f-' + i + ' { background-position:-' + ((x * fontMapCharWidth) - 0) + 'px -' + ((y * fontMapCharHeight) - 0) + 'px; } ';
    }
    var fontStyle = document.createElement('style');
    fontStyle.type = "text/css";
    if (fontStyle.styleSheet) {
        fontStyle.styleSheet.cssText = strStyle + " .f-n { background-position:0px 0px; float:none; width:0px;} .f-cursor { margin-right:-8px; }";
    } else {
        fontStyle.appendChild(document.createTextNode(strStyle + " .f-n { background-position:0px 0px; float:none; width:0px;} .f-cursor { margin-right:-8px; }"));
    }
    document.body.appendChild(fontStyle);

    var fontsDiv = document.getElementById('fonts');
    for (var i = 0; i < pal.length; i++) {
        var img = document.createElement('img');
        img.src = 'img/f12.' + i + '.png';
        fontSrc[i] = img.src;
        img.id = 'font-' + i;
        fontsDiv.appendChild(img);
    }
}
