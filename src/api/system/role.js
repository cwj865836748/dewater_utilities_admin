import request from '@/utils/request'

class RoleModel {
  /**
   * 获取角色列表
   */
  fetchList(params) {
    return request({
      url: '/admin/sys/role/list',
      method: 'get',
      params
    })
  }

  /**
   * 角色选择
   */
  select() {
    return request({
      url: '/admin/sys/role/select',
      method: 'get'
    })
  }

  /**
   * 角色详情
   */
  info(params) {
    return request({
      url: '/admin/sys/role/info',
      method: 'get',
      params
    })
  }

  /**
   * 创建角色
   */
  create(data) {
    return request({
      url: '/admin/sys/role/save',
      method: 'post',
      data
    })
  }

  /**
   * 编辑角色
   */
  edit(data) {
    return request({
      url: '/admin/sys/role/update',
      method: 'post',
      data
    })
  }

  /**
   * 删除角色
   */
  delete(data) {
    return request({
      url: '/admin/sys/role/delete',
      method: 'post',
      data
    })
  }
}

export const Role = new RoleModel()
