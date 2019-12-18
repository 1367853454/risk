
import host from '../host.js'
import axios from 'axios'
const defaltTimeout = 30 * 1000

/**
 * 统一post与get请求接口，避免get请求拼接query参数
 * @param {string} method 请求方式'POST'或'GET'
 * @param {stirng} url 请求地址
 * @param {Object} option 参数配置对象
 */
function request(method, url, option = {}, timeout) {
  if (method.toLowerCase() === 'get') {
    let temp = url + '?'
    for (const key of Object.keys(option)) {
      temp += `${key}=${option[key]}&`
    }
    return axios.get(temp.substring(0, temp.length - 1), { timeout })
  } else {
    // console.log(option)
    return axios.post(url, option, { timeout })
  }
}

/* 变量管理API接口****************************************************** */
/**
 * 获取用户状态列表
 * @param {Object} option 数据配置对象
 */
function getStatus(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/system/status`, option, timeout)
}

/**
 * 获取角色信息列表
 * @param {Object} option 数据配置对象
 */
function getRoleInfo(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/system/roleid`, option, timeout)
}

/**
 * 用户管理列表查询
 * @param {Object} option 数据配置对象
 */
function getUserSearchList(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/system/usersearch`, option, timeout)
}

/**
 * 用户新增
 * @param {Object} option 数据配置对象
 */
function postUserAdd(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/system/adduser`, option, timeout)
}

/**
 * 变更用户状态为启用
 * @param {Object} option 数据配置对象
 */
function postStartUsing(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/system/startusing`, option, timeout)
}

/**
 * 变更用户状态为停用
 * @param {Object} option 数据配置对象
 */
function postStopUsing(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/system/stopusing`, option, timeout)
}

/**
 * 获取单个用户具体信息
 * @param {Object} option 数据配置对象
 */
function getUserInfo(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/system/usercheckandedit`, option, timeout)
}

/**
 * 用户编辑
 * @param {Object} option 数据配置对象
 */
function postUserEdit(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/system/edituser`, option, timeout)
}

/**
 * 角色列表页查询
 * @param {Object} option 数据配置对象
 */
function getRoleSearchList(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/system/rolesearch`, option, timeout)
}

/**
 * 角色新增
 * @param {Object} option 数据配置对象
 */
function postRoleAdd(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/system/addrole`, option, timeout)
}

/**
 * 获取所有权限
 * @param {Object} option 数据配置对象
 */
function getPermissionTree(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/system/permissiontree`, option, timeout)
}

/**
 * 获取一个角色所有的权限
 * @param {Object} option 数据配置对象
 */
function getOneRolePermission(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/system/rolepermission`, option, timeout)
}

/**
 * 用户密码修改
 * @param {Object} option 数据配置对象
 */
function postUserPasswordEdit(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/system/changepassword`, option, timeout)
}

/**
 * 授权提交
 * @param {Object} option 数据配置对象
 */
function postEditPermission(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/system/editrolepermission`, option, timeout)
}

const api = {
  getStatus,
  getRoleInfo,
  postUserAdd,
  getUserSearchList,
  postStartUsing,
  postStopUsing,
  getUserInfo,
  postUserEdit,
  getRoleSearchList,
  postRoleAdd,
  getPermissionTree,
  getOneRolePermission,
  postUserPasswordEdit,
  postEditPermission
}

export default api
