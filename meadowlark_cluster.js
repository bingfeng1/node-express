// 不能使用vscode更改package.json启动F5，必须使用命令行。CPU卡死
const cluster = require('cluster');

function startWorker(){
    let worker = cluster.fork();
    console.log(`集群：${worker.id}启动`)
}

if(cluster.isMaster){
    require('os').cpus().forEach(()=>{
        startWorker();
    })

    // 记录所有断开的工作线程，如果工作线程断开，他应该退出
    // 因此我们可以等待exit事件，然后繁衍一个新的工作线程来代替他
    cluster.on('disconnect',worker=>{
        console.log(`集群：Worker${worker.id}断开连接`)
    })

    // 当有工作线程退出时，创建一个工作线程代替他
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`集群：Worker ${worker.id} 退出 ${code}(${signal})`)
    })

}else{
    // 在这个工作线程上启动应用服务器
    require('./meadowlark')()
}