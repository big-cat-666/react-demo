// 强化 useMemo 和 useRef，用法与 useMemo 一样，一般用于性能优化
// useMemo 的第一个参数 fn，会缓存对应的值，那么这个值就有可能拿不到最新的值，而 useCreation 拿到的值永远都是最新值
// useRef 在创建复杂常量的时候，会出现潜在的性能隐患（如：实例化 new Subject），但 useCreation 可以有效地避免
// 实现原理
// 明确出参入参：useCreation 主要强化的是 useMemo，所以出入参应该保持一致。出参返回对应的值，入参共有两个，第一个对应函数，第二个对应数组（此数组可变触发）；
// 最新值处理：针对 useMemo 可能拿不到最新值的情况，可直接依赖 useRef 的高级用法来保存值，这样就会永远保存最新值；
// 触发更新条件：比较每次传入的数组，与之前对比，若不同，则触发、更新对应的函数。

import { useRef } from 'react'
import type { DependencyList } from 'react'

const depsAreSame = (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean => {
  if (oldDeps === deps) return true

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false
  }

  return true
}

const useCreation = <T,>(fn: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  })

  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps
    current.obj = fn()
    current.initialized = true
  }

  return current.obj as T
}

export default useCreation

// 使用：
// 用法与useMemo相同
// const nowData = useCreation(() => getNowData(), []);
