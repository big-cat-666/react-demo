import moment from 'moment'

/**
 * A function that checks if a date should be disabled.
 *
 * @param {Date} current - The current date.
 * @param {Date} toDisable - The date to disable.
 * @param {boolean} before - If true, check if current date is before toDisable date. If false, check if current date is after toDisable date.
 * @return {boolean} Returns true if the current date should be disabled, false otherwise.
 */
export function disableDate(current, toDisable, before) {
  if (before) {
    return moment(current).endOf('day') <= moment(toDisable).startOf('day')
  }
  return moment(current).startOf('day') >= moment(toDisable).endOf('day')
}

const range = (start, end) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

export function disableTime(current, toDisable, before) {
  if (
    moment(current).year() === moment(toDisable).year() &&
    moment(current).month() === moment(toDisable).month() &&
    moment(current).dayOfYear() === moment(toDisable).dayOfYear()
  ) {
    if (before) {
      return {
        disabledHours: () => range(0, moment(toDisable).hour()),
        disabledMinutes: () => {
          if (moment(toDisable).hour() === moment(current).hour()) {
            return range(0, moment(toDisable).minute())
          }
          return []
        },
        disabledSeconds: () => {
          if (
            moment(toDisable).hour() === moment(current).hour() &&
            moment(toDisable).minute() === moment(current).minute()
          ) {
            return range(0, moment(toDisable).second() + 1)
          }
          return []
        },
      }
    }
    return {
      disabledHours: () => range(moment(toDisable).hour() + 1, 24),
      disabledMinutes: () => {
        if (moment(toDisable).hour() === moment(current).hour()) {
          return range(moment(toDisable).minute() + 1, 60)
        }
        return []
      },
      disabledSeconds: () => {
        if (
          moment(toDisable).hour() === moment(current).hour() &&
          moment(toDisable).minute() === moment(current).minute()
        ) {
          return range(moment(toDisable).second() + 1, 60)
        }
        return []
      },
    }
  }
  return {}
}
