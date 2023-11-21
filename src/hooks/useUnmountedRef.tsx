// 获取当前组件是否卸载，利用 useEffect 的状态，来保存对应的值
import { useEffect, useRef } from 'react'

const useUnmountedRef = (): { readonly current: boolean } => {
  const unmountedRef = useRef<boolean>(false)

  useEffect(() => {
    unmountedRef.current = false
    return () => {
      unmountedRef.current = true
    }
  }, [])

  return unmountedRef
}

export default useUnmountedRef

// 使用：
// const unmountedRef = useUnmountedRef();
