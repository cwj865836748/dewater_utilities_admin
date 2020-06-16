import i18n from '@/lang'

export const RETURN_CODE = {
  SUCCESS: 200,
  TOKEN_FAIL: 401,
  NO_DATA: 202,
  ERROR: 404,
  FAIL: 500
}

// 权限类型
export const ruleType = [
  {label: i18n.t('common.directory'), value: 0, type: 'success'},
  {label: i18n.t('common.menu'), value: 1, type: ''},
  {label: i18n.t('common.button'), value: 2, type: 'info'}
]


// 是否类型
export const booleanType = [
  {label: i18n.t('common.yes'), value: true, type: 'success'},
  {label: i18n.t('common.no'), value: false, type: 'danger'}
]

export const hiddenType = [
  {label: i18n.t('common.yes'), value: true, type: 'success'},
  {label: i18n.t('common.no'), value: false, type: 'danger'}
]
// 用户状态
export const userStatus = [
  {label: i18n.t('common.normal'), value: 1, type: 'success'},
  {label: i18n.t('common.disabled'), value: 0, type: 'danger'}
]

// 设置类型
export const settingType = [
  {label: 'string', value: 0, type: ''},
  {label: 'text', value: 1, type: ''},
  {label: 'int', value: 2, type: ''},
  {label: 'boolean', value: 3, type: ''},
  // {label: 'array', value: 4, type: ''},
  // {label: 'datetime', value: 5, type: ''},
  // {label: 'date', value: 6, type: ''},
  {label: 'file', value: 7, type: ''},
  {label: 'editor', value: 8, type: ''}
]

// 版本类型
export const appVersionType = [
  {label: 'iOS', value: 1, type: 'success'},
  {label: 'Android', value: 2, type: 'primary'}
]

// 日期格式化默认为 yyyy-MM-dd HH:mm:ss
// export const formatDate = 'dd-MM-yyyy HH:mm:ss'
export const formatDate = 'yyyy-MM-dd HH:mm:ss'

export const imgUpload = '/admin/public/upload/uploadFile'

