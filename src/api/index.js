
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

/* 规则包管理API接口*************************************************** */
/**
 * 获取全部变量与变量处理
 */
function getAllVariables(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/package/variables`, option, timeout)
}

/**
 * 查询规则包列表
 */
function getPackageList(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/package/search`, option, timeout)
}

/**
 * 新增规则包
 */
function postPackageAdd(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/package/rulepackageadd`, option, timeout)
}

/**
 * 删除规则包
 */
function postPackageDelete(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/package/rulepackagedelete`, option, timeout)
}

/**
 * 规则包全部版本查询
 */
function getAllPackageVersion(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/package/versions`, option, timeout)
}

/**
 * 规则包发布接口
 * 入参：{ version, packageCode }
 */
function postPackageRelease(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/package/release`, option, timeout)
}
/**
 * 获得规则包详细信息
 */
function getPackageEditData(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/package/editsearch`, option, timeout)
}
/**
 * 获取规则包编辑前所需的下拉列表项
 */
function getPackageEditVariables(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk//api/admin/package/variables`, option, timeout)
}

/**
 * 规则状态变更
 */
function postRuleStateChange(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk//api/admin/package/startandstop`, option, timeout)
}

// 规则包更新
function postPackageUpdate(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/package/rulepackageupdate`, option, timeout)
}

// 删除规则
function postDeleteRule(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/package/ruledelete`, option, timeout)
}

// 规则包下线
function postPackageOff(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/package/offline`, option, timeout)
}

/* **********规则过程管理api */
/**
 * 获取规则流程列表
 * @param {Object} option
 * @param {number} timeout
 */
function getProcessList(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/process/search`, option, timeout)
}

/**
 * 删除规则流程
 * @param {Object} option
 * @param {number} timeout
 */
function postProcessDelete(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/process/ruleprocessdelete`, option, timeout)
}

/**
 * 新增规则流程
 * @param {Object} option
 * @param {number} timeout
 */
function postProcessAdd(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/process/ruleprocessadd`, option, timeout)
}

/**
 * 获取触发流程
 * @param {Object} option
 * @param {number} timeout
 */
function getTriggerLinkQery(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/process/triggerlink`, option, timeout)
}

/**
 * 规则流程管理
 * @param {*} option
 * @param {*} timeout
 */
function postProcessManage(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/process/ruleprocessmanage`, option, timeout)
}

// 规则包查询
function getPackageSearch(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/process/packagesearch`, option, timeout)
}

// 规则流程编辑
function postProcessEdit(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/process/edit`, option, timeout)
}

// 获取规则流程具体信息
function getProcessInfo(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/process/processinfo`, option, timeout)
}

// 规则流程下线
function postProcessOfflinee(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/process/offline`, option, timeout)
}

// 规则流程发布
function postProcessRelease(option, timeout = defaltTimeout) {
  return request('POST', `${host}/risk/api/admin/process/release`)
}

// 规则包管理查看
function getProcessPackage(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/process/package`, option, timeout)
}

const api = {
  getType,
  postVariableAdd,
  postSerchVariableList,
  getVariableInfoQuery,
  postVariableEdit,

  getAllPackageVersion,
  getAllVariables,
  getPackageList,
  postPackageAdd,
  postPackageDelete,
  postPackageRelease,
  getPackageEditData,
  getPackageEditVariables,
  postRuleStateChange,
  postPackageUpdate,
  postDeleteRule,
  postPackageOff,

  getProcessList,
  postProcessDelete,
  postProcessAdd,
  getTriggerLinkQery,
  postProcessManage,
  getPackageSearch,
  postProcessEdit,
  getProcessInfo,
  postProcessOfflinee,
  postProcessRelease,
  getProcessPackage
}

export default api
