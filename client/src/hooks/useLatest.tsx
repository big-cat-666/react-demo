// 用于返回最新的值，避免闭包问题
import { useRef } from 'react'

const useLatest = <T,>(value: T): { readonly current: T } => {
  const ref = useRef(value)
  ref.current = value

  return ref
}

export default useLatest

// 使用：
// const [value, setValue] = useState()
// const ref = useLatest(value)
// 此时用setValue改变value值，然后用包裹的ref可以取到最新的值
