
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

coded by Ardeko