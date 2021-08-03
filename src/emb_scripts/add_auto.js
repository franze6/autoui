// ==UserScript==
// @name         Add Auto Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://transport.tn.ru/RequestForTransportList.aspx?r=auto&page=5&tab=t_auto*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  $(window).load(() => {
    const head = $('head');
    head.append($('<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>'));
    head.append($('<script src="https://github.com/franze6/autoui/releases/download/pilot/UiLib.umd.js"></script>'));
    head.append($('<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">'));

    $eventHub.addEvent("PostLoaded", addModeOn);
    addModeOn();
    const enableLink = $('<a href="#">Включить режим добавления водителей</a>')
    const autoEditLink = $('<a href="#" style="margin-left: 20px;">Редактировать водителей</a>')
    enableLink.click(() => {
      window.enableAddMode = true;
      addModeOn();
    });
    const controlPanel = $("#main_tdControlPanel");
    controlPanel.append(enableLink);
    controlPanel.append(autoEditLink);

    autoEditLink.click(() => {
      var vueElm = $('<edit-auto-popup :rows="data" @result="saveHandle" @cancel="cancel"></add-auto-popup>')
      $('body').append(vueElm);

      const data = JSON.parse(localStorage.autoList || '[]');
      const VuePopup = new Vue({
        el: vueElm[0],
        data: {
          data
        },
        methods: {
          saveHandle: function (val) {
            this.$destroy();
            $(this.$el).remove();

            localStorage.setItem('autoList', JSON.stringify(val));
          },
          cancel: function () {
            this.$destroy();
            $(this.$el).remove();
          }
        }
      });
    });
  });

  function addModeOn() {
    if (!window.enableAddMode)
      return;
    if ($(".addAutoButton").length !== 0)
      return;
    $('#treeTable tbody tr').toArray().forEach(e => {
      const td = e.children[1];
      if (!td)
        return;

      const div1 = td.children[0];
      if (!div1)
        return;

      const div2 = div1.children[0];
      if (!div2)
        return;

      if (!e?.children[4]?.children[0]?.children[0]?.innerHTML)
        return;

      const addElm = $('<a href="#" class="addAutoButton" style="float:right; padding-right:15px;">Добавить</a>');
      addElm.click(event => {
        event.stopPropagation();
        addAuto(e);
      });
      $(div2).append(addElm);

      function addAuto(tr) {
        const documentRef = tr.documentRef;
        $.tnPostEsc('RequestForTransportList.aspx', {
          type: 'ajax',
          operation: 'geta',
          param: {guid: documentRef, dok: ''}
        }, function (call) {
          call = $.remParse(call);

          var vueElm = $('<add-auto-popup :form-data="data" @save="saveHandle" @cancel="cancel"></add-auto-popup>')
          $('body').append(vueElm);

          const VuePopup = new Vue({
            el: vueElm[0],
            data: {
              data: {
                name: call['ВодительWEBText'],
              }
            },
            methods: {
              saveHandle: function (val) {
                this.$destroy();
                $(this.$el).remove();
                var autoObj = {
                  findString: call['АвтотранспортWEBText'],
                  fillType: call['ТипЗагрузкиWEB'],
                  autoType: call['ВидТСWEB']['Text'],
                  isNDS: !!call['СобственникТС']['Text'],
                  ...val
                }
                const localJSON = localStorage['autoList'] || '[]';
                const autoList = JSON.parse(localJSON);
                autoList.push(autoObj);
                localStorage.setItem('autoList', JSON.stringify(autoList));
              },
              cancel: function () {
                this.$destroy();
                $(this.$el).remove();
              }
            }
          });
        });
      }
    })
  }
})();