import Router from 'koa-router';
import mysql from 'mysql2/promise';
import Url from 'url';
import { koaBody, artistPath, artistsPath } from './constants';
import { connectionSettings } from './settings';
import { checkAccept, checkContent } from './middleware';

const artists = new Router();
// Define artists paths

// GET /resource
artists.get(artistsPath, checkAccept, async (ctx) => {
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
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['id', 'firstName', 'lastName', 'nationality'] });

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM artists
        ${orderBy}
      `);

    // Return all artists
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// GET /resource/:id
artists.get(artistPath, checkAccept, async (ctx) => {
  const { id } = ctx.params;
  console.log('.get id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
          SELECT *
          FROM artists
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
artists.post(artistsPath, checkAccept, checkContent, koaBody, async (ctx) => {
  const { firstName, lastName, nationality } = ctx.request.body;

  if (typeof firstName === 'undefined') {
    ctx.throw(400, 'body.firstName is required');
  } else if (typeof firstName !== 'string') {
    ctx.throw(400, 'body.firstName must be string');
  } else if (typeof lastName === 'undefined') {
    ctx.throw(400, 'body.lastName is required');
  } else if (typeof lastName !== 'string') {
    ctx.throw(400, 'body.lastName must be string');
  } else if (typeof nationality !== 'string') {
    ctx.throw(400, 'body.nationality must be string');
  } else if (typeof nationality !== 'string') {
    ctx.throw(400, 'body.nationality must be string');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Insert a new artist
    const [status] = await conn.execute(`
          INSERT INTO artists (firstName, lastName, nationality)
          VALUES (:firstName, :lastName, :nationality);
        `, { firstName, lastName, nationality });
    const { insertId } = status;

    // Get the new todo
    const [data] = await conn.execute(`
          SELECT *
          FROM artists
          WHERE id = :id;
        `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(artistPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new todo
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// PUT /resource/:id
artists.put(artistPath, checkAccept, checkContent, koaBody, async (ctx) => {
  const { id } = ctx.params;
  const { firstName, lastName, nationality } = ctx.request.body;

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  } else if (typeof firstName === 'undefined') {
    ctx.throw(400, 'body.firstName is required');
  } else if (typeof firstName !== 'string') {
    ctx.throw(400, 'body.firstName must be string');
  } else if (typeof lastName === 'undefined') {
    ctx.throw(400, 'body.lastName is required');
  } else if (typeof lastName !== 'string') {
    ctx.throw(400, 'body.lastName must be string');
  } else if (typeof nationality === 'undefined') {
    ctx.throw(400, 'body.nationality is required');
  } else if (typeof nationality !== 'string') {
    ctx.throw(400, 'body.nationality must be string');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Update the todo
    const [status] = await conn.execute(`
           UPDATE artists
           SET firstName = :firstName, lastName = :lastName, nationality = :nationality
           WHERE id = :id;
         `,
    {
      id, firstName, lastName, nationality,
    });

    if (status.affectedRows === 0) { // If the resource does not already exist, create it
      await conn.execute(`
          INSERT INTO artists (id, artist, nationality)
          VALUES (:id, :firstName, :lastName, :nationality);
        `,
      {
        id, firstName, lastName, nationality,
      });
    }

    // Get the artist
    const [data] = await conn.execute(`
           SELECT *
           FROM artists
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
artists.del(artistPath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM artists
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

export default artists;
