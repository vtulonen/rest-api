import Router from 'koa-router';
import mysql from 'mysql2/promise';

import Url from 'url';
import { koaBody, museumPath, museumsPath, museumArtworksPath } from './constants';
import { connectionSettings } from './settings';
import { checkAccept, checkContent } from './middleware';
import { parseSortQuery } from './helpers';

const museums = new Router();
// Define museums paths

// GET /resource
museums.get(museumsPath, checkAccept, async (ctx) => {
  const url = Url.parse(ctx.url, true);
  const { sort } = url.query;
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['id', 'museum', 'country', 'city'] });

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM museums
        ${orderBy}
      `);

    // Return all museums
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// GET /resource/:id
museums.get(museumPath, checkAccept, async (ctx) => {
  const { id } = ctx.params;
  console.log('.get id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
          SELECT *
          FROM museums
          WHERE id = :id;
        `, { id });

    // Return the resource
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// GET /resource/:id/artworks
museums.get(museumArtworksPath, checkAccept, async (ctx) => {
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
          WHERE museumID = :id;
        `, { id });

    // Return the resource
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// POST /resource
museums.post(museumsPath, checkAccept, checkContent, koaBody, async (ctx) => {
  const { museum, country, city } = ctx.request.body;
  console.log('.post museum contains:', museum);
  console.log('.post country contains:', country);
  console.log('.post city contains:', city);

  if (typeof museum === 'undefined') {
    ctx.throw(400, 'body.museum is required');
  } else if (typeof museum !== 'string') {
    ctx.throw(400, 'body.museum must be string');
  }

  if (typeof country === 'undefined') {
    ctx.throw(400, 'body.country is required');
  } else if (typeof country !== 'string') {
    ctx.throw(400, 'body.country must be string');
  }

  if (typeof city === 'undefined') {
    ctx.throw(400, 'body.city is required');
  } else if (typeof city !== 'string') {
    ctx.throw(400, 'body.city must be string');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Insert a new museum
    const [status] = await conn.execute(`
          INSERT INTO museums (museum, country, city)
          VALUES (:museum, :country, :city);
        `, { museum, country, city });
    const { insertId } = status;

    // Get the new todo
    const [data] = await conn.execute(`
          SELECT *
          FROM museums
          WHERE id = :id;
        `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(museumPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new todo
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// PUT /resource/:id
museums.put(museumPath, checkAccept, checkContent, koaBody, async (ctx) => {
  const { id } = ctx.params;
  const { museum, country, city } = ctx.request.body;
  console.log('.put id contains:', id);
  console.log('.put museum contains:', museum);
  console.log('.put done contains:', country);
  console.log('.put done contains:', city);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  } else if (typeof museum === 'undefined') {
    ctx.throw(400, 'body.museum is required');
  } else if (typeof museum !== 'string') {
    ctx.throw(400, 'body.museum must be string');
  } else if (typeof country === 'undefined') {
    ctx.throw(400, 'body.country is required');
  } else if (typeof country !== 'string') {
    ctx.throw(400, 'body.country must be string');
  } else if (typeof city === 'undefined') {
    ctx.throw(400, 'body.city is required');
  } else if (typeof city !== 'string') {
    ctx.throw(400, 'body.city must be string');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Update the artwork
    const [status] = await conn.execute(`
           UPDATE museums
           SET museum = :museum, country = :country, city = :city
           WHERE id = :id;
         `,
    {
      id, museum, country, city,
    });

    if (status.affectedRows === 0) { // If the resource does not already exist, create it
      await conn.execute(`
          INSERT INTO museums (id, museum, country, city)
          VALUES (:id, :museum, :country, :city);
        `,
      {
        id, museum, country, city,
      });
    }

    // Get the museum
    const [data] = await conn.execute(`
           SELECT *
           FROM museums
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
museums.del(museumPath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM museums
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

export default museums;
