import 'babel-polyfill';
import Koa from 'koa';
import artists from './artists';
import museums from './museums';
import artworks from './artworks';
import { port } from './constants';
import { databaseReady } from './helpers';
import { initDB } from './fixtures';

// Initialize database
(async () => {
  await databaseReady();
  await initDB();
})();

// Instantiate a Koa server
const app = new Koa();

app.use(museums.routes());
app.use(museums.allowedMethods());
app.use(artists.routes());
app.use(artists.allowedMethods());
app.use(artworks.routes());
app.use(artworks.allowedMethods());

// Start the server and keep listening on port until stopped
app.listen(port);

console.log(`App listening on port ${port}`);
