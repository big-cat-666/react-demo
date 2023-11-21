// 强制组件重新渲染，最终返回一个函数
// 具体的做法是：搞个累加器，无关的变量，触发一次，就累加 1，这样就会强制刷新
import { useReducer } from 'react'

function useUpdate(): () => void {
  const [, update] = useReducer((num: number): number => num + 1, 0)

  return update
}

export default useUpdate

// 使用：
// const update = useUpdate();
// 调用 update()即可强制刷新
