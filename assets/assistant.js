/* =========================================================
   DNY Bilişim — site asistanı
   ---------------------------------------------------------
   Yapay zekâ KULLANMAZ. Dışarıya istek atmaz, API anahtarı
   gerektirmez, ücret doğurmaz. Ziyaretçinin yazdığı cümledeki
   anahtar kelimeleri aşağıdaki bilgi tabanıyla eşleştirir ve
   hazır cevabı verir. Anlamadığında dürüstçe söyler ve
   destek@dny.com.tr adresine yönlendirir.

   YENİ KONU EKLEMEK: KB dizisine yeni bir nesne ekleyin.
     k  : Türkçe anahtar kelimeler (küçük harf, şapkasız yazın)
     ke : İngilizce anahtar kelimeler
     a  : cevap { tr, en }
     l  : bağlantılar [{ t:{tr,en}, h:'sayfa.html' }]
   ========================================================= */
(function () {
  'use strict';

  var MAIL = 'destek@dny.com.tr';

  /* ---------------- bilgi tabanı ---------------- */
  var KB = [
    {
      id: 'selam',
      k: ['merhaba', 'selam', 'iyi gunler', 'gunaydin', 'iyi aksamlar', 'hey'],
      ke: ['hello', 'hi', 'good morning', 'hey'],
      a: {
        tr: 'Merhaba. Hizmetler, uzak destek, teklif ve iletişim konularında yardımcı olabilirim. Ne öğrenmek istersiniz?',
        en: 'Hello. I can help with services, remote support, quotes and contact details. What would you like to know?'
      }
    },
    {
      id: 'hizmet',
      k: ['hizmet', 'hizmetler', 'ne yapiyorsunuz', 'neler yapiyorsunuz', 'hangi konularda', 'neler sunuyorsunuz'],
      ke: ['service', 'what do you do', 'offer'],
      a: {
        tr: 'Sekiz alanda çalışıyoruz: danışmanlık, donanım ve sistem kurulumu, ağ ve kablolama, güvenlik, 7/24 teknik destek, web ve yazılım, hosting, yedekleme. Hepsi aynı ekipte — arıza çıkınca tek muhatap.',
        en: 'We work in eight areas: consultancy, hardware and system installation, network and cabling, security, 24/7 technical support, web and software, hosting, backup. All in one team — one point of contact when something breaks.'
      },
      l: [{ t: { tr: 'Hizmetleri gör', en: 'See services' }, h: 'hizmetler.html' }]
    },
    {
      id: 'donanim',
      k: ['donanim', 'sunucu', 'bilgisayar', 'server', 'yazici', 'is istasyonu', 'laptop', 'kasa', 'ekran'],
      ke: ['hardware', 'server', 'computer', 'printer', 'workstation', 'laptop'],
      a: {
        tr: 'Sunucu, iş istasyonu, dizüstü, yazıcı ve çevre birimlerinin tedariki, kurulumu ve periyodik bakımını yapıyoruz. Marka bağımsız çalışıyoruz; kuruma en uygun yapılandırmayı öneririz.',
        en: 'We supply, install and maintain servers, workstations, laptops, printers and peripherals. We work brand-independently and recommend the configuration that fits your company.'
      },
      l: [{ t: { tr: 'Detay', en: 'Details' }, h: 'hizmetler.html#donanim' }],
      konu: 'Donanım ve sistem kurulumu'
    },
    {
      id: 'ag',
      k: ['ag', 'kablolama', 'kablo', 'switch', 'router', 'modem', 'wifi', 'kablosuz', 'internet', 'baglanti kopuyor', 'network'],
      ke: ['network', 'cabling', 'switch', 'router', 'wifi', 'wireless', 'internet'],
      a: {
        tr: 'Yapılandırılmış kablolama, switch yerleşimi ve kablosuz ağ tasarımı yapıyoruz. Yeni ofiste sıfırdan kurulum, mevcut ofiste kablo düzeni ve performans iyileştirmesi. Kapsama ölçülerek planlanır, misafir ağı kurum ağından ayrılır.',
        en: 'We do structured cabling, switch layout and wireless network design. Full setup for new offices, cabling cleanup and performance tuning for existing ones. Coverage is measured before planning, and the guest network is kept separate.'
      },
      l: [{ t: { tr: 'Detay', en: 'Details' }, h: 'hizmetler.html#ag' }],
      konu: 'Ağ ve kablolama'
    },
    {
      id: 'guvenlik',
      k: ['guvenlik', 'firewall', 'guvenlik duvari', 'kamera', 'virus', 'fidye', 'saldiri', 'hack', 'gecis kontrol', 'yetki'],
      ke: ['security', 'firewall', 'camera', 'virus', 'ransomware', 'attack', 'access control'],
      a: {
        tr: 'Güvenlik duvarı yapılandırması, kullanıcı erişim yetkileri, kamera ve geçiş kontrol sistemleri. Dijital güvenlikle fiziksel güvenliği aynı planda ele alıyoruz; kurallar düzenli olarak gözden geçirilir.',
        en: 'Firewall configuration, user access permissions, camera and access control systems. We treat digital and physical security as one plan, and rules are reviewed regularly.'
      },
      l: [{ t: { tr: 'Detay', en: 'Details' }, h: 'hizmetler.html#guvenlik' }],
      konu: 'Güvenlik çözümleri'
    },
    {
      id: 'destek',
      k: ['destek', 'ariza', 'bozuldu', 'calismiyor', 'acil', 'yardim', 'sorun', 'hata', 'durdu', 'acildi'],
      ke: ['support', 'broken', 'not working', 'urgent', 'help', 'problem', 'down'],
      a: {
        tr: 'Destek kanalımız 7 gün 24 saat açık — gece, hafta sonu, tatil fark etmez. Çoğu sorun uzak bağlantıyla dakikalar içinde çözülür; donanım gerekiyorsa İstanbul içinde aynı gün yerinde servis veriyoruz. Acil durumda doğrudan ' + MAIL + ' adresine yazın.',
        en: 'Our support channel is open 24/7 — nights, weekends and holidays included. Most problems are solved remotely within minutes; if hardware is involved we provide same-day on-site service within Istanbul. For emergencies write straight to ' + MAIL + '.'
      },
      l: [{ t: { tr: 'Uzak destek', en: 'Remote support' }, h: 'uzak-destek.html' },
           { t: { tr: 'Bize yazın', en: 'Write to us' }, h: 'mailto:' + MAIL }]
    },
    {
      id: 'uzak',
      k: ['uzak destek', 'uzaktan', 'teamviewer', 'baglanin', 'quicksupport', 'ekranima', 'uzak baglanti'],
      ke: ['remote', 'teamviewer', 'quicksupport', 'connect to my screen'],
      a: {
        tr: 'Önce ' + MAIL + ' adresine sorunu kısaca yazın. Sonra gerekli yazılımlar sayfasından TeamViewer QuickSupport dosyasını indirip çalıştırın — kurulum gerektirmez. Ekranda çıkan kimlik ve şifreyi bize iletin. Bağlantı ancak siz onay verdikten sonra kurulur ve yapılan her işlemi ekranınızda görürsünüz.',
        en: 'First send a short description of the problem to ' + MAIL + '. Then download and run TeamViewer QuickSupport from the downloads page — no installation needed. Send us the ID and password shown on screen. The connection is only made after you approve it, and you watch everything that happens.'
      },
      l: [{ t: { tr: 'Programı indir', en: 'Download' }, h: 'gerekli-yazilimlar.html' },
           { t: { tr: 'Nasıl işler', en: 'How it works' }, h: 'uzak-destek.html' }]
    },
    {
      id: 'yazilim',
      k: ['web', 'site', 'yazilim', 'eticaret', 'e ticaret', 'tasarim', 'internet sitesi', 'uygulama'],
      ke: ['web', 'website', 'software', 'ecommerce', 'design', 'application'],
      a: {
        tr: 'Kurumsal web siteleri, e-ticaret ve iş süreçlerinize özel yazılım geliştiriyoruz. Tasarım, geliştirme, yayına alma ve sonrasındaki güncellemeler aynı ekipte.',
        en: 'We build corporate websites, e-commerce and custom software for your business processes. Design, development, launch and later updates all sit with the same team.'
      },
      l: [{ t: { tr: 'Detay', en: 'Details' }, h: 'hizmetler.html#web' }],
      konu: 'Web tasarım ve yazılım'
    },
    {
      id: 'hosting',
      k: ['hosting', 'alan adi', 'domain', 'barindirma', 'eposta', 'e posta', 'mail kurulumu', 'ssl'],
      ke: ['hosting', 'domain', 'email setup', 'ssl'],
      a: {
        tr: 'Alan adı tescili, web barındırma, SSL ve kurumsal e-posta hizmeti veriyoruz. Kayıtlar kurum adına açılır — yönetim bizde, sahiplik sizde kalır.',
        en: 'Domain registration, web hosting, SSL and corporate email. Records are registered in your company\'s own name — we manage it, you own it.'
      },
      l: [{ t: { tr: 'Detay', en: 'Details' }, h: 'hizmetler.html#hosting' }],
      konu: 'Hosting ve alan adı'
    },
    {
      id: 'yedek',
      k: ['yedek', 'yedekleme', 'veri kaybi', 'backup', 'felaket', 'kurtarma', 'dosyalar gitti'],
      ke: ['backup', 'data loss', 'disaster', 'recovery', 'lost files'],
      a: {
        tr: 'Otomatik yedekleme kurar, düzenli geri dönüş testi yaparız. Yedeğin alınmış olması yetmez; geri dönebildiği test edilmelidir. Bir kopya da bina dışında tutulur.',
        en: 'We set up automated backups and run regular restore tests. Having a backup is not enough — it must be proven that it can be restored. One copy is also kept off site.'
      },
      l: [{ t: { tr: 'Detay', en: 'Details' }, h: 'hizmetler.html#yedekleme' }],
      konu: 'Yedekleme ve iş sürekliliği'
    },
    {
      id: 'danismanlik',
      k: ['danismanlik', 'planlama', 'butce', 'yatirim', 'envanter', 'kesif', 'analiz'],
      ke: ['consultancy', 'planning', 'budget', 'investment', 'inventory', 'survey'],
      a: {
        tr: 'Yatırım yapmadan önce yerinde keşif yapıyoruz: envanter çıkarılır, darboğazlar ve güvenlik açıkları raporlanır, bütçe ve öncelik sırası hazırlanır. Keşif ziyareti ücretsizdir.',
        en: 'Before any spending we run an on-site survey: inventory, a report of bottlenecks and security gaps, then a budget and priority order. The survey visit is free.'
      },
      l: [{ t: { tr: 'Detay', en: 'Details' }, h: 'hizmetler.html#danismanlik' }],
      konu: 'Bilişim danışmanlığı'
    },
    {
      id: 'teklif',
      k: ['teklif', 'fiyat', 'ucret', 'maliyet', 'ne kadar', 'kac para', 'butce', 'anlasma'],
      ke: ['quote', 'price', 'cost', 'how much', 'pricing'],
      a: {
        tr: 'Fiyat kurumun mevcut altyapısına göre değişiyor, o yüzden hazır liste vermiyoruz. Keşif ziyareti ücretsiz: yerinde bakıp neyin gerçekten gerektiğini raporluyoruz, sonra net teklif çıkarıyoruz. Formu doldurun, aynı gün dönelim.',
        en: 'Pricing depends on your existing infrastructure, so we do not publish a fixed list. The survey visit is free: we look on site, report what is genuinely needed, then give a firm quote. Fill in the form and we will reply the same day.'
      },
      l: [{ t: { tr: 'Teklif formu', en: 'Request a quote' }, h: 'iletisim.html' }]
    },
    {
      id: 'iletisim',
      k: ['iletisim', 'adres', 'nerede', 'konum', 'ofis', 'telefon', 'mail', 'eposta adresi', 'ulasmak'],
      ke: ['contact', 'address', 'where', 'location', 'office', 'phone', 'email'],
      a: {
        tr: 'E-posta: ' + MAIL + ' (7/24 açık). Ofis: Binbirdirek Mah. Dostluk Yurdu Sk. No:1/9 Yeşil Apt., 34122 Sultanahmet / Fatih — İstanbul.',
        en: 'Email: ' + MAIL + ' (open 24/7). Office: Binbirdirek Mah. Dostluk Yurdu Sk. No:1/9 Yeşil Apt., 34122 Sultanahmet / Fatih — Istanbul.'
      },
      l: [{ t: { tr: 'İletişim sayfası', en: 'Contact page' }, h: 'iletisim.html' },
           { t: { tr: 'E-posta gönder', en: 'Send email' }, h: 'mailto:' + MAIL }]
    },
    {
      id: 'saat',
      k: ['saat', 'acik misiniz', 'mesai', 'calisma saatleri', 'hafta sonu', 'gece', 'tatil', '724', '7 24'],
      ke: ['hours', 'open', 'weekend', 'night', 'holiday', '24/7'],
      a: {
        tr: 'Ofis hafta içi 09:00 – 18:00 arası açık. Destek kanalı ise 7 gün 24 saat açık: gece, hafta sonu ve resmî tatiller dahil. Yerinde servis İstanbul içinde aynı gün.',
        en: 'The office is open weekdays 09:00 – 18:00. The support channel is open 24/7, including nights, weekends and public holidays. On-site service within Istanbul is same-day.'
      }
    },
    {
      id: 'referans',
      k: ['referans', 'kimlerle', 'musteri', 'firma', 'kimlere', 'calistiginiz'],
      ke: ['reference', 'client', 'customer', 'who do you work with'],
      a: {
        tr: 'Sigortacılıktan ilaç dağıtımına, otomotiv servisinden tekstil makinelerine kadar altı sektörde çalışıyoruz. Müşterilerimizin çoğu on yılı aşkın süredir aynı ekiple devam ediyor.',
        en: 'We work across six sectors, from insurance to pharmaceutical distribution, from automotive service to textile machinery. Most of our clients have stayed with the same team for over a decade.'
      },
      l: [{ t: { tr: 'Referanslar', en: 'Clients' }, h: 'referanslar.html' }]
    },
    {
      id: 'hakkinda',
      k: ['hakkinda', 'kimsiniz', 'ne zaman kuruldu', 'kac yil', 'tarihce', 'firma hakkinda', 'kurucu'],
      ke: ['about', 'who are you', 'founded', 'history', 'years'],
      a: {
        tr: 'DNY Bilişim 1996 yılında kuruldu, otuz yıldır İstanbul\'da kurumsal bilişim altyapısı kuruyor ve yönetiyoruz. Donanımdan yazılıma kadar her katman aynı ekipte.',
        en: 'DNY Bilişim was founded in 1996 and has been building and managing corporate IT infrastructure in Istanbul for thirty years. Every layer, from hardware to software, sits with the same team.'
      },
      l: [{ t: { tr: 'Hakkımızda', en: 'About us' }, h: 'hakkimizda.html' }]
    },
    {
      id: 'tesekkur',
      k: ['tesekkur', 'sagol', 'sag ol', 'eyvallah', 'tamamdir'],
      ke: ['thanks', 'thank you', 'cheers'],
      a: {
        tr: 'Rica ederiz. Başka bir sorunuz olursa buradayım; doğrudan görüşmek isterseniz ' + MAIL + ' adresine yazabilirsiniz.',
        en: 'You are welcome. I am here if anything else comes up; to speak with someone directly, write to ' + MAIL + '.'
      }
    }
  ];

  var CHIPS = [
    { tr: 'Hizmetleriniz neler?', en: 'What services do you offer?' },
    { tr: 'Acil desteğe ihtiyacım var', en: 'I need urgent support' },
    { tr: 'Teklif almak istiyorum', en: 'I would like a quote' },
    { tr: 'Uzak destek nasıl oluyor?', en: 'How does remote support work?' }
  ];

  var UI = {
    title:   { tr: 'DNY Yardımcı', en: 'DNY Assistant' },
    sub:     { tr: 'Site içi yönlendirme', en: 'On-site guidance' },
    open:    { tr: 'Yardımcıyı aç', en: 'Open assistant' },
    close:   { tr: 'Kapat', en: 'Close' },
    ph:      { tr: 'Sorunuzu yazın…', en: 'Type your question…' },
    send:    { tr: 'Gönder', en: 'Send' },
    hello:   { tr: 'Merhaba. Size nasıl yardımcı olabilirim? Aşağıdakilerden birine dokunabilir ya da sorunuzu yazabilirsiniz.',
               en: 'Hello. How can I help? Tap one of the options below or type your question.' },
    note:    { tr: 'Bu yardımcı hazır cevaplar verir, yapay zekâ kullanmaz.',
               en: 'This assistant gives prepared answers and does not use AI.' },
    nomatch: { tr: 'Bunu tam anlayamadım. Şu konularda yardımcı olabilirim: hizmetler, uzak destek, teklif, çalışma saatleri, iletişim. Sorunuz bunların dışındaysa ' + MAIL + ' adresine yazın, ekip aynı gün dönsün.',
               en: 'I could not quite understand that. I can help with services, remote support, quotes, opening hours and contact details. For anything else, write to ' + MAIL + ' and the team will reply the same day.' },
    quote:   { tr: 'Bu konuda teklif al', en: 'Request a quote for this' }
  };

  /* ---------------- yardımcılar ---------------- */
  function lang() {
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'tr';
  }
  // Türkçe karakterleri sadeleştir: eşleştirme şapkasız yapılır
  function norm(s) {
    return (s || '')
      .replace(/I/g, 'ı').replace(/İ/g, 'i')
      .toLowerCase()
      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
      .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Kelime sınırına saygılı eşleştirme.
  // "sistemi" içindeki "is" gibi tesadüfi parçalar puan kazanmaz;
  // Türkçe ekler ("hizmetleriniz" -> "hizmet") kelime başından yakalanır.
  function match(text) {
    var q = norm(text);
    if (!q) return null;
    var toks = q.split(' ');
    var best = null, bestScore = 0;

    KB.forEach(function (item) {
      var words = (item.k || []).concat(item.ke || []);
      var score = 0;
      words.forEach(function (w) {
        var n = norm(w);
        if (!n) return;
        if (n.indexOf(' ') > -1) {                       // çok kelimeli kalıp
          if (q.indexOf(n) > -1) score += 4;
          return;
        }
        if (n.length < 3) return;                        // çok kısa anahtar atlanır
        for (var i = 0; i < toks.length; i++) {
          var tk = toks[i];
          if (tk === n) { score += 3; return; }                              // tam kelime
          if (n.length >= 4 && tk.indexOf(n) === 0) { score += 2; return; }  // kelime başı (ek almış)
          if (n.length >= 6 && tk.indexOf(n.slice(0, n.length - 2)) === 0) { score += 1; return; }
        }
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return bestScore >= 2 ? best : null;
  }

  /* ---------------- arayüz ---------------- */
  var root = document.createElement('div');
  root.className = 'asst';
  root.innerHTML =
    '<button class="asst__fab" type="button" aria-expanded="false">' +
      '<svg class="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-3.9-.9L3 20.5l1.6-4.6A8.4 8.4 0 013.6 11.5a8.4 8.4 0 018.4-8.4h.5a8.4 8.4 0 018.5 8.4z"/>' +
        '<path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>' +
      '<svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">' +
        '<path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<div class="asst__panel" role="dialog" hidden>' +
      '<div class="asst__head">' +
        '<span class="asst__dot"></span>' +
        '<span class="asst__ttl"><b></b><small></small></span>' +
        '<button class="asst__x" type="button">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="asst__log" role="log" aria-live="polite"></div>' +
      '<div class="asst__chips"></div>' +
      '<form class="asst__bar">' +
        '<input type="text" autocomplete="off">' +
        '<button type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>' +
      '</form>' +
      '<p class="asst__note"></p>' +
    '</div>';
  document.body.appendChild(root);

  var fab = root.querySelector('.asst__fab');
  var panel = root.querySelector('.asst__panel');
  var log = root.querySelector('.asst__log');
  var chipBox = root.querySelector('.asst__chips');
  var form = root.querySelector('.asst__bar');
  var input = form.querySelector('input');
  var greeted = false;

  function labels() {
    var L = lang();
    fab.setAttribute('aria-label', UI.open[L]);
    root.querySelector('.asst__ttl b').textContent = UI.title[L];
    root.querySelector('.asst__ttl small').textContent = UI.sub[L];
    root.querySelector('.asst__x').setAttribute('aria-label', UI.close[L]);
    root.querySelector('.asst__note').textContent = UI.note[L];
    input.placeholder = UI.ph[L];
    form.querySelector('button').setAttribute('aria-label', UI.send[L]);
    panel.setAttribute('aria-label', UI.title[L]);
  }

  function bubble(html, who) {
    var d = document.createElement('div');
    d.className = 'asst__msg is-' + who;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function answer(item) {
    var L = lang();
    if (!item) return bubble(esc(UI.nomatch[L]), 'bot');
    var html = esc(item.a[L]);
    var links = (item.l || []).slice();
    if (item.konu) {
      links.push({ t: UI.quote, h: 'iletisim.html?konu=' + encodeURIComponent(item.konu) });
    }
    if (links.length) {
      html += '<span class="asst__links">' + links.map(function (x) {
        return '<a href="' + x.h + '">' + esc(x.t[L]) + '</a>';
      }).join('') + '</span>';
    }
    return bubble(html, 'bot');
  }

  function think(item) {
    var dots = bubble('<span class="asst__typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(function () { dots.remove(); answer(item); }, 380);
  }

  function renderChips() {
    var L = lang();
    chipBox.innerHTML = '';
    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = c[L];
      b.addEventListener('click', function () { ask(c[L]); });
      chipBox.appendChild(b);
    });
  }

  function ask(text) {
    bubble(esc(text), 'me');
    think(match(text));
  }

  function open() {
    panel.hidden = false;
    root.classList.add('is-open');
    fab.setAttribute('aria-expanded', 'true');
    if (!greeted) { greeted = true; bubble(esc(UI.hello[lang()]), 'bot'); }
    setTimeout(function () {
      if (window.innerWidth > 640) input.focus({ preventScroll: true });
    }, 260);
  }
  function close() {
    root.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    setTimeout(function () { panel.hidden = true; }, 240);
  }

  fab.addEventListener('click', function () {
    root.classList.contains('is-open') ? close() : open();
  });
  root.querySelector('.asst__x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    input.value = '';
    ask(v);
  });

  labels();
  renderChips();

  // dil değişirse arayüz metinleri ve öneriler güncellensin
  new MutationObserver(function () { labels(); renderChips(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
