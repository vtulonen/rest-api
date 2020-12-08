import 'babel-polyfill';
import Koa from 'koa';
import { port } from './constants';
import museums from './museums';
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

// Start the server and keep listening on port until stopped
app.listen(port);

console.log(`App listening on port ${port}`);
