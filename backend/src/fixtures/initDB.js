import mysql from 'mysql2/promise';

import { connectionSettings } from '../settings';

export default async () => {
  const conn = await mysql.createConnection(connectionSettings);
  try {
    await conn.execute(`
        SELECT *
        FROM museums
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: museums');
      await conn.execute(`
        CREATE TABLE museums (
          id int AUTO_INCREMENT,
          museum varchar(50) NOT NULL,
          country varchar(50) NOT NULL,
          city varchar(50) NOT NULL,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }

  try {
    await conn.execute(`
        SELECT *
        FROM artists
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: artists');
      await conn.execute(`
        CREATE TABLE artists (
          id int AUTO_INCREMENT,
          firstName varchar(50) NOT NULL,
          lastName varchar(50) NOT NULL,
          nationality varchar(50) NOT NULL,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }

  try {
    await conn.execute(`
        SELECT *
        FROM artworks
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: artworks');
      await conn.execute(`
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
      `);
      console.log('...success!');
    }
  }
};
