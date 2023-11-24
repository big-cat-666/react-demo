// 一种具备响应式的 useState，用法与 useState 类似，但可以动态地设置值
// 可以用于设置大量的变量
import { useUpdate, useCreation, useLatest } from './index'

const observer = <T extends Record<string, any>>(
  initialVal: T,
  cb: () => void
): T => {
  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return typeof res === 'object'
        ? observer(res, cb)
        : Reflect.get(target, key)
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val)
      cb()
      return ret
    },
  })

  return proxy
}

const useReactive = <T extends Record<string, any>>(initialState: T): T => {
  const ref = useLatest<T>(initialState)
  const update = useUpdate()

  const state = useCreation(() => {
    return observer(ref.current, () => {
      update()
    })
  }, [])

  return state
}

export default useReactive

// 使用：
// const state = useReactive<any>({
//   count: 0,
//   name: '大家好，我是小杜杜，一起玩转Hooks吧！',
//   flag: true,
//   arr: [],
//   bugs: ['小杜杜', 'react', 'hook'],
//   addBug(bug: string) {
//     this.bugs.push(bug)
//   },
//   get bugsCount() {
//     return this.bugs.length
//   },
// })

// state.count ++ 这样即可进行响应式数据变化
