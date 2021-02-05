import request from '@/utils/request'


class UserModel {

  list(data) {
    return request({
      url: '/admin/user/list',
      method: 'post',
      data
    })
  }

  userInfo(params) {
    return request({
      url: '/admin/user/info',
      method: 'get',
      params,
    })
  }
  updateIdentity(params) {
    return request({
      url: '/admin/user/updateIdentity',
      method: 'get',
      params,
    })
  }
  updateUserName(params) {
    return request({
      url: '/admin/user/updateUserName',
      method: 'get',
      params,
    })
  }
  bindStreet(data) {
    return request({
      url: '/admin/user/bindStreet',
      method: 'post',
      data
    })
  }
  selectAdmin(data) {
    return request({
      url: '/admin/user/selectAdmin',
      method: 'post',
      data
    })
  }
  updateBelongAdmin(params) {
    return request({
      url: '/admin/user/updateBelongAdmin',
      method: 'get',
      params
    })
  }
  selectWorkerDataList(data){
    return request({
      url: '/admin/user/selectWorkerDataList',
      method: 'post',
      data
    })
  }
  exportWorkerData(data){
    return request({
      url: '/admin/user/exportWorkerData',
      method: 'post',
      data,
      responseType: 'blob'
    })
  }
}


export const User = new UserModel()
