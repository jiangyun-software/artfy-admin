import request from '@/utils/request'

// 账号列表
export function accountListApi(params) {
  return request({
    url: '/member/list',
    method: 'get',
    params: params,
  })
}

// 启用禁用账号
export function accountDisableApi(account) {
  return request({
    url: '/member/disable',
    method: 'post',
    data: account,
  })
}

// 查询产品
export function productListApi(params) {
  return request({
    url: '/product',
    method: 'get',
    params: params,
  })
}

// 新增/修改产品
export function productEditApi(data) {
  return request({
    url: '/product',
    method: 'post',
    data: data,
  })
}

// 查询套餐
export function comboListApi(params) {
  return request({
    url: '/combo',
    method: 'get',
    params: params,
  })
}

// 新增/修改套餐
export function comboEditApi(data) {
  return request({
    url: '/combo',
    method: 'post',
    data: data,
  })
}

// 删除套餐
export function comboDeleteApi(id) {
  return request({
    url: '/combo/' + id,
    method: 'delete',
  })
}

// 订单查询
export function orderListApi(params) {
  return request({
    url: '/order',
    method: 'get',
    params: params
  })
}

// 接口调用记录
export function apiLogApi(params) {
  return request({
    url: '/apiLog',
    method: 'get',
    params: params
  })
}

// 获取oss签名地址
export function getSingnatureUrlsApi(urls) {
  return request({
    url: '/ali/getSingnatureUrls',
    method: 'get',
    params: { urls: urls }
  })
}

// 修改会员备注
export function memberRemarkApi(params) {
  return request({
    url: '/member/remark',
    method: 'post',
    data: params
  })
}

// 修改会员点数
export function memberPointApi(params) {
  return request({
    url: '/member/point',
    method: 'post',
    data: params
  })
}

// 查询全部ai作画风格
export function paintingStyleTreeApi(type) {
  return request({
    url: '/aiPaintingStyle/' + type,
    method: 'get'
  })
}

// 新增修改ai作画风格
export function paintingStyleEditApi(params) {
  return request({
    url: '/aiPaintingStyle',
    method: 'post',
    data: params
  })
}

// 删除ai作画风格
export function paintingStyleDeleteApi(id) {
  return request({
    url: '/aiPaintingStyle/' + id,
    method: 'delete'
  })
}

// 获取oss上传签名
export function getStaticUploadSingnatureApi() {
  return request({
    url: '/ali/getStaticUploadSingnature',
    method: 'get',
  });
}

// 照片打印订单列表
export function photoOrderListApi(params) {
  return request({
    url: '/photoOrder',
    method: 'get',
    params: params,
  });
}

// 照片打印订单列表
export function photoOrderRefundApi(id) {
  return request({
    url: '/photoOrder/refund/' + id,
    method: 'get',
  });
}

// 查询轮播图
export function swiperListApi(params) {
  return request({
    url: '/swiper',
    method: 'get',
    params: params,
  })
}

// 新增/修改轮播图
export function swiperEditApi(data) {
  return request({
    url: '/swiper',
    method: 'post',
    data: data,
  })
}

// 删除轮播图
export function swiperDeleteApi(id) {
  return request({
    url: '/swiper/' + id,
    method: 'delete',
  })
}

// 查询风格标签
export function styleTagTreeApi() {
  return request({
    url: '/styleTag',
    method: 'get',
  })
}

// 新增修改风格标签
export function styleTagEditApi(styleTag) {
  return request({
    url: '/styleTag',
    method: 'post',
    data: styleTag
  })
}

// 删除风格标签
export function styleTagDeleteApi(id) {
  return request({
    url: '/styleTag/' + id,
    method: 'delete',
  })
}