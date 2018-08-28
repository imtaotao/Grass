export function notice (msg, time) {
  time = !Number.isNaN(time)
    ? time
    : 2000

  const noticeCompnent = document.createElement('div')
  noticeCompnent.innerHTML = msg
  noticeCompnent.className = 'notice'

  document.body.appendChild(noticeCompnent)

  setTimeout(() => {
    noticeCompnent.style.webkitTransition = '-webkit-transform 0.5s ease-in, opacity 0.5s ease-in'
    noticeCompnent.style.opacity = '0'
    setTimeout(() => document.body.removeChild(noticeCompnent), 500)
  }, time )
}

export function deepClone (data) {
  return JSON.parse(JSON.stringify(data))
}

export function changeUserInfor (data) {
  localStorage.setItem('User', JSON.stringify(deepClone(data)))
}