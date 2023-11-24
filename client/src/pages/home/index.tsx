import React from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate()
  return (
    <>
      <Button onClick={() => navigate('/lazy')}>图片懒加载</Button>
      <Button onClick={() => navigate('/scroll')}>滚动动画</Button>
      <Button onClick={() => navigate('/infinite')}>无限滚动</Button>
    </>
  )
}
