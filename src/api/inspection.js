import request from '@/utils/request'

// 公共类
class InspectionModel {

  list(data) {
    return request({
      url: '/admin/patrol/list',
      method: 'post',
      data
    })
  }

  patrolInfo(params) {
    return request({
      url: '/admin/patrol/info',
      method: 'get',
      params,
    })
  }
  lineList(data) {
    return request({
      url: '/admin/way/list',
      method: 'post',
      data
    })
  }
  lineInfo(params) {
    return request({
      url: '/admin/way/info',
      method: 'get',
      params
    })
  }
  workerList(params) {
    return request({
      url: '/admin/way/workerList',
      method: 'get',
      params
    })
  }
  endPatrol(params) {
    return request({
      url: '/admin/patrol/endPatrol',
      method: 'get',
      params
    })
  }
  save(data){
    return request({
      url: '/admin/way/save',
      method: 'post',
      data
    })
  }
  update(data){
    return request({
      url: '/admin/way/update',
      method: 'post',
      data
    })
  }
  beDelete(params) {
    return request({
      url: '/admin/way/beDelete',
      method: 'get',
      params
    })
  }
  downloadQr(data){
    return request({
      url: '/admin/way/downloadQr',
      method: 'post',
      data,
      responseType: 'blob'
    })
  }
}


export const Inspection = new InspectionModel()
