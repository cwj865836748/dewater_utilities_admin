import request from '@/utils/request'

class AppVersionModel {
  /**
   * 获取单位时间节点列表
   */
  fetchList(data) {
    return request({
      url: '/admin/appVersion/list',
      method: 'post',
      data
    })
  }

  /**
   * 添加单位时间节点
   */
  create(data) {
    return request({
      url: '/admin/appVersion/save',
      method: 'post',
      data
    })
  }

  /**
   * 编辑单位时间节点
   */
  edit(data) {
    return request({
      url: '/admin/appVersion/update',
      method: 'post',
      data
    })
  }

  /**
   * 删除单位时间节点
   */
  delete(params) {
    return request({
      url: '/admin/appVersion/delete',
      method: 'get',
      params
    })
  }

  // 详情
  info(params) {
    return request({
      url: '/admin/appVersion/info',
      method: 'get',
      params
    })
  }
}

export const AppVersion = new AppVersionModel()
