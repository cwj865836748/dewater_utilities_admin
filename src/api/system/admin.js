import request from '@/utils/request'

class AdminModel {
  /**
   * 登录
   * @param data
   */
  logIn(data) {
    return request({
      url: '/admin/sys/login',
      method: 'post',
      data
    })
  }

  /** *
   * 找回密码验证码发送
   * @param data
   */
  sendEmailCode(data) {
    return request({
      url: '/admin/sys/sendEmailCode',
      method: 'post',
      data,
      isLoading: true
    })
  }

  /**
   * 找回密码-密码重置
   * @param data
   */
  resetPassword(data) {
    return request({
      url: '/admin/sys/resetPassword',
      method: 'post',
      data
    })
  }

  /**
   * 获取当前登录用户信息
   * @param token
   */
  getInfo() {
    return request({
      url: '/admin/sys/user/loginInfo',
      method: 'get'
    })
  }

  /**
   * 用户详情
   */
  info(params) {
    return request({
      url: '/admin/sys/user/info',
      method: 'get',
      params
    })
  }

  /**
   * 获取导航菜单
   * @param token
   */
  getMenu() {
    return request({
      url: '/admin/sys/menu/nav',
      method: 'get'
    })
  }

  /**
   * 修改/重置密码
   */
  modifyPwd(data) {
    return request({
      url: '/admin/sys/user/password',
      method: 'post',
      data
    })
  }

  /**
   * 管理员列表
   * @param params
   */
  fetchList(params) {
    return request({
      url: '/admin/sys/user/list',
      method: 'get',
      params
    })
  }

  /**
   * 添加用户
   * @param data
   */
  create(data) {
    return request({
      url: '/admin/sys/user/save',
      method: 'post',
      data
    })
  }

  /**
   * 删除用户
   * @param data
   */
  delete(data) {
    return request({
      url: '/admin/sys/user/delete',
      method: 'post',
      data
    })
  }

  /**
   * 修改用户
   * @param data
   */
  edit(data) {
    return request({
      url: '/admin/sys/user/update',
      method: 'post',
      data
    })
  }
}

export const Admin = new AdminModel()
