// ============================================================
// CLASS UTILITIES
// Cross-browser classList wrappers (supports IE without classList)
// ============================================================
function addClass(el, c) {
    if (typeof el.classList !== 'undefined') { el.classList.add(c); return; }
    el.className += ' ' + c;
}
function remClass(el, c) {
    if (typeof el.classList !== 'undefined') { el.classList.remove(c); return; }
    el.className = el.className.replace(' ' + c, '');
}
function gotClass(el, c) {
    if (typeof el.classList !== 'undefined') return el.classList.contains(c);
    return el.className.indexOf(' ' + c) != -1;
}
