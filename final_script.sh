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
# Nodejs - Mysql - Yarn - Docker - Docker-compose
#
# Konfiguraatio:
# Pitäisi toimia tämä bash shell scripti ajamalla komennolla: $bash clone_run_script
# mikäli epäonnistuu, koita ajaa uudestaan. Moneen kertaan ajaessa tulee docker 
# kontit ajaa alas komennolla docker-compose down
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

curl -i -X DELETE "http://localhost:9000/api/v1/artworks/2"

exit

ESIMERKKIAJO: 
Huom! Ajossa ei käydä jokaista get kutsua jokaiselle taululle, koska ne ovat kytännössä samaa koodia.

tlone@vVM:~/Projects/koulu/tietokannat/rest-api$ bash test_run_script.sh 


 ----------- Viedaan kantaan dataa, museoita:
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/museums/1
Content-Length: 78
Date: Wed, 09 Dec 2020 12:55:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"museum":"National Gallery","country":"Iso-Britannia","city":"Lontoo"}HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/museums/2
Content-Length: 64
Date: Wed, 09 Dec 2020 12:55:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":2,"museum":"Vapriikki","country":"Suomi","city":"Tampere"}HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/museums/3
Content-Length: 62
Date: Wed, 09 Dec 2020 12:55:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":3,"museum":"Louvre","country":"Ranska","city":"Pariisi"}

 ----------- Viedaan kantaan dataa, taiteilijoita:
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/artists/1
Content-Length: 72
Date: Wed, 09 Dec 2020 12:55:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"firstName":"Kalle","lastName":"Maalari ","nationality":"Suomi"}HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/artists/2
Content-Length: 75
Date: Wed, 09 Dec 2020 12:55:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":2,"firstName":"Leonard","lastName":"Davinci ","nationality":"Italia"}

 ----------- Muokataan asken lisattylle taiteilijalle oikeinkirjoitus nimiin:
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 77
Date: Wed, 09 Dec 2020 12:55:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":2,"firstName":"Leonardo","lastName":"Da Vinci ","nationality":"Italia"}

 ----------- Lisataan taideteoksia:
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/artworks/1
Content-Length: 109
Date: Wed, 09 Dec 2020 12:55:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"museumID":1,"artistID":2,"name":"Trees","yearMade":"1700","artStyle":"Painting","subject":"Scenery"}HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/artworks/2
Content-Length: 113
Date: Wed, 09 Dec 2020 12:55:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":2,"museumID":1,"artistID":2,"name":"Mountains","yearMade":"1730","artStyle":"Painting","subject":"Scenery"}HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/artworks/3
Content-Length: 114
Date: Wed, 09 Dec 2020 12:55:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":3,"museumID":1,"artistID":2,"name":"Superman","yearMade":"1720","artStyle":"Scuplture","subject":"Portrait"}test_run_script.sh: line 85: url: command not found
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: localhost:9000/api/v1/artworks/4
Content-Length: 108
Date: Wed, 09 Dec 2020 12:55:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":4,"museumID":2,"artistID":1,"name":"Naama","yearMade":"2020","artStyle":"Piirros","subject":"Omakuva"}
 ----------- Tarkastellaan museoita:
[{"id":1,"museum":"National Gallery","country":"Iso-Britannia","city":"Lontoo"},{"id":2,"museum":"Vapriikki","country":"Suomi","city":"Tampere"},{"id":3,"museum":"Louvre","country":"Ranska","city":"Pariisi"}]

 ----------- Tarkastellaan taiteilijoita:
[{"id":1,"firstName":"Kalle","lastName":"Maalari ","nationality":"Suomi"},{"id":2,"firstName":"Leonardo","lastName":"Da Vinci ","nationality":"Italia"}]

 ----------- Tarkastellaan museossa 1 olevia teoksia:
[{"id":1,"museumID":1,"artistID":2,"name":"Trees","yearMade":"1700","artStyle":"Painting","subject":"Scenery"},{"id":2,"museumID":1,"artistID":2,"name":"Mountains","yearMade":"1730","artStyle":"Painting","subject":"Scenery"},{"id":3,"museumID":1,"artistID":2,"name":"Superman","yearMade":"1720","artStyle":"Scuplture","subject":"Portrait"}]

 ----------- Tarkastellaan taiteilija id 2 teoksia:
[{"id":1,"museumID":1,"artistID":2,"name":"Trees","yearMade":"1700","artStyle":"Painting","subject":"Scenery"},{"id":2,"museumID":1,"artistID":2,"name":"Mountains","yearMade":"1730","artStyle":"Painting","subject":"Scenery"},{"id":3,"museumID":1,"artistID":2,"name":"Superman","yearMade":"1720","artStyle":"Scuplture","subject":"Portrait"}]

 ----------- Poistetaan teos:
HTTP/1.1 204 No Content
Date: Wed, 09 Dec 2020 12:55:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5



