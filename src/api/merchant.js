import request from '@/utils/request'


class MerchantModel {

  list(data) {
    return request({
      url: '/admin/merchant/list',
      method: 'post',
      data
    })
  }
  historyList(data) {
    return request({
      url: '/admin/merchant/history',
      method: 'post',
      data
    })
  }
  info(params) {
    return request({
      url: '/admin/merchant/info',
      method: 'get',
      params,
    })
  }
  save(data) {
    return request({
      url: '/admin/merchant/save',
      method: 'post',
      data
    })
  }
  update(data) {
    return request({
      url: '/admin/merchant/update',
      method: 'post',
      data
    })
  }
  beDelete(params) {
    return request({
      url: '/admin/merchant/beDelete',
      method: 'get',
      params,
    })
  }
  export(data) {
    return request({
      url: '/admin/merchant/export',
      method: 'post',
      data,
      responseType: 'blob'
    })
  }
  import(data) {
    return request({
      url: '/admin/merchant/import',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      isLoading: true
    })
  }
  merchantTypeList(data){
    return request({
      url: '/admin/merchantType/list',
      method: 'post',
      data
    })
  }
  merchantSelect(){
    return request({
      url: '/admin/merchantType/select',
    })
  }
  merchantSave(data){
    return request({
      url: '/admin/merchantType/save',
      method: 'post',
      data
    })
  }
  merchantUpdate(data){
    return request({
      url: '/admin/merchantType/update',
      method: 'post',
      data
    })
  }
  merchantDelete(data){
    return request({
      url: '/admin/merchantType/delete',
      method: 'post',
      data
    })
  }
  downloadMo(){
    return request({
      url: '/admin/merchant/download',
      responseType: 'blob'
    })
  }
}


export const Merchant = new MerchantModel()
