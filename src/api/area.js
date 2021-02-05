import request from '@/utils/request'


class AreaModel {

  list(data) {
    return request({
      url: '/admin/street/list',
      method: 'post',
      data
    })
  }
  workerStreet(data) {
    return request({
      url: '/admin/workerStreet/list',
      method: 'post',
      data
    })
  }
  update(data){
    return request({
      url: '/admin/street/update',
      method: 'post',
      data
    })
  }
  save(data) {
    return request({
      url: '/admin/street/save',
      method: 'post',
      data,
    })
  }
  beDelete(params) {
    return request({
      url: '/admin/street/beDelete',
      method: 'get',
      params,
    })
  }
}


export const Area = new AreaModel()
