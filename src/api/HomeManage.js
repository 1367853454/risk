
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
 * 获取今日数据
 * @param {Object} option 数据配置对象
 */
function getToday(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/home/today`, option, timeout)
}
/**
 * 获取统计数据
 * @param {Object} option 数据配置对象
 */
function getSearch(option, timeout = defaltTimeout) {
  return request('GET', `${host}/risk/api/admin/home/search`, option, timeout)
}

const api = {
  getToday,
  getSearch
}

export default api
