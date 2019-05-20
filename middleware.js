// 测试中间件
const express = require('express');
const router = express.Router();

// 中间件测试
router.use((req,res,next)=>{
    // 集群：查看在哪个cpu执行
    const cluster = require('cluster');
    if(cluster.isWorker){
        console.log(`Worker ${cluster.worker.id}`)
    }
    console.log('\n\n总是执行');
    next();
})

// 由于res.send出去后，路由终止
.get('/a',(req,res)=>{
    console.log('/a：路由终止')
    res.send('a')
})

.get('/a',(req,res)=>{
    console.log('/a：永远不会被调用')
})

.get('/b',(req,res,next)=>{
    console.log('/b：路由未终止')
    next();
})

// 除了路由a
.use((req,res,next)=>{
    console.log('有时调用')
    next();
})

// b路由一直到这里
.get('/b',(req,res,next)=>{
    console.log('/b (part 2)：抛出错误')
    throw new Error('b失败')
})

// 错误b路由不进入这里
.get('/b',(err,req,res,next)=>{
    console.log('/b：检测到错误并传递')
    next(err);
})

.get('/c',(err,req)=>{
    console.log('/c：抛出错误')
    throw new Error('c 失败')
})

.use('/c',(err,req,res,next)=>{
    console.log('/c：检测到错误但不传递')
    next();
})

module.exports = router;