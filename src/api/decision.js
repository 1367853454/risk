
import host from '../host.js'
import axios from 'axios'

function request(method = 'GET', url, option = {}) {
  if (method.toLowerCase() === 'get') {
    let temp = url + '?'
    for (const key of Object.keys(option)) {
      temp += `${key}=${option[key]}&`
    }
    return axios.get(temp.substring(0, temp.length - 1))
  } else {
    return axios.post(url, option)
  }
}

/**
 * 决策模拟：查询模拟列表页，查询业务，规则模拟，数据类型列表查询，订单查询，规则流程查询
 * @param {*} option 数据配置对象
 */
function getSimulationList(option) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/search`, option)
}

function getWorkParams(option) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/params`, option)
}

function postRuleSimulation(option) {
  return request('POST', `${host}/risk/api/admin/decisionsimulation/rulesimulation`, option)
}
function getDataType(option) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/datatype`, option)
}
function getOrderList(option) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/riskordersearch`, option)
}
function getRuleProcess(option) {
  return request('GET', `${host}/risk/api/admin/decisionsimulation/editSearch`, option)
}
/**
 * 决策统计：漏斗部分，统计下面部分，统计上面部分，规则包查询
 * @param {*} option 数据配置对象
 */
function getFunnel(option) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/funnel`, option)
}
function getStatistics(option) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/statistics`, option)
}
function getPackage(option) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/packagevo`, option)
}
function getPackageParams(option) {
  return request('GET', `${host}/risk/api/admin/decisionstatistics/params`, option)
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
