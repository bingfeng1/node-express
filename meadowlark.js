const express = require('express');
const exphbs = require('express-handlebars');
// 这里使用了不同书上的文件处理，使用了express文档中的上传文件处理
const multer = require('multer');
// 加入dest，那么会存在硬盘上butter，如果不带参数，则在内存中，file对象会增加butter属性：http://www.expressjs.com.cn/en/resources/middleware/multer.html
const upload = multer({ dest: 'uploads/' })
// 设置cookies
const credentials = require('./credentials');
const cookieParse = require('cookie-parser');

// 自定义中间件测试
const middlewareTest = require('./middleware');

const app = express();

// 是否是生产模式
if (process.env.NODE_ENV === "production") {
    app.enable('view cache');
}

let tours = [
    {
        id: 0,
        name: 'Hood River',
        price: 99.99
    },
    {
        id: 1,
        name: 'Oregon Coast',
        price: 149.95
    }
]

app.set('port', process.env.PORT || 3000)
    .engine('handlebars', exphbs({ defaultLayout: 'main' }))
    .set('view engine', 'handlebars')
    .use(express.static(__dirname + '/public'))
    .use(express.json())
    //仅上面的express.json只将req.body创建，内部没有内容，需要使用urlencoded加载传输来的数据
    .use(express.urlencoded())
    // .disable('x-powered-by')
    // 设置cookie
    .use(cookieParse(credentials.cookieSecret))

    //测试中间件
    .use('/', middlewareTest)

    // 路由
    .get('/', (req, res) => {
        //cookies测试
        // 获取cookies
        if (Object.keys(req.cookies).length) {   //通过判断对象key的数量
            console.log(req.cookies.monster, req.cookies.signed_moster, req.signedCookies.signed_moster)
        }

        // 设置cookies
        res.cookie('monster', 'nom nom');
        res.cookie('signed_moster', 'nom nom', { signed: true }) //cookies验证加密
        res.render('home')
    })

    .get('/about', (req, res) => {
        res.render('about')
    })

    .get('/greeting', (req, res) => {
        res.render('about', {
            message: 'welcome',
            style: req.query.style,
            userid: req.cookies.userid,
            username: req.session.username,
        })
    })

    .get('/newsletter', (req, res) => {
        res.render('newsletter', { csrf: "测试模拟数据" });
    })

    .post('/process', (req, res) => {
        console.log(req.query.form, req.body._csrf, req.body.name, req.body.email);
        res.redirect(303, '/')
    })

    //!!!!!!!!!!!json操作!!!!!!!!!!!
    // 传递json数据
    .get('/api/tours', (req, res) => {
        res.json(tours)

    })

    .route('/api/tours/:id')
    .get((req, res) => {
        let p = tours.filter(p => p.id == req.params.id)
        res.json(p)
    })

    //修改数组
    .put((req, res) => {
        let p = tours.filter(p => p.id == req.params.id)
        if (p[0]) {
            if (req.query.name)
                p[0].name = req.query.name;
            if (req.query.price)
                p[0].price = req.query.price;
            res.json({ success: true });
        } else {
            res.json({ error: 'No such tour exists.' })
        }
    })

    // 删除数组
    .delete((req, res) => {
        let p = tours.filter(p => p.id == req.params.id)
        if (p[0]) {
            tours.splice(tours.indexOf(p[0]), 1);
            res.json(tours);
        } else {
            res.json({ error: 'No such tour exists.' })
        }
    })

//!!!!!!!!!!!json操作!!!!!!!!!!!

// handlebars测试练习（如果前后端分离，这个并没有必要学习），后面涉及前后端交互，以jquery为主
app.get('/sendData', (req, res) => {
    let temp = {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD'
        },
        tours: [
            {
                name: 'Hood River',
                price: '$99.95'
            }, {
                name: 'Oregon Coast',
                price: '$159.95'
            }
        ],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'GBP', 'BTC']
    }
    res.render('sendData', temp)
})

    // 上传文件处理
    .get('/contest/vacation-photo', (req, res) => {
        let now = new Date();
        res.render('contest/vacation-photo', {
            year: now.getFullYear(),
            month: now.getMonth() + 1
        })
    })

    // 有一个疑问，为什么不直接在后台把年月写入，而是url
    .post('/contest/vacation-photo/:year/:month', upload.single('photo'), (req, res) => {
        console.log(req.file, req.body)
        res.redirect(303, '/');
    })

    .get('/no-layout', (req, res) => {
        res.render('no-layout', { layout: null })
    })

    .get('./error', (req, res) => {
        res.status(500).render('error')
    })

    // 定制404页面
    .use((req, res) => {
        res.status(404).render('404')
    })

    // 定制500页面
    .use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).render('500')
    })


//应用集群扩展
function startServer() {
    app.listen(app.get('port'), () => {
        console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.环境是：${app.get('env')}`)
    })
}

if (require.main === module) {
    startServer();
} else {
    //应用程序作为一个模块通过"require"引入：导出函数
    // 创建服务器
    module.exports = startServer;

}