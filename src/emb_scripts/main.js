// ==UserScript==
// @name         Main Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://transport.tn.ru/RequestForTransportList.aspx?r=ready&page=1&tab=t_orders*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  let isAutoUpdate = false;

  const settings = {};

  const fastTake = function () {
    $('#treeTable tbody tr').toArray().forEach(e => {
      const td = e.children[2];
      if (!td) {
        return;
      }

      const div1 = td.children[0];
      if (!div1)
        return;

      const div2 = div1.children[0];
      if (!div2)
        return;
      const addElm = $('<a href="#" style="float:right; padding-right:15px;">Взять</a>');
      addElm.click(event => {
        event.stopPropagation();
        fastTakeProposal(e);
      });
      $(div2).text('').append(addElm);
    });
  }


  $(window).load(() => {
    const enableLink = $('<a href="#">Включить автообновление</a>');
    $(document).stopTime('controlled')

    Object.defineProperty(settings, 'isAutoUpdate', {
      set(val) {
        isAutoUpdate = val;
        enableLink.text(val ? 'Выключить автообновление' : 'Включить автообновление');
        alert(val ? 'Включено! С интервалом: ' + getAutoUpdateInterval() / 1000 : 'Выключено');
        if (!val)
          return;
        setTimeout(AutoUpdate, getAutoUpdateInterval());
      },
      get() {
        return isAutoUpdate;
      }
    })
    enableLink.click(() => {
      settings.isAutoUpdate = !settings.isAutoUpdate;
    });
    const intervalEditLink = $('<a href="#" style="margin-left:15px;">Изменить интервал обновления</a>');
    intervalEditLink.click(() => {
      const currentInterval = getAutoUpdateInterval();
      const newInterval = prompt('Интервал обновления(сек, > 0.5):', currentInterval / 1000);
      setAutoUpdateInterval(newInterval)
    })
    $("#main_tdControlPanel").append(enableLink).append(intervalEditLink);
    Ajax(false);
    window.$eventHub.addEvent("tableFilled", fastTake);
  });

  function start() {
    window.$eventHub.removeEvent("PostLoaded", start);
    settings.isAutoUpdate = false;
    const dogSelect = $('#dog')[0];
    const auto = start.argAuto;
    if (!dogSelect)
      return;

    const options = $('option', dogSelect).toArray();

    if (options.length === 0)
      return;

    const validOption = options[0];

    if (!validOption)
      return;

    dogSelect.value = validOption.value;
    UpdateCurrency();

    const autoInput = $('#aweb')[0];

    if (!autoInput)
      return;

    $.tnPost("RequestForTransportList.aspx", {
      type: "ajax",
      operation: "findauto",
      param: {findme: auto['findString']}
    }, function (str) {
      let records = $.remParse(str);
      if (records.length == 0)
        return;

      const aweb = $("#aweb")[0];

      aweb.value = records[0].name;
      aweb.guid = $.remParse(records[0].guid);
      GetA(aweb.guid, false);

      const selectAutoFunc = function () {
        window.$eventHub.removeEvent("PostLoaded", selectAutoFunc);
        $('#dogovor~div button:last-child').click();

        setTimeout(() => {
          if (auto.isNDS) {
            const f_amount = $('#f_amount'),
              c_amount = $('#c_amount');
            if (f_amount.length === 0 || c_amount.length === 0)
              return;
            let percent = parseInt(auto['percent']) || 25;
            if (!percent)
              return;
            const amount = (f_amount.val() / 100) * (100 - percent);
            c_amount.val(amount);
            SetCPrice(null)
          }

          setTimeout(() => {
            if (auto.isNDS)
              $("#c_price~.ui-dialog-buttonpane button:first-child").click();

            $('#dogovor~div button:first-child').click();

            if ($('#dovnumfield').length == 0 || $("#dovdatefield").length == 0)
              return;

            $('#dovnumfield').val("бн");

            $("#dovdatefield").val(new Date().toLocaleDateString().replaceAll('.', '/'));

            $("#dlgdoveren~.ui-dialog-buttonpane button:last-child").click();


            const finishFunc = function () {
              window.$eventHub.removeEvent("PostLoaded", finishFunc);
              //Подвержение завяки(ВЫКЛЮЧИТЬ ПРИ ТЕСТИРОВАНИИ!!!)
              //$("#dlgterminal~.ui-dialog-buttonpane button:last-child").click();
              let autoList = JSON.parse(localStorage.autoList || '[]');
              autoList = autoList.filter(e => e.findString !== auto.findString);
              localStorage.setItem('autoList', JSON.stringify(autoList));

              /*if(isAutoUpdate)
                autoUpdateIntervalId = setInterval(AutoUpdate, getAutoUpdateInterval());*/
            }
            window.$eventHub.addEvent("PostLoaded", finishFunc);

          });
        }, 100);
      }
      window.$eventHub.addEvent("PostLoaded", selectAutoFunc);
    })

  }

  function setAutoUpdateInterval(val) {
    const parsed = parseFloat(val);
    if (isNaN(parsed) || parsed < 0.5) {
      alert('Не верное время!');
      return;
    }
    localStorage.setItem('autoUpdateInterval', parsed * 1000);
  }

  function getAutoUpdateInterval() {
    return localStorage.autoUpdateInterval || 1000;
  }

  function AutoUpdate() {
    if (!settings.isAutoUpdate)
      return;
    getProposals(checkProposals);
  }

  function getProposals(cb) {
    const params = {"type": "ajax", "operation": "getlist", "state": "ready", "number": 0, "guid": ""};
    $.tnPostEsc("RequestForTransportList.aspx", params, result => {
      if (!result)
        return;
      const struct = $.remParse(result, false);
      const rows = struct?.['СписокДокументов']?.rows;
      if (!rows)
        return;
      const proposals = rows.map(({values}) => {
        return {
          id: values[2],
          startCity: values[4],
          endCity: values[5],
          startDate: values[7]?.value,
          autoType: values[9],
          ...values[14]
        }
      })
      setTimeout(() => cb(proposals), 100);
    })
  }

  function checkProposals(proposals) {
    try {
      let finded = false;
      const autoList = JSON.parse(localStorage.autoList || '[]');
      proposals.forEach(proposal => {
        if (finded)
          return;
        const candidate = autoList.find(auto => {
          const startDateP = new Date(proposal.startDate).toLocaleDateString();
          const startDateA = new Date(auto.startDate).toLocaleDateString();
          return (
            proposal.autoType === auto.autoType &&
            proposal.startCity === auto.startCity &&
            startDateA === startDateP &&
            auto.endCity.includes(proposal.endCity)
          );
        });

        if (!candidate)
          return;
        finded = true;

        GetInfo({
          Guid: proposal.guid,
          TypeName: proposal.name,
          type: "RemRef"
        });
        start.argAuto = candidate;
        window.$eventHub.addEvent("PostLoaded", start);
      });
      if (settings.isAutoUpdate && !finded)
        setTimeout(AutoUpdate, getAutoUpdateInterval());
    } catch {
      console.error('[checkProposals]: Ошибка обработки записей');
    }
  }

  function findAutoByArg(search, cb) {
    $.tnPostEsc("RequestForTransportList.aspx", {
        type: 'ajax',
        operation: 'getlist',
        state: 'auto',
        number: 0,
        guid: '',
        search
      },
      (function (str) {
        const struct = $.remParse(str, false);
        const data = struct?.['СписокДокументов']?.rows;
        if (!data)
          cb.call(this, []);
        const result = data.map(({values}) => {
          return {
            name: values[2].trim(),
            findString: values[1].trim(),
            isNDS: !!values[4]
          };
        })
        cb.call(this, result)
      }).bind(this))
  }

  function fastTakeProposal(proposal) {
    const vueElm = $('<select-auto-popup :data="data" @cancel="cancelClick" @save-result="saveHandle" @start-search="startSearch"></select-auto-popup>');
    $('body').append(vueElm);

    const VuePopup = new Vue({
      el: vueElm[0],
      data: {
        data: {
          all: [],
          added: JSON.parse(localStorage.autoList || '[]')
        }
      },
      methods: {
        saveHandle: function (val) {
          setTimeout(() => {
            GetInfo(proposal.documentRef);
            start.argAuto = val;
            window.$eventHub.addEvent("PostLoaded", start);
          }, 0)
          this.$destroy();
          $(this.$el).remove();
        },
        cancelClick: function () {
          this.$destroy();
          $(this.$el).remove();
        },
        startSearch: function (type, value) {
          let searchArg = {
            Автомобиль: '',
            Водитель: '',
          }
          if (type === 'fio') {
            searchArg.Водитель = value;
          } else {
            searchArg.Автомобиль = value;
          }
          var that = this;
          findAutoByArg.call(this, searchArg, function (result) {
            if (!result)
              return;
            this.data = {all: [...result], added: [...this.data.added]};
          })
        }
      }
    });
  }
})();