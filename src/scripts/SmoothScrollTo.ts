
const SmoothScrollTo = (endX: number, endY: number) => {
  const startX = window.scrollX || window.pageXOffset
  const startY = window.scrollY || window.pageYOffset
  const distanceX = endX - startX
  const distanceY = endY - startY
  const startTime = new Date().getTime()
  const duration = 800

  // Easing function
  const easeInOutQuart = (time: number, from: number, distance: number, duration: number) => {
    if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from
    return -distance / 2 * ((time -= 2) * time * time * time - 2) + from
  }

  const timer = setInterval(() => {
    const time = new Date().getTime() - startTime
    const newX = easeInOutQuart(time, startX, distanceX, duration)
    const newY = easeInOutQuart(time, startY, distanceY, duration)
    if (time >= duration)
      clearInterval(timer)
    else
      window.scroll(newX, newY)
  }, 1000 / 60) // 60 fps
}

export default SmoothScrollTo