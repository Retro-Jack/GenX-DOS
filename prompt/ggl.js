//stupid implementation of google searching. lol. ;-)
function gPrompt() {
	promptMode = true;
	txtPal.bg = 7;
	txtPal.fg = 8;
	var strPrompt = "powered by ";
	for(var i=0; i<strPrompt.length; i++) {
		document.onkeypress({keyCode:strPrompt.charCodeAt(i),stopPropagation:function(){},preventDefault:function(){}});
	}
	txtPal.fg = 9;
	document.onkeypress({keyCode:('G').charCodeAt(0),stopPropagation:function(){},preventDefault:function(){}});
	txtPal.fg = 12;
	document.onkeypress({keyCode:('o').charCodeAt(0),stopPropagation:function(){},preventDefault:function(){}});
	txtPal.fg = 14;
	document.onkeypress({keyCode:('o').charCodeAt(0),stopPropagation:function(){},preventDefault:function(){}});
	txtPal.fg = 9;
	document.onkeypress({keyCode:('g').charCodeAt(0),stopPropagation:function(){},preventDefault:function(){}});
	txtPal.fg = 10;
	document.onkeypress({keyCode:('l').charCodeAt(0),stopPropagation:function(){},preventDefault:function(){}});
	txtPal.fg = 12;
	document.onkeypress({keyCode:('e').charCodeAt(0),stopPropagation:function(){},preventDefault:function(){}});
	txtPal.fg = 8;
	document.onkeypress({keyCode:('>').charCodeAt(0),stopPropagation:function(){},preventDefault:function(){}});
	txtPal.bg = 0;
	txtPal.fg = 7;
	promptMode = false;
}
function echoRes(res,i) {
	txtPal.bg = 8;
	txtPal.fg = 0;
	echo('type: "RES ' + i + '" for:')
	txtPal.bg = 9;
	txtPal.fg = 15;
	echo(res.titleNoFormatting);
	txtPal.bg = 0;
	echo(res.content.replace(/<b>/gi,'*').replace(/<\/b>/gi,'*'));
	txtPal.fg = 9;
	echo(res.unescapedUrl);
	echo('');
}

var googleCmd = [
	{name:'next',
	method:function() {
		ctxStack[ctxStack.length-1].resPage++;
		google(ctxStack[ctxStack.length-1].query, (ctxStack[ctxStack.length-1].resPage*4),true);
	}},
	{name:'prev',
	method:function() {
		if(ctxStack[ctxStack.length-1].resPage>0) {
			ctxStack[ctxStack.length-1].resPage--;
			google(ctxStack[ctxStack.length-1].query, (ctxStack[ctxStack.length-1].resPage*4),true);
		} else echo('nope');
	}},
	{name:'res',
	method:function(i) {
		i = i.replace('res ','');
		if(ctxStack[ctxStack.length-1].resSet.length>i && i>=0) {
			window.open(ctxStack[ctxStack.length-1].resSet[i],"_blank");
			gPrompt();//prompt('powered by google>');
		}
	}},
	{name:'search',
	method:function(i) {
		i = i.replace('search ','');
		ctxStack[ctxStack.length-1].resPage=0;
		google(i, 0,true);
	}},
	{name:'exit',
	method:function(i) {
		ctxStack.pop();
		executeBatch('cls\n');
	}}
	];
function handleGoogleCmd(cmd) {
	var bExec = false;
	for(var i=0; i<googleCmd.length; i++) {
		if(googleCmd[i].name==cmd.split(' ')[0]) {
			echo('');
			googleCmd[i].method(cmd);
			bExec = true;
			break;
		}
	}
	if(!bExec) {
		var b = txtPal.bg;
		var f = txtPal.fg;
		txtPal.bg = 4;
		txtPal.fg = 15;
		echo('not a command');
		txtPal.bg = b;
		txtPal.fg = f;
	}
}
function googleRes(r) {
	//console.log(r);
	//console.log(r.responseData);
	if(r.responseData==null) {
		ctxStack.pop();
		executeBatch('cls\n');
		echo('');
		echo('google err: ' + r.responseDetails);
		return;
	}
	promptEl.innerHTML = '<div id="cursor" class="font f-95 f-cursor"></div>';
	cursorEl = document.getElementById('cursor');
	var b = txtPal.bg;
	var f = txtPal.fg;
	txtPal.bg = 15;
	txtPal.fg = 1;
	var strHead = String.fromCharCode(201);
	for(var i=0; i<78; i++) strHead+=String.fromCharCode(205);
	strHead+=String.fromCharCode(187);
	
	echo(strHead);
	var strPad = '';
	var q=decodeURIComponent(ctxStack[ctxStack.length-1].query);
	for(var i=0; i<80-(q.length+10); i++) strPad+=' ';
	echo(String.fromCharCode(186)+'Search: ' + q + strPad + String.fromCharCode(186));
	var strInfo = String.fromCharCode(199) + String.fromCharCode(196) + ' Page: ' + (r.responseData.cursor.currentPageIndex+1) + ' type: NEXT or PREV to navigate. (or EXIT)';
	var strPad = '';
	for(var i=0; i<79-strInfo.length; i++) strPad+=String.fromCharCode(196);
	strInfo+=strPad + String.fromCharCode(182);
	echo(strInfo);
	strHead = String.fromCharCode(211);
	for(var i=0; i<78; i++) strHead+=String.fromCharCode(196);
	strHead+=String.fromCharCode(189);
	echo(strHead);
	strHead=''
	for(var i=0; i<80; i++) strHead+=String.fromCharCode(223);
	txtPal.bg = 8;
	txtPal.fg = 7;
	echo(strHead);
	ctxStack[ctxStack.length-1].resPage = r.responseData.cursor.currentPageIndex;
	txtPal.bg = 0;
	echo('');
	var res = r.responseData.results;
	ctxStack[ctxStack.length-1].resSet = [];
	for(var i=0; i<res.length;i++) {
		echoRes(res[i],i);
		ctxStack[ctxStack.length-1].resSet[i] = res[i].url;
	}
	//console.log(r);
	txtPal.bg = b;
	txtPal.fg = f;
	gPrompt();//prompt('powered by google>');
}
function google(q,start,bNewSearch) {
	if(typeof bNewSearch == 'undefined') {
		if(ctxStack.length-1>-1) {
			if(ctxStack[ctxStack.length-1].ctxIdx != 'google-' + ctxStack.length-1) {
				ctxStack[ctxStack.length] = {handleCmd:handleGoogleCmd};
			}
		} else ctxStack[ctxStack.length] = {handleCmd:handleGoogleCmd};
	}
	
	q = q.replace('google','');
	if(q.replace(' ','')=='') {
		echo('type SEARCH [query]');
		gPrompt();
		return;
	}
	if(typeof clientIP === 'undefined') clientIP = false;
	var gURL = "https://ajax.googleapis.com/ajax/services/search/web?v=1.0&callback=googleRes&rsz=4" + ((clientIP)?'&userip=' + clientIP:'');
	var s = document.createElement('script')
	if(typeof s.setAttribute!== 'function') {
		s.token = ('t' + Date.now()) + Math.floor(Math.random()*100);
	} else {
		s.setAttribute('token', ('t' + Date.now()) + Math.floor(Math.random()*100));
	}
	
	s.src = gURL + (start?'&start='+start:'') + '&q=' + encodeURIComponent(q);
	document.body.appendChild(s);
	ctxStack[ctxStack.length-1].query = q;
	ctxStack[ctxStack.length-1].ctxIdx = 'google-' + ctxStack.length-1;
}


registerCmd('google', function(cmd) {
	if(cmd.charAt(0)==' ')cmd=cmd.substr(1);
	if(typeof google == 'function') {
		google(cmd);
		return false;
	} else {
		var r=attemptExec(c);
		if(!r){
			echo('Bad command or file name');
		}
	}
});

// For IE8 and earlier version.
if (!Date.now) {
  Date.now = function() {
    return new Date().valueOf();
  }
}