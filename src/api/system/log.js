import request from '@/utils/request'

/**
 * 操作日志
 */
class LogModel {
  /**
   * 获取列表
   * @param parmas
   */
  fetchList(params) {
    return request({
      url: '/admin/sys/log/list',
      method: 'get',
      params
    })
  }
}

export const Log = new LogModel()
