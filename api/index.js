const Koa = require('koa');
const C = require('chalk');

const router = require('./src/router');


const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  ctx.set('Access-Control-Allow-Headers', [
    'Content-Type',
    'Access-Control-Allow-Headers',
    'Authorization',
    'X-Requested-With',
  ].join(', '));

  // Also pass through allow headers.
  if (ctx.response.headers['allow']) {
    ctx.set('Access-Control-Allow-Methods', ctx.response.headers['allow']);
  }
});

app.use(async (ctx, next) => {
  console.log(C.gray(`|<<< ${ctx.method.toUpperCase()} ${ctx.path}`));

  try {
    await next();
    const statusColor = (() => {
      if (ctx.status >= 200 && ctx.status < 300) return C.green;
      if (ctx.status >= 300 && ctx.status < 400) return C.cyan;
      if (ctx.status >= 400 && ctx.status < 500) return C.yellow;
      return C.red;
    })();
    console.log(statusColor(`|>>> ${ctx.method.toUpperCase()} ${ctx.path} ${C.bold(ctx.status)}`));
  }
  catch (error) {
    console.error(C.red(`!!!! ${ctx.method.toUpperCase()} ${ctx.path}`));
    console.error(error);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 5000;
app.listen(PORT);
console.log(`App running on localhost:${PORT}`);
