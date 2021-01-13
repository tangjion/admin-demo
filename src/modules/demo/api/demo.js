import { request } from '@klook/admin-utils/lib/request'

import API from './api_url'

// Write your api instance:

export function getList(params) {
  return request({
    url: API.getList,
    params,
    method: 'get'
  })
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

export default {
  getList
}
