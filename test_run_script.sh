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
echo;
echo; echo " ----------- Viedaan kantaan dataa, museoita:"

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "National Gallery", "country" : "Iso-Britannia", "city" : "Lontoo" }' \
http://localhost:9000/api/v1/museums 

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "Vapriikki", "country" : "Suomi", "city" : "Tampere" }' \
http://localhost:9000/api/v1/museums

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "Louvre", "country" : "Ranska", "city" : "Pariisi" }' \
http://localhost:9000/api/v1/museums
echo;
echo; echo " ----------- Viedaan kantaan dataa, taiteilijoita:"

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "firstName": "Kalle", "lastName" : "Maalari ", "nationality" : "Suomi" }' \
http://localhost:9000/api/v1/artists

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "firstName": "Leonard", "lastName" : "Davinci ", "nationality" : "Italia" }' \
http://localhost:9000/api/v1/artists
echo;
echo; echo " ----------- Muokataan asken lisattylle taiteilijalle oikeinkirjoitus nimiin:"

curl -i -X PUT \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "firstName": "Leonardo", "lastName" : "Da Vinci ", "nationality" : "Italia" }' \
http://localhost:9000/api/v1/artists/2

echo;
echo; echo " ----------- Lisataan taideteoksia:" 

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID" : 1, "artistID" : 2, "name" : "Trees", "yearMade" : 1700, "artStyle" : "Painting" , "subject": "Scenery" }' \
http://localhost:9000/api/v1/artworks 

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID" : 1, "artistID" : 2, "name" : "Mountains", "yearMade" : 1730, "artStyle" : "Painting" , "subject": "Scenery" }' \
http://localhost:9000/api/v1/artworks 

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID" : 1, "artistID" : 2, "name" : "Superman", "yearMade" : 1720, "artStyle" : "Scuplture" , "subject": "Portrait" }' \
http://localhost:9000/api/v1/artworks  

url -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID" : 2, "artistID" : 2, "name" : "Mona Lisa", "yearMade" : 1710, "artStyle" : "Oil painting" , "subject": "Portrait" }' \
http://localhost:9000/api/v1/artworks 

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID": 2, "artistID" : 1, "name" : "Naama", "yearMade": 2020, "artStyle": "Piirros" , "subject": "Omakuva" }' \
http://localhost:9000/api/v1/artworks
echo; echo " ----------- Tarkastellaan museoita:" 

curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/museums" 
echo;
echo; echo " ----------- Tarkastellaan taiteilijoita:" 

curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/artists"

echo;
echo; echo " ----------- Tarkastellaan museossa 1 olevia teoksia:"

curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/museums/1/artworks"
echo;
echo; echo " ----------- Tarkastellaan taiteilija id 2 teoksia:"

curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/artists/2/artworks" 
echo;
echo; echo " ----------- Poistetaan teos:"

curl -i -X DELETE "http://localhost:9000/api/v1/artworks/1"

