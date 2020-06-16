import request from '@/utils/request'

class RuleModel {
  /**
   * 获取权限列表
   */
  fetchList() {
    return request({
      url: '/admin/sys/menu/list',
      method: 'get'
    })
  }

  /**
   * 权限选择
   */
  select() {
    return request({
      url: '/admin/sys/menu/select',
      method: 'get'
    })
  }

  /**
   * 权限详情
   */
  info(params) {
    return request({
      url: '/admin/sys/menu/info',
      method: 'get',
      params
    })
  }

  /**
   * 创建权限
   */
  create(data) {
    return request({
      url: '/admin/sys/menu/save',
      method: 'post',
      data
    })
  }

  /**
   * 编辑权限
   */
  edit(data) {
    return request({
      url: '/admin/sys/menu/update',
      method: 'post',
      data
    })
  }

  /**
   * 删除权限
   */
  delete(params) {
    return request({
      url: '/admin/sys/menu/delete',
      method: 'get',
      params
    })
  }
}

export const Rule = new RuleModel()
