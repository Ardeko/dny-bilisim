/* =========================================================
   DNY Bilişim — canlı durum paneli yapılandırması
   ---------------------------------------------------------
   ÖNEMLİ: Bu panel UYDURMA DEĞER GÖSTERMEZ. Ekranda ne
   görünüyorsa gerçekten ölçülmüş veridir. Ölçüm kaynağı
   aşağıdaki "mode" ayarıyla belirlenir.

   mode: 'probe'
     Ziyaretçinin tarayıcısı, listelenen adreslere gerçek bir
     istek atar ve gidiş-dönüş süresini ölçer. Kurulum
     gerektirmez, hemen çalışır. Ölçüm ziyaretçinin kendi
     internet bağlantısını da içerir; panelin altında bu
     dürüstçe yazar.

   mode: 'uptimerobot'
     UptimeRobot hesabınızdaki gerçek izleme verisi gösterilir
     (monitörün adı, ayakta olup olmadığı, ortalama yanıt
     süresi). Kurulum:
       1. uptimerobot.com'da ücretsiz hesap açın.
       2. İzlemek istediğiniz sunucuları monitör olarak ekleyin.
       3. My Settings > API > "Read-Only API Key" oluşturun.
       4. Anahtarı aşağıdaki uptimeRobotKey alanına yazın ve
          mode değerini 'uptimerobot' yapın.
     Salt-okunur anahtar sadece monitör durumunu okur, hesapta
     değişiklik yapamaz; bu yüzden sitede durması sakıncasızdır.

   mode: 'json'
     Kendi sunucunuzdaki bir adresten JSON çeker. Beklenen biçim:
       [{"label":"Sunucu-01","up":true,"ms":12}, ...]
     Bir PHP dosyası bu JSON'u üretebilir.

   mode: 'off'
     Panel tamamen gizlenir.
   ========================================================= */
window.DNY_STATUS = {

  mode: 'probe',

  // mode:'probe' için ölçülecek adresler.
  // Buraya gerçekten sizin işlettiğiniz, dışarıya açık adresleri yazın.
  probes: [
    { label: 'Web sunucusu', url: 'assets/favicon.svg' }
    // Örnekler — kendi adreslerinizle değiştirin:
    // { label: 'Posta sunucusu', url: 'https://mail.dny.com.tr/favicon.ico' },
    // { label: 'Müşteri portalı', url: 'https://portal.dny.com.tr/favicon.ico' }
  ],

  uptimeRobotKey: '',   // mode:'uptimerobot' ise salt-okunur anahtar
  jsonUrl: '',          // mode:'json' ise JSON adresi

  interval: 25000       // yenileme aralığı (milisaniye)
};
