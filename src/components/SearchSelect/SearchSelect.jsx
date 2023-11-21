import React, { useCallback, useEffect, useState } from 'react'
import PropType from 'prop-types'
import { Select, message } from 'antd'
import { useRequest } from 'ahooks'
import { translateData } from '@/utils/function'

const { Option } = Select
const MULTIPLE = 'multiple'

function defaultFunc() {}
export default function SearchSelect(props) {
  const {
    selectTrigger,
    fetchFunc,
    searchKey,
    optionValue,
    optionText,
    onChange,
    extraInfo,
    initial,
    defaultFirstOption,
    isRequest,
    renderFunc,
    clearAfterSelect,
    value,
    ...restProps
  } = props

  const isMultiple = restProps?.mode === MULTIPLE

  const [newValue, setValue] = useState(value)

  const {
    data: options,
    loading,
    run: getOptions,
  } = useRequest(fetchFunc, {
    formatResult(response) {
      // 多选模式在处理一下 防止出现重复数据
      // if (isMultiple && restProps?.value) {
      //     return [
      //         ...translateData(restProps?.value?.filter(valueItem =>
      //             !response.data.some(item => item[optionValue] === valueItem.value))),
      //         ...response.data,
      //     ];
      // }
      // return [...response.data.filter(({accountStatus}) => accountStatus === EFFECTIVE)];
      return response.data
    },
    manual: true,
    throttleInterval: 500,
    initialData:
      isMultiple && restProps?.value ? translateData(restProps?.value) : [],
    onSuccess(res) {
      defaultFirstOption && res.length > 1 && onChange(res[0][optionValue])
    },
    onError(error) {
      message.error(error)
    },
  })

  useEffect(() => {
    const params = {}
    searchKey && (params[searchKey] = '')
    initial && getOptions(params)
  }, [])

  useEffect(() => {
    setValue(value)
  }, [value])

  const handleSearch = useCallback(
    (value) => {
      if (isRequest) {
        const params = {}
        searchKey && (params[searchKey] = value || '')
        getOptions(params)
      }
    },
    [getOptions, searchKey, isRequest]
  )

  const handleChange = useCallback(
    (value, options) => {
      onChange(value, options)
      if (clearAfterSelect) {
        setValue(props.mode === 'multiple' ? [] : null)
      }
    },
    [onChange]
  )

  return (
    <Select
      // eslint-disable-next-line react/jsx-no-bind
      filterOption={false}
      {...restProps}
      showSearch
      defaultActiveFirstOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      onSelect={selectTrigger ? handleChange : defaultFunc}
      value={newValue}
    >
      {options?.map((item) => (
        <Option
          key={item[optionValue]}
          label={renderFunc(item, extraInfo, optionText, optionValue)}
          info={item}
          disabled={item?.disabled}
        >
          {renderFunc(item, extraInfo, optionText, optionValue)}
        </Option>
      ))}
    </Select>
  )
}

SearchSelect.propTypes = {
  renderFunc: PropType.func,
  fetchFunc: PropType.func.isRequired,
  searchKey: PropType.string,
  optionValue: PropType.string.isRequired,
  optionText: PropType.string.isRequired,
  onChange: PropType.func.isRequired,
  defaultFirstOption: PropType.string,
  initial: PropType.bool.isRequired,
  isRequest: PropType.bool,
  clearAfterSelect: PropType.bool,
}

SearchSelect.defaultProps = {
  renderFunc: (item, extraInfo, optionText, optionValue) =>
    extraInfo ? `${item[optionText]}(${item[optionValue]})` : item[optionText],
  isRequest: true,
}
