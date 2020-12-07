import 'babel-polyfill';
import Koa from 'koa';
import Router from 'koa-router';
import mysql from 'mysql2/promise';
import KoaBody from 'koa-bodyparser';
import Url from 'url';


// The port that this server will run on, defaults to 9000
const port = process.env.PORT || 9000;

// Instantiate a Koa server
const app = new Koa();
const koaBody = new KoaBody();

// Instantiate routers
const test = new Router();
const museums = new Router();

// Define API path
const apiPath = '/api/v1';






const connectionSettings = {
  host: 'db',
  user: 'root',
  database: 'db_1',
  password: 'db_rootpass',
  namedPlaceholders: true,
};

test.get(`${apiPath}/test`, async (ctx) => {
  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [data] = await conn.execute(`
        SELECT *
        FROM test_table
      `);

    console.log('Data fetched:', data);

    // Tell the HTTP response that it contains JSON data encoded in UTF-8
    ctx.type = 'application/json; charset=utf-8';

    // Add stuff to response body
    ctx.body = { greeting: 'Hello world!', data };
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});


// Middleware for checking accept headers
const checkAccept = async (ctx, next) => {
  console.log('checkAccept');
  // If client does not accept 'application/json' as response type, throw '406 Not Acceptable'
  if (!ctx.accepts('application/json')) {
    ctx.throw(406);
  }
  // Set the response content type
  ctx.type = 'application/json; charset=utf-8';
  // Move to next middleware
  await next();
};

// Middleware for checking request body content
const checkContent = async (ctx, next) => {
  console.log('checkContent');
  // Check that the request content type is 'application/json'
  if (!ctx.is('application/json')) {
    ctx.throw(415, 'Request must be application/json');
  }
  // Move to next middleware
  await next();
};

// Define museums paths
const museumsPath = `${apiPath}/museums`;
const museumPath = `${museumsPath}/:id`;

// GET /resource
museums.get(museumsPath, checkAccept, async (ctx) => {
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

    // Insert a new todo
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

    // Update the todo
    const [status] = await conn.execute(`
           UPDATE museums
           SET museum = :museum, country = :country, city = :city
           WHERE id = :id;
         `, { id, museum, country, city });

    if (status.affectedRows === 0) {
      // If the resource does not already exist, create it
      await conn.execute(`
          INSERT INTO museums (id, museum, country, city)
          VALUES (:id, :museum, :country, :city);
        `, { id, museum, country, city });
    }

    // Get the todo
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


app.use(test.routes());
app.use(test.allowedMethods());
app.use(museums.routes());
app.use(museums.allowedMethods());

// Start the server and keep listening on port until stopped
app.listen(port);

console.log(`App listening on port ${port}`);
