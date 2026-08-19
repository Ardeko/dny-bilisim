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
        tr: 'Merhaba. Hizmetler, uzaktan destek, teklif ve iletişim konularında yardımcı olabilirim. Ne öğrenmek istersiniz?',
        en: 'Hello. I can help with services, remote support, quotes and contact details. What would you like to know?'
      }
    },
    {
      id: 'hizmet',
      k: ['hizmet', 'hizmetler', 'isiniz', 'isleriniz', 'alanlar', 'hangi konularda', 'neler sunuyorsunuz'],
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
        tr: 'Destek kanalımız 7 gün 24 saat açık — gece, hafta sonu, tatil fark etmez. Çoğu sorun uzaktan bağlantıyla dakikalar içinde çözülür; donanım gerekiyorsa İstanbul içinde aynı gün yerinde servis veriyoruz. Acil durumda doğrudan ' + MAIL + ' adresine yazın.',
        en: 'Our support channel is open 24/7 — nights, weekends and holidays included. Most problems are solved remotely within minutes; if hardware is involved we provide same-day on-site service within Istanbul. For emergencies write straight to ' + MAIL + '.'
      },
      l: [{ t: { tr: 'Uzaktan destek', en: 'Remote support' }, h: 'uzaktan-destek.html' },
           { t: { tr: 'Bize yazın', en: 'Write to us' }, h: 'mailto:' + MAIL }]
    },
    {
      id: 'uzak',
      k: ['uzaktan destek', 'uzaktan', 'teamviewer', 'baglanin', 'quicksupport', 'ekranima', 'uzak baglanti'],
      ke: ['remote', 'teamviewer', 'quicksupport', 'connect to my screen'],
      a: {
        tr: 'Önce ' + MAIL + ' adresine sorunu kısaca yazın. Sonra gerekli yazılımlar sayfasından TeamViewer QuickSupport dosyasını indirip çalıştırın — kurulum gerektirmez. Ekranda çıkan kimlik ve şifreyi bize iletin. Bağlantı ancak siz onay verdikten sonra kurulur ve yapılan her işlemi ekranınızda görürsünüz.',
        en: 'First send a short description of the problem to ' + MAIL + '. Then download and run TeamViewer QuickSupport from the downloads page — no installation needed. Send us the ID and password shown on screen. The connection is only made after you approve it, and you watch everything that happens.'
      },
      l: [{ t: { tr: 'Programı indir', en: 'Download' }, h: 'gerekli-yazilimlar.html' },
           { t: { tr: 'Nasıl işler', en: 'How it works' }, h: 'uzaktan-destek.html' }]
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
      k: ['hosting', 'alan adi', 'domain', 'barindirma', 'eposta', 'e posta', 'mail', 'eposta kurulumu', 'ssl'],
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
      k: ['iletisim', 'adres', 'adresiniz', 'nerede', 'konum', 'ofis', 'ulasmak', 'eposta adresiniz'],
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
      k: ['hakkinda', 'kimsiniz', 'ne zaman kuruldu', 'kac yil', 'kac yildir', 'yildir', 'yil', 'kurulus', 'deneyim', 'tecrube', 'tarihce', 'firma hakkinda', 'kurucu'],
      ke: ['about', 'who are you', 'founded', 'history', 'years'],
      a: {
        tr: 'DNY Bilişim 1996 yılında kuruldu, otuz yıldır İstanbul\'da kurumsal bilişim altyapısı kuruyor ve yönetiyoruz. Donanımdan yazılıma kadar her katman aynı ekipte.',
        en: 'DNY Bilişim was founded in 1996 and has been building and managing corporate IT infrastructure in Istanbul for thirty years. Every layer, from hardware to software, sits with the same team.'
      },
      l: [{ t: { tr: 'Hakkımızda', en: 'About us' }, h: 'hakkimizda.html' }]
    },

    /* --- SSS sayfasından gelen konular --- */
    {
      id: 'sozlesme',
      k: ['sozlesme', 'anlasma', 'kontrat', 'bakim anlasmasi', 'abonelik', 'aylik'],
      ke: ['contract', 'agreement', 'subscription', 'monthly'],
      a: {
        tr: 'Sözleşme zorunlu değil. Tek seferlik kurulum ve arıza müdahalesi için sözleşmesiz de çalışıyoruz. Periyodik bakım ve öncelikli destek isteyen kurumlarla aylık bakım anlaşması yapıyoruz; müdahale süresi ve kapsam yazılı oluyor.',
        en: 'A contract is not required. We take on one-off installations and call-outs without one. For companies wanting scheduled maintenance and priority support we sign a monthly agreement, with response times and scope in writing.'
      },
      l: [{ t: { tr: 'Tüm sorular', en: 'All questions' }, h: 'sss.html' }]
    },
    {
      id: 'sure',
      k: ['ne kadar surede', 'ne kadar surer', 'surer', 'surecek', 'kac saat', 'kac gun', 'ne zaman gelir', 'mudahale suresi', 'hizli', 'acil gelir'],
      ke: ['how long', 'response time', 'how fast', 'when will you come'],
      a: {
        tr: 'Uzaktan çözülebilen işlerde müdahale genelde dakikalar içinde başlıyor. Donanım değişimi ya da yerinde iş gerekiyorsa İstanbul içinde aynı gün yerinde oluyoruz. Bakım anlaşması olan kurumlar sırada öncelikli.',
        en: 'For anything solvable remotely we usually start within minutes. If hardware replacement or on-site work is needed we are there the same day within Istanbul. Companies with a maintenance agreement take priority.'
      },
      l: [{ t: { tr: 'Bize yazın', en: 'Write to us' }, h: 'mailto:destek@dny.com.tr' }]
    },
    {
      id: 'devralma',
      k: ['devral', 'devralir', 'baska firma kurdu', 'mevcut sistemi devral', 'firma degistir', 'devir'],
      ke: ['take over', 'another company', 'migrate', 'switch provider'],
      a: {
        tr: 'Sık yaptığımız bir iş. Devralmadan önce mevcut yapıyı belgeliyoruz: hangi cihaz nerede, şifreler kimde, yedek nereye gidiyor. Bu envanter çıkmadan sorumluluk almıyoruz — bilinmeyen bir sistemin garantisi verilemez.',
        en: 'We do this often. Before taking over we document the existing setup: which device is where, who holds the passwords, where backups go. We do not accept responsibility until that inventory exists.'
      },
      l: [{ t: { tr: 'İletişim', en: 'Contact' }, h: 'iletisim.html' }]
    },
    {
      id: 'olcek',
      k: ['kac kisi', 'kucuk firma', 'buyuk firma', 'calisan sayisi', 'kac kisilik', 'kobi'],
      ke: ['how many people', 'small company', 'large company', 'employees', 'sme'],
      a: {
        tr: '5 kişilik bir muhasebe bürosundan çok lokasyonlu üretim tesisine kadar çalışıyoruz. Ölçek değişiyor ama yaklaşım aynı: önce keşif, sonra tek bir plan.',
        en: 'From a five-person accountancy office to a multi-site manufacturing plant. The scale changes but the approach does not: survey first, then a single plan.'
      }
    },
    {
      id: 'sss',
      k: ['sikca sorulan', 'sss', 'sorular', 'merak'],
      ke: ['faq', 'frequently asked', 'questions'],
      a: {
        tr: 'Fiyat, sözleşme, müdahale süresi, uzaktan bağlantı güvenliği ve veri sahipliği gibi konularda 12 soruluk bir sayfa hazırladık.',
        en: 'We have a 12-question page covering pricing, contracts, response times, remote-connection security and data ownership.'
      },
      l: [{ t: { tr: 'Sıkça sorulan sorular', en: 'FAQ page' }, h: 'sss.html' }]
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
    { tr: 'Uzaktan destek nasıl oluyor?', en: 'How does remote support work?' }
  ];

  var UI = {
    title:   { tr: 'DNY Asistan', en: 'DNY Assistant' },
    sub:     { tr: 'Soru–cevap yardımcısı', en: 'Question and answer helper' },
    open:    { tr: 'Asistanı aç', en: 'Open the assistant' },
    close:   { tr: 'Kapat', en: 'Close' },
    ph:      { tr: 'Sorunuzu yazın…', en: 'Type your question…' },
    send:    { tr: 'Gönder', en: 'Send' },
    hello:   { tr: 'Merhaba. Size nasıl yardımcı olabilirim? Aşağıdakilerden birine dokunabilir ya da sorunuzu yazabilirsiniz.',
               en: 'Hello. How can I help? Tap one of the options below or type your question.' },
    note:    { tr: 'Hizmetler, destek ve teklif konularında yardımcı olur',
               en: 'Helps with services, support and quotes' },
    nomatch: { tr: 'Bunu tam anlayamadım. Şu konularda yardımcı olabilirim: hizmetler, uzaktan destek, teklif, çalışma saatleri, iletişim. Sorunuz bunların dışındaysa ' + MAIL + ' adresine yazın, ekip aynı gün dönsün.',
               en: 'I could not quite understand that. I can help with services, remote support, quotes, opening hours and contact details. For anything else, write to ' + MAIL + ' and the team will reply the same day.' },
    quote:   { tr: 'Bu konuda teklif al', en: 'Request a quote for this' },
    which:   { tr: 'Bunlardan hangisini kastettiniz?', en: 'Which of these did you mean?' },
    human:   { tr: 'Sanırım sorunuz benim kapsamımın dışında. En hızlısı doğrudan ekibe yazmanız — genellikle aynı gün dönüyoruz.',
               en: 'This seems to be outside what I can answer. The fastest route is to write to the team directly — we usually reply the same day.' },
    mailBtn: { tr: 'E-posta gönder', en: 'Send an email' },
    formBtn: { tr: 'Formu doldur', en: 'Fill in the form' },
    related: { tr: 'Bunlar da ilginizi çekebilir', en: 'You might also want to know' },
    wizStart:{ tr: 'Birkaç soruyla ihtiyacınızı netleştirelim, sonra doğrudan teklif isteyin.',
               en: 'Let me narrow it down with a few questions, then request a quote directly.' },
    wizQ1:   { tr: 'Hangi konuda teklif istiyorsunuz?', en: 'What would you like a quote for?' },
    wizQ2:   { tr: 'Kurumunuzda kaç kişi çalışıyor?', en: 'How many people work at your company?' },
    wizQ3:   { tr: 'Aciliyeti nedir?', en: 'How urgent is it?' },
    wizDone: { tr: 'Teşekkürler. Aşağıdaki butona basınca form bu bilgilerle açılacak — sadece iletişim bilgilerinizi eklemeniz yeterli.',
               en: 'Thank you. The button below opens the form pre-filled — you only need to add your contact details.' },
    wizForm: { tr: 'Formu bu bilgilerle aç', en: 'Open the form with these details' },
    wizMail: { tr: 'E-posta ile gönder', en: 'Send by email' },
    urgent:  { tr: 'Sistem durmuşsa beklemeyin — destek kanalımız şu an açık.',
               en: 'If your system is down, do not wait — our support channel is open right now.' }
  };

  /* ---------------- dil ve metin işleme ---------------- */
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

  // Türkçe eklerden arındırma (hafif gövdeleme).
  // "sunucumuzdaki" -> "sunucu", "guvenligimiz" -> "guvenlig"
  // Amaç dilbilimsel doğruluk değil, aynı kökün aynı sepete düşmesi.
  var EKLER = ['larimizdan','lerimizden','larimizda','lerimizde','larindan','lerinden',
    'larimiz','lerimiz','lariniz','leriniz','larina','lerine','larda','lerde','lardan','lerden',
    'imizde','imizden','inizde','inizden','iyoruz','iyorsunuz','iyorsun','iyor',
    'lik','luk','lig','lug','ligi','lugu','miz','niz','lari','leri','lar','ler',
    'imiz','umuz','inde','inda','indan','inden','iniz','unuz','dan','den','tan','ten','nin','nun',
    'daki','deki','taki','teki','dir','dur','tir','tur','da','de','ta','te','yi','yu','ye','ya',
    'in','un','si','su','im','um','ip','ir','ur','mak','mek','ci','cu','li','lu','siz','suz',
    'i','u','e','a'];
  function govde(w) {
    if (w.length < 5) return w;
    for (var i = 0; i < EKLER.length; i++) {
      var e = EKLER[i];
      if (w.length - e.length >= 3 && w.slice(-e.length) === e) {
        return w.slice(0, w.length - e.length);
      }
    }
    return w;
  }

  // Gürültü kelimeler: soru ekleri, zamirler, bağlaçlar.
  // Bunlar puan kazandırırsa "kamera kurar mısınız" ile
  // "devralır mısınız" aynı puanı alır — o yüzden atılıyorlar.
  var DUR = {};
  ('mi mı mu mü misin misiniz miyim miyiz musun musunuz misiniz mısınız muyuz müyüz ' +
   'bir bu şu ve ile veya ama için gibi de da ki her çok daha en acaba lütfen ' +
   'ben biz siz sen onlar bana bize size bende bizde sizde ' +
   'ne neler nasil yap yapiyor yapar kur kurar veriyor aliyor olur var mi ' +
   'do you the a an is are can could would i we my our your it its to of for and or ' +
   'how what please me us there their with')
    .split(' ').forEach(function (w) { DUR[norm(w)] = 1; });

  // Eş anlamlılar: kullanıcı ne derse desin aynı köke gitsin
  var ESANLAM = {
    pc: 'bilgisayar', komputer: 'bilgisayar', laptop: 'bilgisayar', dizustu: 'bilgisayar',
    mail: 'eposta', email: 'eposta', maili: 'eposta', posta: 'eposta',
    net: 'internet', wifi: 'kablosuz', wi: 'kablosuz',
    firewall: 'guvenlik', antivirus: 'guvenlik', virus: 'guvenlik', fidye: 'guvenlik',
    ransomware: 'guvenlik', hack: 'guvenlik', saldiri: 'guvenlik',
    backup: 'yedek', restore: 'yedek',
    server: 'sunucu', hosting: 'barindirma', domain: 'alanadi',
    site: 'web', website: 'web', internetsitesi: 'web',
    ariza: 'bozuk', calismiyor: 'bozuk', bozuldu: 'bozuk', patladi: 'bozuk', durdu: 'bozuk',
    ucret: 'fiyat', maliyet: 'fiyat', tutar: 'fiyat', para: 'fiyat', butce: 'fiyat',
    tel: 'iletisim', telefon: 'iletisim', numara: 'iletisim', adres: 'iletisim',
    teamviewer: 'uzaktan', anydesk: 'uzaktan', quicksupport: 'uzaktan',
    kamera: 'kamera', cctv: 'kamera', guvenlikkamerasi: 'kamera'
  };

  function jetonla(text) {
    var out = [];
    norm(text).split(' ').forEach(function (w) {
      if (!w || w.length < 2 || DUR[w]) return;
      if (ESANLAM[w]) w = ESANLAM[w];
      if (DUR[w]) return;
      var g = govde(w);
      if (DUR[g]) return;
      out.push(g);
      if (g !== w) out.push(w);
    });
    return out;
  }

  // Yazım hatası toleransı: tek harf farkına izin ver (uzun kelimelerde)
  function yakin(a, b) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1) return false;
    if (a.length < 5 || b.length < 5) return false;   // "sonuç" ile "sonu" karışmasın
    var i = 0, j = 0, fark = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++fark > 1) return false;
      if (a.length > b.length) i++;
      else if (a.length < b.length) j++;
      else { i++; j++; }
    }
    return fark + (a.length - i) + (b.length - j) <= 1;
  }

  /* ---------------- arama motoru (TF-IDF) ---------------- */
  // Her konu bir "belge"; anahtar kelimeler ve cevap metni indekslenir.
  // Nadir kelimeler yüksek puan alır: "kamera" ayırt edicidir, "bir" değildir.
  var INDEX = [], IDF = {}, N = 0;

  function indeksle() {
    INDEX = []; IDF = {};
    var df = {};
    KB.forEach(function (item) {
      var agir = {};   // kelime -> ağırlık
      function ekle(text, w) {
        var tks = jetonla(text);
        // Çok kelimeli kalıpta tek kelime tek başına tam puan kazanmamalı:
        // "mevcut sistemi devral" içindeki "sistem" başlı başına ayırt edici değil.
        var kelimeSayisi = norm(text).split(' ').filter(function (x) { return x.length > 1; }).length;
        var pay = kelimeSayisi > 1 ? Math.max(2, w / kelimeSayisi) : w;
        var gorulen = {};
        tks.forEach(function (tk) {
          // aynı kelimenin gövdesi ve ham hâli iki kez tam puan yazmasın
          var kat = gorulen[tk] ? 0.25 : 1;
          gorulen[tk] = 1;
          agir[tk] = (agir[tk] || 0) + pay * kat;
        });
      }
      (item.k || []).forEach(function (x) { ekle(x, 6); });   // anahtar kelime: en değerli
      (item.ke || []).forEach(function (x) { ekle(x, 6); });
      ekle(item.a.tr, 1);                                      // cevap metni: geniş kapsam
      ekle(item.a.en, 1);
      (item.l || []).forEach(function (x) { ekle(x.t.tr, 2); });
      if (item.konu) ekle(item.konu, 4);

      INDEX.push({ item: item, agir: agir });
      Object.keys(agir).forEach(function (tk) { df[tk] = (df[tk] || 0) + 1; });
    });
    N = INDEX.length;
    Object.keys(df).forEach(function (tk) {
      IDF[tk] = Math.log(1 + N / df[tk]);
    });
  }
  indeksle();


  // Tamamı genel kelimelerden oluşan sorular jetonlamadan sonra boş kalır
  // ("ne iş yapıyorsunuz" -> hepsi gürültü). Bunları kalıpla yakalıyoruz.
  var KALIPLAR = [
    { p: ['ne is yapiyorsunuz', 'ne yapiyorsunuz', 'neler yapiyorsunuz', 'ne is yapiyor',
          'hangi isleri', 'ne isle ugrasiyorsunuz', 'what do you do'], id: 'hizmet' },
    { p: ['nasilsiniz', 'nasilsin', 'how are you'], id: 'selam' },
    { p: ['ne kadar', 'how much'], id: 'teklif' }
  ];
  function kalipBul(text) {
    var q = norm(text);
    for (var i = 0; i < KALIPLAR.length; i++) {
      for (var j = 0; j < KALIPLAR[i].p.length; j++) {
        if (q.indexOf(KALIPLAR[i].p[j]) > -1) {
          for (var k = 0; k < KB.length; k++) if (KB[k].id === KALIPLAR[i].id) return KB[k];
        }
      }
    }
    return null;
  }

  // İki konunun ne kadar örtüştüğünü indeksten hesaplar.
  // Elle "şuna benzer" listesi yazmaya gerek kalmaz.
  function benzerler(item, adet) {
    var kaynak = null;
    INDEX.forEach(function (d) { if (d.item.id === item.id) kaynak = d; });
    if (!kaynak) return [];
    var puanlar = [];
    INDEX.forEach(function (d) {
      if (d.item.id === item.id) return;
      // şemsiye ve sohbet konuları öneri olarak anlamsız
      if (['selam', 'tesekkur', 'hizmet', 'sss'].indexOf(d.item.id) > -1) return;
      var p = 0;
      Object.keys(kaynak.agir).forEach(function (tk) {
        if (d.agir[tk]) p += Math.min(kaynak.agir[tk], d.agir[tk]) * (IDF[tk] || 1);
      });
      if (p > 0) puanlar.push({ item: d.item, p: p });
    });
    puanlar.sort(function (a, b) { return b.p - a.p; });
    return puanlar.slice(0, adet || 2).map(function (x) { return x.item; });
  }

  // Aciliyet sezgisi: sistem durmuşsa cevabın başına hızlı yol koyulur.
  var ACIL = ['acil', 'durdu', 'calismiyor', 'bozuk', 'coktu', 'kapandi', 'erisemiyoruz',
              'giremiyoruz', 'hemen', 'simdi', 'down', 'urgent', 'asap'];
  function acilMi(text) {
    var q = ' ' + norm(text) + ' ';
    for (var i = 0; i < ACIL.length; i++) if (q.indexOf(' ' + ACIL[i]) > -1) return true;
    return false;
  }

  // Cevaplanamayan sorular tarayıcıda birikir; bilgi bankasını
  // büyütmek için konsola "dnyAsistanSorular()" yazmak yeterli.
  function kaydetBulunamadi(text) {
    try {
      var k = 'dny-asistan-bulunamadi';
      var arr = JSON.parse(localStorage.getItem(k) || '[]');
      arr.push({ q: text, t: new Date().toISOString().slice(0, 16) });
      localStorage.setItem(k, JSON.stringify(arr.slice(-60)));
    } catch (e) {}
  }
  window.dnyAsistanSorular = function () {
    try { return JSON.parse(localStorage.getItem('dny-asistan-bulunamadi') || '[]'); }
    catch (e) { return []; }
  };

  // Bağlam: son konuşulan konu. "peki fiyatı?" gibi eksik cümleleri çözer.
  var sonKonu = null;

  function puanla(text) {
    var q = jetonla(text);
    if (!q.length) return [];
    var sonuc = [];

    INDEX.forEach(function (doc) {
      var p = 0, anahtarIsabeti = false;
      q.forEach(function (tk) {
        var w = doc.agir[tk];
        if (!w) {
          // birebir yoksa yazım hatası ihtimalini dene
          var keys = Object.keys(doc.agir);
          for (var i = 0; i < keys.length; i++) {
            if (yakin(tk, keys[i])) { w = doc.agir[keys[i]] * 0.85; break; }
          }
        }
        if (w) {
          if (w >= 3) anahtarIsabeti = true;   // cevap metnindeki tesadüfi kelime yetmez
          p += w * (IDF[tk] || 1);
        }
      });
      // Yalnızca cevap metninde geçen kelimelerle eşleşme sayılmaz:
      // "kedi maması" adres metnindeki bir kelimeye benzeyip puan almasın.
      if (p > 0 && anahtarIsabeti) sonuc.push({ item: doc.item, p: p });
    });

    sonuc.sort(function (a, b) { return b.p - a.p; });
    return sonuc;
  }

  // Kısa/eksik soru + önceki konu varsa bağlamı kullan
  function match(text) {
    var s = puanla(text);
    var kelime = norm(text).split(' ').filter(function (x) { return x.length > 1; });

    // Bağlam devri: "peki fiyatı?" gibi 1-2 kelimelik takip sorularında.
    // Uzun ve alakasız cümlelerde devreye girmemeli.
    var anlamli = jetonla(text).length;
    if ((!s.length || s[0].p < 4) && sonKonu && anlamli <= 3 && kelime.length <= 3) {
      var ek = puanla(text + ' ' + sonKonu.a.tr.slice(0, 90));
      if (ek.length && ek[0].p >= 4) s = ek;
    }
    if (!s.length || s[0].p < 3.2) {
      var kal = kalipBul(text);          // "ne iş yapıyorsunuz" gibi kalıplar
      if (kal) { sonKonu = kal; return { tip: 'tek', item: kal }; }
      return { tip: 'yok' };
    }

    // İlk iki aday birbirine çok yakınsa tahmin etme, sor
    if (s.length > 1 && s[1].p > s[0].p * 0.76 && s[0].item.id !== s[1].item.id) {
      return { tip: 'belirsiz', a: s[0].item, b: s[1].item };
    }
    sonKonu = s[0].item;
    return { tip: 'tek', item: s[0].item };
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
    if (typeof sohbetKaydet === 'function') sohbetKaydet();
    return d;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var artArda = 0;

  function answer(item, acil) {
    var L = lang();
    if (!item) return bubble(esc(UI.nomatch[L]), 'bot');

    var html = '';
    if (acil) html += '<b class="asst__urgent">' + esc(UI.urgent[L]) + '</b>';
    html += esc(item.a[L]);

    var links = (item.l || []).slice();
    if (item.konu) {
      links.push({ t: UI.quote, h: 'iletisim.html?konu=' + encodeURIComponent(item.konu) });
    }
    if (acil) links.unshift({ t: { tr: 'Hemen yazın', en: 'Write now' }, h: 'mailto:' + MAIL });
    if (links.length) {
      html += '<span class="asst__links">' + links.map(function (x) {
        return '<a href="' + x.h + '">' + esc(x.t[L]) + '</a>';
      }).join('') + '</span>';
    }
    var el = bubble(html, 'bot');

    // ilgili konular: sohbeti sürdürmesi için
    var ilg = benzerler(item, 2);
    if (ilg.length) {
      var r = document.createElement('div');
      r.className = 'asst__rel';
      r.innerHTML = '<span>' + esc(UI.related[L]) + '</span>';
      ilg.forEach(function (x) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = x.a[L].split('.')[0].slice(0, 46) + '…';
        b.addEventListener('click', function () {
          bubble(esc(b.textContent), 'me');
          sonKonu = x;
          think({ tip: 'tek', item: x });
        });
        r.appendChild(b);
      });
      log.appendChild(r);
      log.scrollTop = log.scrollHeight;
    }
    return el;
  }

  function secenek(a, b) {
    var L = lang();
    var html = esc(UI.which[L]) + '<span class="asst__links">' +
      '<a href="#" data-pick="' + a.id + '">' + esc(a.a[L].split('.')[0].slice(0, 42)) + '…</a>' +
      '<a href="#" data-pick="' + b.id + '">' + esc(b.a[L].split('.')[0].slice(0, 42)) + '…</a>' +
      '</span>';
    var el = bubble(html, 'bot');
    $$('a[data-pick]', el).forEach(function (x) {
      x.addEventListener('click', function (e) {
        e.preventDefault();
        var id = x.getAttribute('data-pick');
        KB.forEach(function (k) { if (k.id === id) { sonKonu = k; answer(k); } });
      });
    });
  }

  function think(res) {
    var dots = bubble('<span class="asst__typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(function () {
      dots.remove();
      if (res.tip === 'belirsiz') { artArda = 0; secenek(res.a, res.b); return; }
      if (res.tip === 'yok') {
        artArda++;
        kaydetBulunamadi(res.q || '');
        answer(null);
        if (artArda >= 2) {
          var L = lang();
          bubble(esc(UI.human[L]) + '<span class="asst__links">' +
            '<a href="mailto:' + MAIL + '">' + esc(UI.mailBtn[L]) + '</a>' +
            '<a href="iletisim.html">' + esc(UI.formBtn[L]) + '</a></span>', 'bot');
          artArda = 0;
        }
        return;
      }
      artArda = 0;
      answer(res.item, res.acil);
    }, 380);
  }

  function renderChips() {
    var L = lang();
    chipBox.innerHTML = '';
    var liste = (SAYFA_ONERI[sayfaAdi()] || []).concat(CHIPS).slice(0, 4);
    liste.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = c[L];
      b.addEventListener('click', function () { ask(c[L]); });
      chipBox.appendChild(b);
    });
  }

  function ask(text) {
    bubble(esc(text), 'me');
    oneriTemizle();
    if (sihirbazAktif) { sihirbazCevap(text); return; }
    var res = match(text);
    res.q = text;
    res.acil = acilMi(text);
    // "teklif" konusu geldiyse doğrudan sihirbazı başlat: soru sormak
    // düz cevaptan daha çok işe yarar
    if (res.tip === 'tek' && res.item.id === 'teklif') { think(res); setTimeout(sihirbazBasla, 900); return; }
    think(res);
  }

  /* ---------------- teklif sihirbazı ---------------- */
  // Üç kısa soruyla ihtiyacı netleştirip formu önceden doldurur.
  var sihirbazAktif = false, sihirbazAdim = 0, sihirbazVeri = {};
  var SIHIRBAZ = [
    { anahtar: 'konu', soru: 'wizQ1', secenekler: [
      { tr: 'Ağ ve kablolama', en: 'Network and cabling' },
      { tr: 'Güvenlik çözümleri', en: 'Security solutions' },
      { tr: 'Donanım ve sistem kurulumu', en: 'Hardware and system installation' },
      { tr: 'Teknik destek ve bakım', en: 'Technical support and maintenance' },
      { tr: 'Web tasarım ve yazılım', en: 'Web design and software' },
      { tr: 'Yedekleme ve iş sürekliliği', en: 'Backup and business continuity' }
    ]},
    { anahtar: 'buyukluk', soru: 'wizQ2', secenekler: [
      { tr: '1-10 kişi', en: '1-10 people' },
      { tr: '10-50 kişi', en: '10-50 people' },
      { tr: '50 kişiden fazla', en: 'More than 50 people' }
    ]},
    { anahtar: 'aciliyet', soru: 'wizQ3', secenekler: [
      { tr: 'Acil, sistem durdu', en: 'Urgent, the system is down' },
      { tr: 'Bu ay içinde', en: 'Within this month' },
      { tr: 'Planlama aşamasında', en: 'Still planning' }
    ]}
  ];

  function sihirbazBasla() {
    sihirbazAktif = true; sihirbazAdim = 0; sihirbazVeri = {};
    bubble(esc(UI.wizStart[lang()]), 'bot');
    sihirbazSor();
  }

  function sihirbazSor() {
    var L = lang(), adim = SIHIRBAZ[sihirbazAdim];
    var el = bubble(esc(UI[adim.soru][L]), 'bot');
    var r = document.createElement('div');
    r.className = 'asst__rel is-wiz';
    adim.secenekler.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = o[L];
      b.addEventListener('click', function () { sihirbazCevap(o[L], o.tr); });
      r.appendChild(b);
    });
    log.appendChild(r);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function sihirbazCevap(gorunen, trDeger) {
    bubble(esc(gorunen), 'me');
    sihirbazVeri[SIHIRBAZ[sihirbazAdim].anahtar] = trDeger || gorunen;
    sihirbazAdim++;
    if (sihirbazAdim < SIHIRBAZ.length) { setTimeout(sihirbazSor, 260); return; }

    sihirbazAktif = false;
    var L = lang();
    var konu = sihirbazVeri.konu || 'Genel bilgi';
    var govde = 'Teklif talebi\n' +
      'Konu: ' + konu + '\n' +
      'Kurum büyüklüğü: ' + (sihirbazVeri.buyukluk || '-') + '\n' +
      'Aciliyet: ' + (sihirbazVeri.aciliyet || '-') + '\n\n' +
      'Ad soyad:\nKurum:\nTelefon:\n';
    var formUrl = 'iletisim.html?konu=' + encodeURIComponent(konu);
    var mailUrl = 'mailto:' + MAIL + '?subject=' +
      encodeURIComponent('Teklif talebi — ' + konu) + '&body=' + encodeURIComponent(govde);

    setTimeout(function () {
      bubble(esc(UI.wizDone[L]) +
        '<span class="asst__links">' +
        '<a href="' + formUrl + '">' + esc(UI.wizForm[L]) + '</a>' +
        '<a href="' + mailUrl + '">' + esc(UI.wizMail[L]) + '</a>' +
        '</span>', 'bot');
    }, 300);
  }

  /* ---- yazarken canlı öneri ---- */
  var oneriBox = document.createElement('div');
  oneriBox.className = 'asst__sugg';
  form.parentNode.insertBefore(oneriBox, form);

  function oneriTemizle() { oneriBox.innerHTML = ''; oneriBox.classList.remove('is-on'); }

  input.addEventListener('input', function () {
    var v = input.value.trim();
    if (v.length < 3) return oneriTemizle();
    var L = lang();
    var s = puanla(v).slice(0, 3).filter(function (x) { return x.p > 4; });
    if (!s.length) return oneriTemizle();
    oneriBox.innerHTML = '';
    s.forEach(function (x) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = x.item.a[L].split('.')[0].slice(0, 52) + '…';
      b.addEventListener('click', function () {
        oneriTemizle();
        input.value = '';
        bubble(esc(b.textContent), 'me');
        sonKonu = x.item;
        think({ tip: 'tek', item: x.item });
      });
      oneriBox.appendChild(b);
    });
    oneriBox.classList.add('is-on');
  });

  // Bulunduğu sayfaya göre farklı öneri sunar
  var SAYFA_ONERI = {
    'hizmetler': [{ tr: 'Hangi hizmet bize uygun?', en: 'Which service fits us?' },
                  { tr: 'Teklif almak istiyorum', en: 'I would like a quote' }],
    'uzaktan-destek': [{ tr: 'Uzaktan bağlantı güvenli mi?', en: 'Is remote access secure?' },
                       { tr: 'Hangi programı indirmeliyim?', en: 'Which program should I download?' }],
    'gerekli-yazilimlar': [{ tr: 'QuickSupport mu Host mu?', en: 'QuickSupport or Host?' },
                           { tr: 'Kurulumdan sonra ne yapmalıyım?', en: 'What do I do after installing?' }],
    'referanslar': [{ tr: 'Bizim sektörde çalıştınız mı?', en: 'Have you worked in our sector?' },
                    { tr: 'Kaç yıldır bu işi yapıyorsunuz?', en: 'How long have you been doing this?' }],
    'sss': [{ tr: 'Sözleşme zorunlu mu?', en: 'Is a contract required?' },
            { tr: 'Ne kadar sürede müdahale ediyorsunuz?', en: 'How fast do you respond?' }],
    'iletisim': [{ tr: 'Teklif almak istiyorum', en: 'I would like a quote' },
                 { tr: 'Çalışma saatleriniz nedir?', en: 'What are your opening hours?' }]
  };
  function sayfaAdi() {
    var f = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    return f || 'index';
  }

  var HAFIZA = 'dny-asistan-sohbet';
  function sohbetKaydet() {
    try {
      var msgs = $$('.asst__msg', log).map(function (m) {
        return { h: m.innerHTML, w: m.classList.contains('is-me') ? 'me' : 'bot' };
      });
      sessionStorage.setItem(HAFIZA, JSON.stringify(msgs.slice(-24)));
    } catch (e) {}
  }
  function sohbetYukle() {
    try {
      var msgs = JSON.parse(sessionStorage.getItem(HAFIZA) || '[]');
      if (!msgs.length) return false;
      msgs.forEach(function (m) { bubble(m.h, m.w); });
      return true;
    } catch (e) { return false; }
  }

  function open() {
    panel.hidden = false;
    root.classList.add('is-open');
    fab.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      // Önceki sayfadaki sohbet varsa kaldığı yerden devam eder
      if (!sohbetYukle()) bubble(esc(UI.hello[lang()]), 'bot');
    }
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
