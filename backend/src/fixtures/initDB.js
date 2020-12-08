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
          id int UNSIGNED AUTO_INCREMENT,
          museum varchar(50) NOT NULL,
          country varchar(50) NOT NULL,
          city varchar(50) NOT NULL,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }
};
