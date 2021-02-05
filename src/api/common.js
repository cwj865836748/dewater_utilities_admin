import request from '@/utils/request'

// 公共类
class CommonModel {
  /**
   * 上传文件
   * @param data
   */
  uploadFile(data) {
    return request({
      url: '/admin/public/upload/uploadFile',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      isLoading: true
    })
  }

  statistics(params) {
    return request({
      url: '/admin/common/statistics',
      method: 'get',
      params,
    })
  }


}


export const Common = new CommonModel()
