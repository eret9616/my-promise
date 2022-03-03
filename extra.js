// 一些额外的方法

// 挂在类上的静态方法
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value)
    })
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject){
        reject(reason)
    })
}





Promise.prototype.catch = function (f) {
    // 也是调用这个p对象(this)的then方法，给成功的回调传null，给失败的回调传入f
    return this.then(null, f)
}

Promise.all = function (items) {
    return new Promise(function (resolve, reject) {
        let res = []; // 用来存储成功函数返回的值
        let num = 0; // 记录都返回成功的数字
        let len = items.length // 数组的长度

        //对数组进行遍历
        for (let i = 0; i < len; i++) {
            items[i].then(function (data) {
                res[i] = data
                // 这行是最关键的，如果num的加数等于长度了，resolve
                if (++num === len) {
                    resolve(res)
                }
            }, reject)
        }
    })
}


Promise.race = function (items) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < items.length; i++) {
            items[i].then((value)=>{
                resolve(value)
            }, (err)=>{
                reject(err)
            })
        }
    })
}

/*
    race方法需要好好思考，

    race方法返回的是一个Promise对象（这个对象的默认状态是pending） <---这里我们称它p1

    假设数组中[]这里面有很多p实例
    上面的代码是循环数组，
    对每一个p都调用then方法，把resolve，reject传进去

    一旦有一个p（某一个对象）先完成了并resolve，那么会调用p1接收的resolve方法，（因为传给里面了）

    这个对象里面的值resolve出来给p1，此时p1状态变为了resolved

    Promise.race([p1,p2,p3]).then((r)=>{
    console.log(r)
    })
*/


