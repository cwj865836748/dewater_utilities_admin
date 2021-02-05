import request from '@/utils/request'


class BusinessModel {

  list(data) {
    return request({
      url: '/admin/businessType/list',
      method: 'post',
      data
    })
  }

  save(data) {
    return request({
      url: '/admin/businessType/save',
      method: 'post',
      data,
    })
  }
  update(data) {
    return request({
      url: '/admin/businessType/update',
      method: 'post',
      data,
    })
  }
  delete(params) {
    return request({
      url: '/admin/businessType/delete',
      method: 'get',
      params,
    })
  }
  select(){
    return request({
      url: '/admin/businessType/select',
      method: 'get'
    })
  }
  waterList(data) {
    return request({
      url: '/admin/water/list',
      method: 'post',
      data
    })
  }

  waterSave(data) {
    return request({
      url: '/admin/water/save',
      method: 'post',
      data,
    })
  }
  waterUpdate(data) {
    return request({
      url: '/admin/water/update',
      method: 'post',
      data,
    })
  }
  waterDelete(params) {
    return request({
      url: '/admin/water/delete',
      method: 'get',
      params,
    })
  }
}


export const Business = new BusinessModel()
