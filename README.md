# rest-api
Look at the final_script.sh for more instructions and to test the program
 
 Api has 3 tables that look like this: 
 
 CREATE TABLE museums (
          id int AUTO_INCREMENT,
          museum varchar(50) NOT NULL,
          country varchar(50) NOT NULL,
          city varchar(50) NOT NULL,
          PRIMARY KEY (id)
        )
        
  CREATE TABLE artists (
          id int AUTO_INCREMENT,
          firstName varchar(50) NOT NULL,
          lastName varchar(50) NOT NULL,
          nationality varchar(50) NOT NULL,
          PRIMARY KEY (id)
        )
        
   CREATE TABLE artworks (
        id int  AUTO_INCREMENT,
        museumID int NOT NULL,
        artistID int NOT NULL,
        name varchar(50) NOT NULL,
        yearMade varchar(50) NOT NULL,
        artStyle varchar(50) NOT NULL,
        subject varchar(50) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (museumID) REFERENCES museums(id),
        FOREIGN KEY (artistID) REFERENCES artists(id)
      )
      
Some example curl calls to use the api: (can't be run in this order, propably due to different indexes here and there)
    
Museo
INSERT:
curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "National Gallery", "country" : "Iso-Britannia", "city" : "Lontoo" }' \
http://localhost:9000/api/v1/museums

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "Vapriikki", "country" : " ", "city" : "Tampere" }' \
http://localhost:9000/api/v1/museums

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "Louvre", "country" : "Ranska", "city" : "Pariisi" }' \
http://localhost:9000/api/v1/museums


GET ALL:
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/museums"

GET SINGLE: 
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/museums/1"
GET ALL ARTWORKS OF Museum
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/museums/1/artworks"

UPDATE:
POST resource/id
curl -i -X PUT \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museum": "Pompidou-keskus", "country" : "Ranska", "city" : "Pariisi"}' \
http://localhost:9000/api/v1/museums/2

DELETE
curl -i -X DELETE http://localhost:9000/api/v1/museums/1
 
Artist
GET ALL:
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/artists"

GET SINGLE: 
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/artists/1"
GET ALL ARTWORKS OF ARTIST
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/artists/2/artworks"


INSERT:
curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "firstName": "Leonard", "lastName" : "Davinci ", "nationality" : "Italia" }' \
http://localhost:9000/api/v1/artists 

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "firstName": "Kalle", "lastName" : "Maalari ", "nationality" : "Suomi" }' \
http://localhost:9000/api/v1/artists 


UPDATE:
POST resource/id
curl -i -X PUT \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "firstName": "Leonardo", "lastName" : "Da Vinci ", "nationality" : "Italia" }' \
http://localhost:9000/api/v1/artists/2

DELETE
curl -i -X DELETE http://localhost:9000/api/v1/artists/1

Artwork
GET ALL:
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/artworks"

GET SINGLE: 
curl -X GET -H "Content-Type: application/json;charset=UTF-8" "http://localhost: 9000/api/v1/artworks/1"

INSERT:
curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID" : 1, "artistID" : 2, "name" : "Trees", "yearMade" : 1700, "artStyle" : "Painting" , "subject": "Scenery" }' \
http://localhost:9000/api/v1/artworks

curl -i -X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID": 2, "artistID" : 2, "name" : "Naama", "yearMade": 2020, "artStyle": "Piirros" , "subject": "Omakuva" }' \
http://localhost:9000/api/v1/artworks

UPDATE:
PUT resource/id
curl -i -X PUT \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumID": 1, "artistID" : 1, "name" : "GGGFlowers", "yearMade" : 1699, "artStyle": "Watercolor" , "subject": "Scenery" }' \
http://localhost:9000/api/v1/artworks/1

curl -i -X PUT \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{ "museumId": 1, "artistID" : 1 "name" : "Mountains" ", "yearMade" : 1689, "artStyle" : "Oil painting", "subject" : "Scenery" }' \
http://localhost:9000/api/v1/artworks/2


DELETE
curl -i -X DELETE "http://localhost:9000/api/v1/artworks/3"



    
    
    
    
    
