import request from '@/utils/request'


class CaseModel {

  list(data) {
    return request({
      url: '/admin/reportCase/list',
      method: 'post',
      data
    })
  }
  export(data) {
    return request({
      url: '/admin/reportCase/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
  }
  info(params) {
    return request({
      url: '/admin/reportCase/info',
      method: 'get',
      params,
    })
  }
}


export const Case = new CaseModel()
