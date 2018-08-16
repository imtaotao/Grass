export default class BaseObserver {
  constructor () {
    this.commonFuns = []
    this.onceFuns = []
  }

  on (fun) {
    if (typeof fun === 'function') {
      const l = this.commonFuns.length
      this.commonFuns[l] = fun
    }
  }

  once (fun) {
    if (typeof fun === 'function') {
      const l = this.onceFuns.length
      this.onceFuns[l] = fun
    }
  }

  emit (data) {
    const { commonFuns, onceFuns } = this

    if (commonFuns.length) {
      for (let i = 0; i < commonFuns.length; i++) {
        commonFuns[i](data)
      }
    }

    if (onceFuns.length) {
      for (let j = 0; j < onceFuns.length; j++) {
        onceFuns[j](data)
        onceFuns.splice(j, 1)
        j--
      }
    }
  }

  remove (fun) {
    if (!fun || typeof fun !== 'function') {
      this.commonFuns = []
      this.onceFuns = []
    }

    removeFun(this.commonFuns, fun)
    removeFun(this.onceFuns, fun)
  }
}

function removeFun (arr, fun){
  let index
  let breakIndex = 0
  while (~(index = arr.indexOf(fun, breakIndex))) {
    arr.splice(index, 1)
    breakIndex = index
  }
}