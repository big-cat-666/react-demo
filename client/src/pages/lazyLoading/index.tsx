import React from 'react'
import loading from '../../assets/images/loading.gif'
import './index.less'
import { images } from './images'

export default function LazyLoading() {
  React.useEffect(() => {
    const lazyImages = document.querySelectorAll('img[data-src]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement
            lazyImage.src = lazyImage.dataset.src!
            observer.unobserve(lazyImage)
          }
        })
      },
      {
        threshold: 0.5,
      }
    )
    lazyImages.forEach((lazyImage) => {
      observer.observe(lazyImage)
    })
  }, [])

  return (
    <div className="lazy">
      {images.map((img, idx) => (
        <img src={loading} data-src={img} alt="" key={idx} />
      ))}
    </div>
  )
}
