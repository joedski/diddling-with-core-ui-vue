const L = require('lodash/fp');
const uuid = require('uuid/v4');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');


const router = new Router();

module.exports = router;


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
