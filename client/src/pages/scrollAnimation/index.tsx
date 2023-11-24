import React from 'react'
import './index.less'

export default function ScollAnimation() {
  React.useEffect(() => {
    const items = document.querySelectorAll('.item')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('come-in')
          observer.unobserve(entry.target)
        }
      })
    })
    items.forEach((item) => {
      observer.observe(item)
    })
  }, [])

  return (
    <div className="box">
      <div className="item">content-1</div>
      <div className="item">content-2</div>
      <div className="item">content-3</div>
      <div className="item">content-4</div>
      <div className="item">content-5</div>
      <div className="item">content-6</div>
      <div className="item">content-7</div>
      <div className="item">content-8</div>
      <div className="item">content-9</div>
    </div>
  )
}
