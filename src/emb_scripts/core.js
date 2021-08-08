// ==UserScript==
// @name         Core Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://transport.tn.ru/*
// @grant        none
// ==/UserScript==

(function() {
  Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };

  if (window.$eventHub)
    return;
  window.$eventHub = {};
  window.$eventHub.list = {};
  window.$eventHub.fireEvent = function(name) {
    if (window.$eventHub.list[name])
      window.$eventHub.list[name].forEach(e => e());
  };
  window.$eventHub.addEvent = function(name, cb) {
    if (!window.$eventHub.list[name])
      window.$eventHub.list[name] = [];
    if (window.$eventHub.list[name].includes(cb))
      return;
    window.$eventHub.list[name].push(cb);
  };
  window.$eventHub.removeEvent = function(name, cb) {
    if (!window.$eventHub.list[name])
      return;
    window.$eventHub.list[name].remove(cb);
  };
  if ($.tnPostEsc.isModify)
    return;
  const old = $.tnPostEsc;
  $.tnPostEsc = function() {
    const oldFunc = arguments[2];
    arguments[2] = function() {
      oldFunc.apply(this, arguments);
      window.$eventHub.fireEvent('PostLoaded');
    };
    old.apply(this, arguments);
  };
  $.tnPostEsc.isModify = true;

  const oldFill = fillTable;

  fillTable = function() {
    const value = oldFill.apply(this, arguments);
    window.$eventHub.fireEvent('tableFilled');
    return value;
  };

  $(window).load(() => {
    $('head').
        append($('<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>'));
    // $('head').append($('<script src="https://github.com/franze6/autoui/releases/download/pilot/UiLib.umd.js"></script>'));
    $('head').
        append(
            $('<script src="file:///C:\\Data\\Projects\\autoui\\dist\\UiLib.umd.js"></script>'));
    $('head').
        append(
            $('<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">'));
  });
})();