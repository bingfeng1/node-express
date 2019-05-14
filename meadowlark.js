const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// 是否是生产模式
if(process.env.NODE_ENV === "production"){
    app.enable('view cache');
}

app.set('port', process.env.PORT || 3000)
    .engine('handlebars', exphbs({ defaultLayout: 'main' }))
    .set('view engine', 'handlebars')

    .get('/', (req, res) => {
        res.render('home')
    })

    .get('/about', (req, res) => {
        res.render('about')
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