
SİTE ASİSTANI (sağ alt köşe)
----------------------------
assets/assistant.js — yapay zekâ KULLANMAZ. Dışarıya istek
atmaz, API anahtarı istemez, ücret doğurmaz. Ziyaretçinin
yazdığı cümledeki anahtar kelimeleri dosyanın başındaki bilgi
tabanıyla eşleştirip hazır cevabı verir. Anlamadığında bunu
dürüstçe söyler ve destek@dny.com.tr adresine yönlendirir.

Yeni konu eklemek için KB dizisine bir nesne ekleyin:
  k   : Türkçe anahtar kelimeler (küçük harf, şapkasız)
  ke  : İngilizce anahtar kelimeler
  a   : cevap { tr: "...", en: "..." }
  l   : bağlantılar [{ t:{tr,en}, h:"sayfa.html" }]
  konu: (varsa) teklif formunda seçili gelecek hizmet adı

Eşleştirme kelime sınırına saygılıdır: "sistemi" içindeki "is"
gibi tesadüfi parçalar puan almaz, "hizmetleriniz" gibi ek almış
kelimeler kelime başından yakalanır. Türkçe ve İngilizce aynı
anda çalışır; site dili değişince asistan da değişir.

ARKA PLAN ÇEŞİTLERİ
-------------------
Her <canvas class="aurora"> öğesi data-bg özniteliğiyle mod seçer:
  (yok)          3B nokta bulutu — döner, perspektifli, imleç kamerayı eğer
  data-bg="flat" 2B etkileşimli ağ — ilk sürümdeki düz ağ, imlece esner
  data-bg="wave" WebGL dalga şeridi — assets/shader-bg.js, marka renkli
data-signal eklenirse alt kenarda ilerleyen sinyal hattı da çizilir.

Şu anki dağılım:
  ana sayfa hero .............. 3B bulut + sinyal
  alt sayfa başlıkları ........ 3B bulut + sinyal
  iletişim sayfası başlığı .... 2B ağ + sinyal
  tüm CTA bantları ............ 2B ağ
  SSS sayfası başlığı ......... WebGL dalga
WebGL desteklenmiyorsa dalga otomatik olarak 2B ağa döner.

SIKÇA SORULAN SORULAR
---------------------
sss.html — 12 soruluk akordiyon. Sorular sayfanın içinde HTML
olarak durur; İngilizceleri assets/i18n.js içindedir.
Sayfada FAQPage yapısal verisi (JSON-LD) da var: Google arama
sonuçlarında soruları açılır liste olarak gösterebilir.
Yeni soru eklerken JSON-LD bloğuna da eklemeyi unutmayın.

SIVI CAM BUTON
--------------
.btn--glass sınıfı (ana sayfadaki "Hizmetlerimiz" butonunda).
Gönderilen liquid-glass bileşeninden uyarlandı. Firefox'ta SVG
bozulma filtresi de çalışır; Chrome backdrop-filter:url()
desteklemediği için orada yalnız bulanıklık ve gölge katmanı
görünür — buton yine cam gibi durur, bozulmaz.

İZLEME AJANI (ajan/ klasörü)
----------------------------
Sistem durumu paneli artık 'auto' modunda çalışıyor:
  1. Sayfa açılınca sitenin kökünde durum.json aranır.
  2. Dosya varsa panel GERÇEK sunucu verilerini gösterir
     (iç ağdaki sunucular, 1-5 ms LAN ping değerleriyle).
  3. Dosya yoksa tarayıcı ölçümüne düşer (mevcut davranış).

ajan/ klasöründe durum.json'u üretecek hazır scriptler var:
  durum-ajan.sh    Linux / macOS  — cron ile
  durum-ajan.ps1   Windows        — Görev Zamanlayıcı ile
  OKUBENI.txt      kurulum adımları

Ajanı kurup durum.json üretmeye başladığınız an site
kendiliğinden gerçek veriye geçer. Sitede hiçbir dosyayı
değiştirmeniz gerekmez.

durum.json herkese açık bir dosyadır: içine IP, hostname veya
iç ağ bilgisi yazmayın. Sadece etiket ve süre yeterlidir.

YASAL SAYFALAR VE KVKK
----------------------
  gizlilik.html   Gizlilik politikası + KVKK aydınlatma metni
  cerez.html      Çerez ve tarayıcı depolama politikası

!!! DOLDURULMASI GEREKEN ALANLAR !!!
gizlilik.html içinde sarı zeminle işaretli yerler var. Yayına
almadan önce bunlar doldurulmalıdır:
  - Hosting firmasının adı ve sunucuların bulunduğu ülke
  - Sunucu erişim kayıtlarının saklama süresi
  - Metnin son güncelleme tarihi

Sarı işaretli alanları bulmak için dosyada "doldur" sınıfını
arayın. Doldurduktan sonra <span class="doldur"> etiketini de
kaldırın, sarı vurgu kalkar.

BU METİNLER HUKUKİ DANIŞMANLIK DEĞİLDİR. Sitenin gerçek veri
akışına göre yazılmıştır ancak yayına almadan önce bir avukata
veya mali müşavire okutulması önerilir.

Yasal sayfalar yalnızca Türkçedir. Bağlayıcı metnin Türkçe
olduğu, İngilizce görünümde sayfanın başında belirtilir.

ÜÇÜNCÜ TARAF İSTEKLERİ
----------------------
Sitede takip çerezi, reklam pikseli veya analitik yazılım yoktur.
Dışarıya giden iki istek vardır:

1) GOOGLE MAPS — ÇÖZÜLDÜ
   İletişim sayfasındaki harita artık kendiliğinden yüklenmiyor.
   Ziyaretçi "Haritayı yükle" düğmesine basmadan Google'a hiçbir
   istek gitmez. Onay, yalnızca o sekme açık kaldığı sürece
   hatırlanır (sessionStorage: dny-harita).

2) GOOGLE FONTS — HÂLÂ AÇIK
   Yazı tipleri her sayfada Google sunucularından yükleniyor ve
   bu sırada ziyaretçinin IP adresi Google'a iletiliyor. KVKK ve
   GDPR açısından yurt dışına veri aktarımı sayılır.

   Kalıcı çözüm yazı tiplerini kendi sunucunuza taşımaktır:
     a) fonts.google.com adresinden Instrument Sans ve
        Instrument Serif ailelerini indirin (woff2 tercih edin).
     b) Dosyaları assets/fonts/ klasörüne koyun.
     c) HTML'lerdeki <link href="https://fonts.googleapis.com...">
        satırını silin.
     d) style.css başına @font-face tanımlarını ekleyin.
   Bu yapıldığında sitenin dışarıya hiçbir isteği kalmaz ve
   çerez/onay bandına hiç gerek olmaz.
