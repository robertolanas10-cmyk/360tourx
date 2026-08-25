#!/usr/bin/env bash
# Verifica los 20 registros DNS de 360tourx.com contra un servidor concreto.
# Uso:  bash verificar-dns.sh [servidor]
#   servidor por defecto 8.8.8.8 (vista publica, tras propagar)
#   para probar la zona de GoDaddy ANTES de girar los NS: bash verificar-dns.sh ns23.domaincontrol.com
SRV="${1:-8.8.8.8}"
D=360tourx.com
ok=0; bad=0

chk() { # tipo  nombre  valor_esperado(substring)  etiqueta
  local t="$1" n="$2" exp="$3" lbl="$4" out
  out=$(nslookup -type="$t" "$n" "$SRV" 2>/dev/null | tr -d '\r' | tail -n +4)
  if echo "$out" | grep -qi -- "$exp"; then
    printf '  OK   %-42s %s\n' "$lbl" "$exp"; ok=$((ok+1))
  else
    printf '  FALLA %-42s esperaba: %s\n' "$lbl" "$exp"; bad=$((bad+1))
    echo "$out" | sed 's/^/         /' | grep -v '^ *$' | head -4
  fi
}

echo "=== Verificando 360tourx.com contra $SRV ==="
echo "-- WEB (Netlify) --"
chk A     "$D"                          "75.2.60.5"                                  "A @"
chk CNAME "www.$D"                      "marvelous-strudel-c5659a.netlify.app"       "CNAME www"

echo "-- TOURS DE CLIENTES (no perder) --"
for s in alocos copatlifemadrid delphinamadrid; do
  chk A "$s.$D" "92.205.150.148" "A $s"
done

echo "-- CORREO Microsoft 365 (critico) --"
chk MX  "$D" "360tourx-com.mail.protection.outlook.com" "MX @"
chk TXT "$D" "v=spf1 include:spf.protection.outlook.com" "TXT SPF"
chk TXT "$D" "MS=ms16695466"                             "TXT verificacion MS"
chk CNAME "autodiscover.$D"            "autodiscover.outlook.com"                    "CNAME autodiscover"
chk CNAME "email.$D"                   "email.secureserver.net"                      "CNAME email"
chk CNAME "enterpriseenrollment.$D"    "enterpriseenrollment.manage.microsoft.com"   "CNAME enterpriseenrollment"
chk CNAME "enterpriseregistration.$D"  "enterpriseregistration.windows.net"          "CNAME enterpriseregistration"
chk CNAME "lyncdiscover.$D"            "webdir.online.lync.com"                      "CNAME lyncdiscover"
chk CNAME "sip.$D"                     "sipdir.online.lync.com"                      "CNAME sip"
chk SRV   "_sipfederationtls._tcp.$D"  "sipfed.online.lync.com"                      "SRV _sipfederationtls._tcp"
chk SRV   "_sip._tls.$D"               "sipdir.online.lync.com"                      "SRV _sip._tls"

echo "-- VALIDACION SSL Sectigo (renovacion, no urgente) --"
chk CNAME "_1e10c3644ef3bf1900c140cddc1f01ad.$D" \
  "a06cce0de0ad628d174206d693115d74.bd64a38124f936930555d04071ad5909.69020cb011cf9.comodoca.com" "CNAME _1e10c364..."
chk CNAME "_b8f5a2c60d642c3ac03486725bf60c9b.$D" \
  "6dbe4289e905f000bca9df357673388a.da7ff7bd7486cbe81a1cf00b3c3c54f5.6913a970e579c.comodoca.com" "CNAME _b8f5a2c6..."
chk CNAME "_f7da38f2f0404fd15d9648d40ab933ac.$D" \
  "f496bb2c0c051c298ba76ff4df6a3270.23159197c76a160f2d48673233d6680b.691cb19231f8b.comodoca.com" "CNAME _f7da38f2..."
chk CNAME "_20b78a696a14f77daec62d876500bd4e.alocos.$D" \
  "8d239a05a5aaecebb13895084766a4d1.3a5c033412b73133ad28297bf3cf1764.750f7b954cbedda.comodoca.com" "CNAME _20b78a69....alocos"

echo
echo "=== RESULTADO: $ok correctos, $bad fallan (de 20) ==="
echo "-- Nameservers actuales (informativo) --"
nslookup -type=NS "$D" "$SRV" 2>/dev/null | tr -d '\r' | grep -i nameserver | sed 's/^/  /'
