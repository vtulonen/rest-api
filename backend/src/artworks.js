import Router from 'koa-router';
import mysql from 'mysql2/promise';
import Url from 'url';
import { koaBody, artworkPath, artworksPath } from './constants';
import { connectionSettings } from './settings';
import { checkAccept, checkContent } from './middleware';

const artworks = new Router();
// Define artworks paths

// GET /resource
artworks.get(artworksPath, checkAccept, async (ctx) => {
  const url = Url.parse(ctx.url, true);
  const { sort } = url.query;

  const parseSortQuery = ({ urlSortQuery, whitelist }) => {
    let query = '';
    if (urlSortQuery) {
      const sortParams = urlSortQuery.split(',');

      query = 'ORDER BY ';
      sortParams.forEach((param, index) => {
        let trimmedParam = param;
        let desc = false;

        if (param[0] === '-') {
          // Remove the first character
          trimmedParam = param.slice(1);
          // Set descending to true
          desc = true;
        }

        // If parameter is not whitelisted, ignore it
        // This also prevents SQL injection even without statement preparation
        if (!whitelist.includes(trimmedParam)) return;

        // If this is not the first sort parameter, append ', '
        if (index > 0) query = query.concat(', ');

        // Append the name of the field
        query = query.concat(trimmedParam);

        if (desc) query = query.concat(' DESC');
      });
    }
    return query;
  };
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['id', 'museumID', 'artistID', 'name', 'yearMade', 'artStyle', 'subject'] });

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM artworks
        ${orderBy}
      `);

    // Return all artworks
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// GET /resource/:id
artworks.get(artworkPath, checkAccept, async (ctx) => {
  const { id } = ctx.params;
  console.log('.get id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
          SELECT *
          FROM artworks
          WHERE id = :id;
        `, { id });

    // Return the resource
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// POST /resource
artworks.post(artworksPath, checkAccept, checkContent, koaBody, async (ctx) => {
  const {
    museumID, artistID, name, yearMade, artStyle, subject,
  } = ctx.request.body;

  if (typeof name === 'undefined') {
    ctx.throw(400, 'body.name is required');
  } else if (typeof name !== 'string') {
    ctx.throw(400, 'body.name must be string');
  } else if (typeof museumID === 'undefined') {
    ctx.throw(400, 'body.museumID is required');
  } else if (typeof museumID !== 'number') {
    ctx.throw(400, 'body.museumID must be an integer');
  } else if (typeof artistID === 'undefined') {
    ctx.throw(400, 'body.artistID is required');
  } else if (typeof artistID !== 'number') {
    ctx.throw(400, 'body.artistID must be string');
  } else if (typeof yearMade === 'undefined') {
    ctx.throw(400, 'body.yearMade is required');
  } else if (typeof yearMade !== 'number') {
    ctx.throw(400, 'body.yearMade must be an integer');
  } else if (typeof artStyle === 'undefined') {
    ctx.throw(400, 'body.artStyle is required');
  } else if (typeof artStyle !== 'string') {
    ctx.throw(400, 'body.artStyle must be a string');
  } else if (typeof subject === 'undefined') {
    ctx.throw(400, 'body.subject is required');
  } else if (typeof subject !== 'string') {
    ctx.throw(400, 'body.subject must be a string');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Insert a new artwork
    const [status] = await conn.execute(`
          INSERT INTO artworks (museumID, artistID, name, yearMade, artStyle, subject)
          VALUES (:museumID, :artistID, :name, :yearMade, :artStyle, :subject);
        `, {
      museumID, artistID, name, yearMade, artStyle, subject,
    });
    const { insertId } = status;

    // Get the new artwork
    const [data] = await conn.execute(`
          SELECT *
          FROM artworks
          WHERE id = :id;
        `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(artworkPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new artwork
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// PUT /resource/:id
artworks.put(artworkPath, checkAccept, checkContent, koaBody, async (ctx) => {
  const { id } = ctx.params;
  const {
    museumID, artistID, name, yearMade, artStyle, subject
  } = ctx.request.body;

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  } else if (typeof museumID === 'undefined') {
    ctx.throw(400, 'body.museumID is required');
  } else if (typeof museumID !== 'number') {
    ctx.throw(400, 'body.museumID must be an integer');
  } else if (typeof artistID === 'undefined') {
    ctx.throw(400, 'body.artistID is required');
  } else if (typeof artistID !== 'number') {
    ctx.throw(400, 'body.artistID must be string');
  } else if (typeof name === 'undefined') {
    ctx.throw(400, 'body.name is required');
  } else if (typeof name !== 'string') {
    ctx.throw(400, 'body.name must be string');
  } else if (typeof yearMade === 'undefined') {
    ctx.throw(400, 'body.yearMade is required');
  } else if (typeof yearMade !== 'number') {
    ctx.throw(400, 'body.yearMade must be an integer');
  } else if (typeof artStyle === 'undefined') {
    ctx.throw(400, 'body.artStyle is required');
  } else if (typeof artStyle !== 'string') {
    ctx.throw(400, 'body.artStyle must be a string');
  } else if (typeof subject === 'undefined') {
    ctx.throw(400, 'body.subject is required');
  } else if (typeof subject !== 'string') {
    ctx.throw(400, 'body.subject must be a string');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Update the artwork
    const [status] = await conn.execute(`
           UPDATE artworks
           SET museumID = :museumID, artistID = :artistID, name = :name, yearMade = :yearMade, artStyle = :artStyle, subject = :subject
           WHERE id = :id;
         `,
    {
      id, museumID, artistID, name, yearMade, artStyle, subject,
    });

    if (status.affectedRows === 0) { // If the resource does not already exist, create it
      await conn.execute(`
          INSERT INTO artworks (id, museumID, artistID, name = :name, yearMade, artStyle, subject)
          VALUES (:id, :museumID, :artistID, :name, :yearMade, :artStyle, :subject);
        `,
      {
        museumID, artistID, name, yearMade, artStyle, subject,
      });
    }

    // Get the artwork
    const [data] = await conn.execute(`
           SELECT *
           FROM artworks
           WHERE id = :id;
         `, { id });

    // Return the resource
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// DELETE /resource/:id
artworks.del(artworkPath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM artworks
          WHERE id = :id;
        `, { id });

    if (status.affectedRows === 0) {
      // The row did not exist, return '404 Not found'
      ctx.status = 404;
    } else {
      // Return '204 No Content' status code for successful delete
      ctx.status = 204;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

export default artworks;
