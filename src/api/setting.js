import request from '@/utils/request'

export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    params
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

// 编辑角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 公司信息接口
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
