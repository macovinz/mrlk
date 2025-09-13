export function AutoplayPlugin(slider: any, timeout = 5000) {
  let timeoutId: ReturnType<typeof setTimeout>
  let mouseOver = false

  function clearNextTimeout() {
    clearTimeout(timeoutId)
  }

  function nextTimeout() {
    clearTimeout(timeoutId)
    if (mouseOver) return
    timeoutId = setTimeout(() => {
      slider.next()
    }, timeout)
  }

  slider.on('created', () => {
    slider.container.addEventListener('mouseover', () => {
      mouseOver = true
      clearNextTimeout()
    })
    slider.container.addEventListener('mouseout', () => {
      mouseOver = false
      nextTimeout()
    })
    nextTimeout()
  })

  slider.on('dragStarted', clearNextTimeout)
  slider.on('animationEnded', nextTimeout)
  slider.on('updated', nextTimeout)
}
