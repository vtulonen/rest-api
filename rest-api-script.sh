#!/bin/sh
#
## Perustiedot:
# - Tuni-mail: vili.tulonen@tuni.fi
# - kuvaus: backend -kanta taidetoksille, sis. taulut museoille, taiteilijoille ja teoksille
# - Tekninen toteutus: Node.js (koa.js) + MySQL
#
# API-kuvaus:
#
# Pöydät = kohteet = museums, artists, artworks
#   - Kohteen lisäys: POST/<kohde>
#   - Kohteen  poisto: DELETE /<kohde>/:id
#   - Kohten päivitys: PUT /<kohde>/:id
#   - Kohteen kaikkien tietojen tarkastelu: GET /<kohde>
#   - Kohteen tietyn id:n omaavan objektin tarkastelu GET /<kohde>/:id (esim taiteilija)
#   - Taiteilijan kaikkien teosten haku: GET /artists/:id/artworks
#   - Kaikkien museossa sijaitsevien teosten haku: GET /museums/:id/artworks
#
# Tekniset vaatimukset:
#
#
#
#
#
# Konfiguraatio:
#
#
#
#===============================================================

echo; echo " ----------- Viedään kantaan dataa:"
curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "National Gallery", "country" : "Iso-Britannia", "city" : "Lontoo" }' \
http://localhost:9000/api/v1/museums

echo; echo " ----------- Tehdään hakuja:"
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/museums"
