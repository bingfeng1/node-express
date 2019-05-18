const express = require('express');
const exphbs = require('express-handlebars');

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
    // .disable('x-powered-by')

    // 路由
    .get('/', (req, res) => {
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

    //!!!!!!!!!!!json操作!!!!!!!!!!!
    // 传递json数据
    .get('/api/tours',(req,res)=>{
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

    // handlebars测试练习（如果前后端分离，这个并没有必要学习）
    app.get('/sendData',(req,res)=>{
        let temp = {
            currency:{
                name:'United States dollars',
                abbrev:'USD'
            },
            tours:[
                {
                    name:'Hood River',
                    price:'$99.95'
                },{
                    name:'Oregon Coast',
                    price:'$159.95'
                }
            ],
            specialsUrl:'/january-specials',
            currencies:['USD','GBP','BTC']
        }
        res.render('sendData',temp)
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

    .listen(app.get('port'), () => {
        console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`)
    })