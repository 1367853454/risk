/**
 *  变量管理部分接口
 */

/**
 * 函数命名方式，以post开头则表示为post请求，以get开头表示为get请求
 */

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
    return axios.post(url, option, { timeout })
  }
}

/* 变量管理API接口****************************************************** */
/**
 * 获取数据类型，变量类型和业务列表
 * @param {Object} option 数据配置对象
 */
function getType(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/variable/params`, option, timeout)
}

/**
 * 变量管理列表查询
 * @param {Object} option 数据配置对象
 */
function postSerchVariableList(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/variable/search`, option, timeout)
}

/**
 * 变量新增
 * @param {Object} option
 */
function postVariableAdd(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/variable/variableadd`, option, timeout)
}

/**
 * 查询变量详情
 * @param {Object} option
 */
function getVariableInfoQuery(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/variable/rulevariableinfo`, option, timeout)
}

/**
 * 变量编辑
 * @param {Object} option
 */ 
function postVariableEdit(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/variable/variableupdate`, option, timeout)
}

const variableApiSet = new Set(
  [
    getType,
    postVariableAdd,
    postSerchVariableList,
    getVariableInfoQuery,
    postVariableEdit
  ]
)
// export default variableApiSet
