# node-express
练习node+express搭建服务器。根据node与express开发这本书。

# 建立项目
npm init -y
设置启动名称meadowlark.js
通过.gitignore忽略不需要上传的内容

# node+express
- express 4.16.0 新增req.body的json处理
```
.use(express.json())
.use(express.urlencoded())
```

- 其他路由处理
```
.route('/api/tours/:id')
    .get((req, res) => {
        ...
    })
    .post((req,res)=>){
        ...
    }
    ...
```

- 文件上传处理
```
// 这里使用了不同书上的文件处理，使用了express文档中的上传文件处理
const multer = require('multer');
// 加入dest，那么会存在硬盘上butter，如果不带参数，则在内存中，file对象会增加butter属性：http://www.expressjs.com.cn/en/resources/middleware/multer.html
const upload = multer({dest:'uploads/'});

//upload还有其他方法，参看上方地址
.post('/contest/vacation-photo/:year/:month',upload.single('photo'),(req,res)=>{
        console.log(req.file,req.body)
        res.redirect(303,'/');
    })
```

# credentials.js
用于保存cookie密钥，正式开发，这个需要gitignore。测试不需要