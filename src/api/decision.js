
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

/**
 * 查询模拟列表页
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getSimulationList(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/search`, option, timeout)
}

/**
 * 查询业务
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getWorkParams(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/params`, option, timeout)
}

/**
 * 规则模拟
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function postRuleSimulation(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/decisionsimulation/rulesimulation`, option, timeout)
}

/**
 * 数据类型列表查询
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getDataType(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/datatype`, option, timeout)
}

/**
 * 订单查询
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getOrderList(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/riskordersearch`, option, timeout)
}

/**
 * 规则流程查询
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getRuleProcess(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/editSearch`, option, timeout)
}

/**
 * 漏斗部分
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getFunnel(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/funnel`, option, timeout)
}

/**
 * 统计下面部分
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getStatistics(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/statistics`, option, timeout)
}

/**
 * 统计上面部分
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getPackage(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/packagevo`, option, timeout)
}

/**
 * 规则包查询
 * @param option
 * @param timeout
 * @returns {AxiosPromise<any>}
 */
function getPackageParams(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/params`, option, timeout)
}

const api = {
  getSimulationList,
  getWorkParams,
  postRuleSimulation,
  getDataType,
  getOrderList,
  getRuleProcess,
  getFunnel,
  getStatistics,
  getPackage,
  getPackageParams
}

export default api
