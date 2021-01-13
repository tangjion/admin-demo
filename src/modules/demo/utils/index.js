// Write your utils

/**
 * Contents:
 * 1. isArray: 判断参数是否为数组 - from lodash
 */

import { isArray } from 'lodash'

export const checkArray = (data) => {
  return isArray(data)
}

export default {
  checkArray
}
