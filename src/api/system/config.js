import request from '@/utils/request'

class ConfigModel {
  /**
   * 获取系统配置分类
   * @param params
   */
  fetchCateList() {
    return request({
      url: '/admin/sys/config/configCategoryList',
      method: 'get'
    })
  }

  /**
   * 创建系统配置分类
   * @param data
   */
  createCate(data) {
    return request({
      url: '/admin/sys/config/addCategory',
      method: 'post',
      data
    })
  }

  // 系统配置列表
  fetchList(data) {
    return request({
      url: '/admin/sys/config/list',
      method: 'post',
      data
    })
  }

  /**
   * 获取系统配置详情
   */
  info(params) {
    return request({
      url: '/admin/sys/config/info',
      method: 'get',
      params
    })
  }

  /**
   * 添加系统配置项
   * @param data
   */
  create(data) {
    return request({
      url: '/admin/sys/config/save',
      method: 'post',
      data
    })
  }

  /**
   * 修改系统配置项值
   * @param data
   */
  edit(data) {
    return request({
      url: '/admin/sys/config/update',
      method: 'post',
      data
    })
  }

  /**
   * 系统配置上传文件
   * @param data
   */
  uploadImage(data) {
    return request({
      url: '/admin/sys/config/uploadImage',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      isLoading: true
    })
  }
}

export const Config = new ConfigModel()
