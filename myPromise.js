/*
 Promise用法：
  let p = new Promise((resolve, reject) => {
      resolve(123)
   }).then((r) => {
       console.log(r);
   })
*/





/*
  实现Promise

  要求：
     I）如果onFullfilled函数返回的是该promise本身，那么会抛出类型错误
         
        出现这种情况的示例：
            let p = new Promise((resolve, reject) => {
                  resolve(11111111)
            }).then((r) => {
                  let _p = new Promise((resolve, reject) => {
                      setTimeout(() => {         《---------- 把_p自己给resolve出去了 会报错 chaining cycled
                          resolve(_p)
                      }, 2000)
                  })
            }).then((r) => {
                  console.log(r);
            })
     
     

     II）如果onFullfilled函数返回的是一个不同的promise，
     那么
     (那么执行该promise的then函数，在then函数里将这个promise的状态转移给外面的promise对象)

        出现这种情况的示例：
            let p = new Promise((resolve,reject)=>{
                return new Promise((resove,reject)=>{
                    resolve(256)
                })
            }).then((r)=>{
                console.log(r); // 这里r是256
            })
     




    //*下面这个可以不看
     *III）规范中 onFullFilled和onRejected只能被调用一次 所以会有一个called变量
     A promise’s then method accepts two arguments:
        promise.then(onFulfilled, onRejected)
        Both onFulfilled and onRejected are optional arguments:
        If onFulfilled is not a function, it must be ignored.
        If onRejected is not a function, it must be ignored.
        If onFulfilled is a function:
        it must be called after promise is fulfilled, with promise’s value as its first argument.
        it must not be called before promise is fulfilled.
        it must not be called more than once. <--------
        If onRejected is a function,
        it must be called after promise is rejected, with promise’s reason as its first argument.
        it must not be called before promise is rejected.
        it must not be called more than once. <----------
    在我的实现中，没有完全按照这个东西，我并没有判断是一个函数，我只判断是promise对象和不是promise对象的情况，所以我就不判断called了
    这个我并不实现


    规范地址：https://promisesaplus.com/ 
*/

function myPromise(constructor) {

    let self = this
    self.status = 'pending'
    self.value = undefined
    self.onfullfilledarr = []
    self.onrejectedarr = []

    function resolve(value) {
        self.status = 'resolved'
        self.value = value
        self.onfullfilledarr.forEach(f => {
            f(value)
        })
    }

    function reject(value) {
        self.status = 'rejected'
        self.value = value
        self.onrejectedarr.forEach(f => {
            f(value)
        })
    }

    try {
        constructor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}


myPromise.prototype.then = function (success, fail) {

    let p = new Promise((resolve, reject) => {

        if (this.status === 'resolved') {

            setTimeout(() => {

                //
                try {
                    const r = success(this.value)
                    // 下面对返回值处理
                    myResolve(p, r, resolve, reject)
                } catch (e) {
                    reject(e)
                }
                //

            })


        } else if (this.status === 'rejected') {


            setTimeout(() => {

                //
                try {
                    const r = fail(this.value)
                    // 下面对返回值处理
                    myResolve(p, r, resolve, reject)
                } catch (e) {
                    reject(e)
                }
                //

            })

        } else {
            if (success)
                this.onfullfilledarr.push(() => {

                    //
                    setTimeout(() => {
                        try {
                            const r = success(this.value)
                            // 下面对返回值处理
                            myResolve(p, r, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 3000)
                    //


                })
            if (fail)
                this.onrejectedarr.push(() => {


                    //
                    setTimeout(() => {

                        try {
                            const r = fail(this.value)
                            // 下面对返回值处理
                            myResolve(p, r, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                    //


                })
        }
    })
    return p
}

function myResolve(p, r, resolve, reject) {
    // 1 如果onFullFilled返回的是该promise本身，那么抛出类型错误
    if (r === p) { // 如果没有settimeout 不是异步的，那么这个p是不存在的，在规范这里，success和fail的执行也是异步的
        throw new TypeError('chaining cycled')
    } else if (r.constructor === myPromise) {
        // 2 如果是promise，执行它的then方法
        r.then.call(r, (sucesss) => {
            resolve(success)
        }, (fail) => {
            reject(fail)
        })
    } else {
        // 3 如果是普通的，resolve出来
        resolve(r)
    }
}










let p2 = new Promise((resolve, reject) => {
    resolve(p2)
})




let p = new Promise((resolve, reject) => {
    resolve(11111111)
}).then((r) => {
    let _p = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(_p)
        }, 2000)
    })
}).then((r) => {
    console.log(r);
})

// Chaining cycle detected









