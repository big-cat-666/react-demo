// 只在组件卸载时的hook
import { useEffect } from 'react'
import useLatest from './useLatest'

const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      fnRef.current()
    },
    []
  )
}

export default useUnmount

// 使用：
// useUnmount(() => {
//   message.info("组件已卸载");
// });
