#!/usr/bin/env bash
# =========================================================
# DNY Bilişim — izleme ajanı (Linux / macOS)
# ---------------------------------------------------------
# Listelenen sunuculara GERÇEK ping atar, sonucu durum.json
# olarak yazar. Web sitesi bu dosyayı okuyup panelde gösterir.
#
# KURULUM
#   1) Bu dosyayı iç ağınızdaki bir makineye kopyalayın
#      (ping'in LAN üzerinden gitmesi için ağın içinde olmalı).
#   2) Çalıştırma izni verin:   chmod +x durum-ajan.sh
#   3) Aşağıdaki SUNUCULAR listesini kendi sunucularınızla doldurun.
#   4) HEDEF değişkenini ayarlayın (aşağıdaki iki seçenekten biri).
#   5) crontab -e ile 1 dakikada bir çalıştırın:
#        * * * * * /opt/dny/durum-ajan.sh >/dev/null 2>&1
#
# ÖNEMLİ: Sol taraftaki ETİKET dışarıya gider, IP GİTMEZ.
# Ziyaretçi "Posta sunucusu · aktif · 2 ms" görür; adresi görmez.
# =========================================================

# --- 1) İzlenecek sunucular:  "Etiket|adres" ---
SUNUCULAR=(
  "Dosya sunucusu|192.168.1.10"
  "Posta sunucusu|192.168.1.11"
  "Yedekleme ünitesi|192.168.1.12"
  "Güvenlik duvarı|192.168.1.1"
  "Web sunucusu|dny.com.tr"
)

# --- 2) Çıktının yazılacağı yer ---
# Seçenek A: ajan doğrudan web sunucusunda çalışıyorsa
HEDEF="/var/www/html/durum.json"

# Seçenek B: ajan iç ağda, site başka yerde barınıyorsa
#   önce geçici dosyaya yaz, sonra yükle (aşağıdaki YUKLE bloğunu açın)
# HEDEF="/tmp/durum.json"

PING_SAYISI=2      # her sunucuya kaç paket
ZAMAN_ASIMI=2      # saniye

# =========================================================
tmp="$(mktemp)"
printf '[\n' > "$tmp"
ilk=1

for kayit in "${SUNUCULAR[@]}"; do
  etiket="${kayit%%|*}"
  adres="${kayit##*|}"

  # ping çıktısından ortalama süreyi al
  if cikti="$(ping -c "$PING_SAYISI" -W "$ZAMAN_ASIMI" "$adres" 2>/dev/null)"; then
    # "rtt min/avg/max/mdev = 0.4/0.9/1.4/0.3 ms" -> 5. alan ortalamadır
    ort="$(printf '%s' "$cikti" | awk -F'/' '/^(rtt|round-trip)/ {print $5}')"
    ms="$(LC_ALL=C printf '%.0f' "${ort:-0}" 2>/dev/null || echo 0)"
    if [ -z "$ms" ] || [ "$ms" -lt 1 ] 2>/dev/null; then ms=1; fi   # 1 ms altı 1 yazılır
    up="true"
  else
    ms="null"
    up="false"
  fi

  [ $ilk -eq 0 ] && printf ',\n' >> "$tmp"
  ilk=0
  if [ "$up" = "true" ]; then
    printf '  {"label":"%s","up":true,"ms":%s}' "$etiket" "$ms" >> "$tmp"
  else
    printf '  {"label":"%s","up":false,"ms":null}' "$etiket" >> "$tmp"
  fi
done

printf '\n]\n' >> "$tmp"

# geçici dosyadan taşı: site hiçbir zaman yarım dosya okumaz
mv -f "$tmp" "$HEDEF"
chmod 644 "$HEDEF"

# --- Seçenek B kullanılıyorsa yükleme bloğu ---
# SCP ile:
#   scp -q "$HEDEF" kullanici@sunucu:/var/www/html/durum.json
# FTP ile (lftp kurulu olmalı):
#   lftp -u KULLANICI,SIFRE ftp.dny.com.tr -e "put $HEDEF -o /public_html/durum.json; bye"
