const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// 是否是生产模式
if (process.env.NODE_ENV === "production") {
    app.enable('view cache');
}

app.set('port', process.env.PORT || 3000)
    .engine('handlebars', exphbs({ defaultLayout: 'main' }))
    .set('view engine', 'handlebars')
    .use(express.static(__dirname + '/public'))
    .use(express.json())
    // .disable('x-powered-by')

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