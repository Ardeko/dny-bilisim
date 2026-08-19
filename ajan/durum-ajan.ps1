# =========================================================
# DNY Bilişim — izleme ajanı (Windows / PowerShell)
# ---------------------------------------------------------
# Listelenen sunuculara GERÇEK ping atar, sonucu durum.json
# olarak yazar. Web sitesi bu dosyayı okuyup panelde gösterir.
#
# KURULUM
#   1) Bu dosyayı iç ağdaki bir Windows makineye kopyalayın
#      (ping'in LAN üzerinden gitmesi için ağın içinde olmalı).
#   2) $Sunucular listesini kendi sunucularınızla doldurun.
#   3) $Hedef yolunu ayarlayın.
#   4) Görev Zamanlayıcı'da 1 dakikada bir çalışacak görev açın:
#        Program : powershell.exe
#        Argüman : -ExecutionPolicy Bypass -File "C:\dny\durum-ajan.ps1"
#
# ÖNEMLİ: Sol taraftaki ETİKET dışarıya gider, IP GİTMEZ.
# Ziyaretçi "Posta sunucusu · aktif · 2 ms" görür; adresi görmez.
# =========================================================

# --- 1) İzlenecek sunucular ---
$Sunucular = @(
  @{ Etiket = 'Dosya sunucusu';     Adres = '192.168.1.10' },
  @{ Etiket = 'Posta sunucusu';     Adres = '192.168.1.11' },
  @{ Etiket = 'Yedekleme ünitesi';  Adres = '192.168.1.12' },
  @{ Etiket = 'Güvenlik duvarı';    Adres = '192.168.1.1'  },
  @{ Etiket = 'Web sunucusu';       Adres = 'dny.com.tr'   }
)

# --- 2) Çıktının yazılacağı yer ---
# Ajan doğrudan web sunucusunda çalışıyorsa:
$Hedef = 'C:\inetpub\wwwroot\durum.json'
# İç ağda çalışıp siteye yükleyecekseniz geçici yol kullanın:
# $Hedef = "$env:TEMP\durum.json"

$PingSayisi  = 2
$ZamanAsimi  = 2000   # milisaniye

# =========================================================
$Sonuc = foreach ($s in $Sunucular) {
  $ms = $null
  $up = $false
  try {
    $p = Test-Connection -ComputerName $s.Adres -Count $PingSayisi -ErrorAction Stop
    $ort = ($p | Measure-Object -Property ResponseTime -Average).Average
    $ms = [int][Math]::Max(1, [Math]::Round($ort))
    $up = $true
  } catch {
    $up = $false
  }

  if ($up) {
    [PSCustomObject]@{ label = $s.Etiket; up = $true;  ms = $ms }
  } else {
    [PSCustomObject]@{ label = $s.Etiket; up = $false; ms = $null }
  }
}

# geçici dosyaya yazıp taşı: site hiçbir zaman yarım dosya okumaz
$tmp = "$Hedef.tmp"
$Sonuc | ConvertTo-Json -Depth 3 | Out-File -FilePath $tmp -Encoding utf8 -Force
Move-Item -Path $tmp -Destination $Hedef -Force

# --- Siteye uzaktan yükleme (gerekliyse) ---
# WinSCP komut satırı ile:
#   & "C:\Program Files (x86)\WinSCP\WinSCP.com" /command `
#       "open ftp://KULLANICI:SIFRE@ftp.dny.com.tr" `
#       "put ""$Hedef"" /public_html/durum.json" "exit"
