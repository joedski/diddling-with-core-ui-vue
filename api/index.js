const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const L = require('lodash/fp');
const uuid = require('uuid/v4');
const C = require('chalk');


const app = new Koa();

const router = new Router();

const _noots = {};
// NOTE: id is not editable.
const editableNootProps = ['title', 'body'];
const nootProps = ['id'].concat(editableNootProps);
const pickEditableNootProps = L.pick(editableNootProps);

router.use(BodyParser());

router.get('/noots', (ctx) => {
  ctx.body = L.values(_noots);
});

router.post('/noots', (ctx) => {
  const newNoot = pickEditableNootProps(ctx.request.body);
  newNoot.id = uuid();
  _noots[newNoot.id] = newNoot;
  ctx.body = newNoot;
});

router.get('/noots/:id', (ctx) => {
  const noot = _noots[ctx.params.id];

  if (!noot) {
    ctx.status = 404;
    ctx.body = {
      error: 'not-found',
      message: 'Noot Not Found',
    };

    return;
  }

  ctx.body = noot;
});

router.patch('/noots/:id', (ctx) => {
  const noot = _noots[ctx.params.id];

  if (!noot) {
    ctx.status = 404;
    ctx.body = {
      error: 'not-found',
      message: 'Noot Not Found',
    };

    return;
  }

  const updates = pickEditableNootProps(ctx.request.body);

  Object.assign(noot, updates);

  ctx.body = noot;
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

app.listen(3001);
console.log(`App running on localhost:3001`);
