// 只在组件初始化执行的hook
import { useEffect } from 'react'

const useMount = (fn: () => void) => {
  useEffect(() => {
    fn?.()
  }, [])
}

export default useMount

// 使用：
// useMount(() => {
//   message.info("首次渲染");
// })
