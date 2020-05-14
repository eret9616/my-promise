// let p = new Promise((resolve, reject) => {
//     resolve(123)
// }).then((r) => {
//     console.log(r);
// })


/*
  实现Promise
  到下面这步，已经基本完成了，（在面试时我就写到了这一步）

  todo的部分是 A+规范中的最后一部分，就是对success和fail方法返回值的处理
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
    return new Promise((resolve, reject) => {
        if (this.status === 'resolved') {

            try {

                success(this.value)
                // todo
            } catch (e) {

                reject(e)
            }

        } else if (this.status === 'rejected') {

            try {

                fail(this.value)
                // todo
            } catch (e) {
                reject(e)
            }
        } else {
            if (success)
                this.onfullfilledarr.push(() => {

                    try {

                        success(this.value)
                        // todo
                    } catch (e) {
                        reject(e)
                    }
                })
            if (fail)
                this.onrejectedarr.push(() => {

                    try {

                        fail(this.value)
                        // todo
                    } catch (e) {
                        reject(e)
                    }
                })
        }
    })
}


function resolvePromise() {

}


let p = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(123)
    }, 3000)
}).then((r) => {
    console.log('3 seconds passed');
    console.log(r);
})