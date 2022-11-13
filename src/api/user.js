import request from '@/utils/request'

// 获取验证码
export function getCapcha(data) {
  return request({
    url: '/account/anon/login/captcha',
    method: 'get'
  })
}

// 前台普通用户登录
export function loginFun(data) {
  return request({
    url: '/account/anon/front/login',
    method: 'post',
    data
  })
}

// 用户列表查询
export function getUserList(data) {
  return request({
    url: '/account/user/query',
    method: 'post',
    data
  })
}

// 公司列表查询
export function getCompanyList(data) {
  return request({
    url: '/account/company/list',
    method: 'post',
    data
  })
}

// 新增用户信息
export function addUser(data) {
  return request({
    url: '/account/user/add',
    method: 'post',
    data
  })
}

// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/account/user/update',
    method: 'post',
    data
  })
}

// 重制/更新用户密码
export function updatePassword(data) {
  return request({
    url: '/account/user/pwd/update',
    method: 'post',
    data
  })
}

// 删除用户信息
export function deleteUser(data) {
  return request({
    url: '/account/user/delete',
    method: 'post',
    data
  })
}

// 根据公司code获取燃烧炉总览
export function getFurncaeList(data) {
  return request({
    url: '/furncae-data/company/furncae-num/list',
    method: 'post',
    data
  })
}

// 根据公司code、燃烧炉号获取燃烧罐总览
export function getChamberList(data) {
  return request({
    url: '/furncae-data/company/furncae/chamber/list',
    method: 'post',
    data
  })
}
