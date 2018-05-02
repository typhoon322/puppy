const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
var router = new Router();

const BodyParser = require('koa-bodyparser');
app.use(BodyParser());

const cors = require('koa-cors');
app.use(cors());

app.use(async(ctx,next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ${ctx.request.headers}...`)
    await next();
});

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/pandashit');
const Photo = mongoose.model('Photo', {
    url: String,
    title: String,
    desc: String,
    isShow: Boolean,
    createdTime: Date,
    lastUpdateTime: Date
});

router.get('/', async (ctx, next) => {
  const photos = await getPhotos();
  const greeting = '欢迎光临熊猫咖啡';
  const response = {
    images: photos,
    greeting: greeting
  };
  ctx.response.body = {code: 0, data: response, msg: 'Success'};//以json数据类型返回值
});

router.get('/index', async (ctx, next) => {
  const photos = await getPhotos();
  const greeting = '欢迎光临熊猫咖啡';
  const response = {
    images: photos,
    greeting: greeting
  };
  ctx.response.body = {code: 0, data: response, msg: 'Success'};//以json数据类型返回值
});

async function getPhotos(){
  let photos = null;
  await Photo.find({isShow: true}, (err, results) => {
        if(err){
            console.error(err);
          return;
        }
      }).then( (res) => {
          if(res){
            photos = res;
          }
      });

  return photos;
}

router.get('/photo/:id', async (ctx, next) => {
    await Photo.findById(ctx.params.id, (err, results) => {
        if(err){
            console.error(err);
            ctx.response.body = {code: 1, msg: 'Internal Error'};
          return;
        }
      }).then((res) => {
        console.log('res: ', res);
          if(res){
            ctx.response.body = {code: 0, data: res, msg: 'Success'};//以json数据类型返回值
          }
      });
});

// router.post('/photo', async(ctx) => {
//     let body = ctx.request.body;
//     console.info(body);
//     const photo = body;
//     photo.createdTime = new Date();
//     photo.lastUpdateTime = new Date();
//     await Photo.create(photo, function (err) {
//         if(err){
//             console.error(err);
//             ctx.response.body = {code: 1, msg: 'Internal error'};
//             return false;
//         }
//         return true;
//     }).then(function (res) {
//         console.log('==========添加成功=========');
//         console.log('res: ', res);
//         ctx.response.body = {code: 0, msg: 'success'};
//     });
// });

app.use(router.routes()).use(router.allowedMethods);

app.listen(3077,function(){
    console.log('CORS-enabled web server listening on port 3077');
});
