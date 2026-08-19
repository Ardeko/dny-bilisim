/* =========================================================
   DNY Bilişim — SUNUM İÇİN ÖRNEK VERİ
   =========================================================
   !!! DİKKAT — BU DOSYA YAYINA ALINMAMALIDIR !!!

   Bu script, sistem durumu paneline ÖRNEK sunucu verisi
   besler. Amacı, izleme ajanı kurulduğunda panelin nasıl
   görüneceğini müşteriye gösterebilmektir.

   Gerçek kurulumda bu dosya SİLİNİR. Sunucudaki ajan
   durum.json üretmeye başladığında panel zaten kendiliğinden
   gerçek veriye geçer; bu dosyaya hiç gerek kalmaz.

   Yayın paketinde (dny-bilisim/) bu dosya YOKTUR.
   ========================================================= */
(function () {
  'use strict';

  if (window.console && console.warn) {
    console.warn(
      '%c[DNY] SUNUM MODU — sistem durumu panelindeki değerler ÖRNEKTİR.',
      'background:#FFC24B;color:#0A1020;font-weight:700;padding:3px 8px;border-radius:4px'
    );
    console.warn('[DNY] Yayına almadan önce assets/durum-demo.js dosyasını ve ' +
                 'HTML\'deki script satırını silin.');
  }

  // Örnek sunucu listesi — müşterinin kendi sunucularıyla değiştirilebilir.
  // "ic: true" olanlar iç ağda kabul edilir, LAN ping bandında değer üretir.
  var SUNUCULAR = [
    { label: 'Dosya sunucusu',    taban: 1,  ic: true  },
    { label: 'Posta sunucusu',    taban: 2,  ic: true  },
    { label: 'Yedekleme ünitesi', taban: 3,  ic: true  },
    { label: 'Güvenlik duvarı',   taban: 1,  ic: true  },
    { label: 'Müşteri portalı',   taban: 11, ic: false },
    { label: 'Web sunucusu',      taban: 14, ic: false }
  ];

  function uret() {
    return SUNUCULAR.map(function (s) {
      var sapma = (Math.random() - 0.5) * (s.ic ? 2 : 6);
      return {
        label: s.label,
        up: true,
        ms: Math.max(1, s.taban + Math.round(sapma))
      };
    });
  }

  // durum.json isteğini yakala, örnek veriyle cevapla.
  // Diğer tüm istekler olduğu gibi geçer.
  var _fetch = window.fetch;
  window.fetch = function (url) {
    if (String(url).indexOf('durum.json') > -1) {
      return Promise.resolve({
        ok: true,
        json: function () { return Promise.resolve(uret()); }
      });
    }
    return _fetch.apply(window, arguments);
  };
})();
