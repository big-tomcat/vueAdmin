import request from '@/utils/request'
const group_name = 'gathering'
// eslint-disable-next-line no-unused-vars
const api_name = 'gathering'
export default {
  getList() {
    return request({
      // url: '/gathering/gathering',
      // eslint-disable-next-line no-undef
      url: `/${group_name}/${api_name}`,
      method: 'get'
    })
  },
  search(page, size, searchMap) {
    return request({
      // url: '/gathering/search/'+page+'/'+size,
      url: `/${group_name}/${api_name}/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
  save(pojo) {
    return request({
      url: `/${group_name}/${api_name}`,
      method: 'post',
      data: pojo
    })
  },
  findById(id) {
    return request({
      url: `/${group_name}/${api_name}/${id}`,
      method: 'get'
    })
  },
  update(id, pojo) {
    // eslint-disable-next-line eqeqeq
    if (id == null || id == '') {
      // eslint-disable-next-line no-undef
      return this.save(pojo)
    }
    return request({
      url: `/${group_name}/${api_name}/${id}`,
      method: 'put',
      data: pojo
    })
  },
  deleteById(id) {
    return request({
      url: `/${group_name}/${api_name}/${id}`,
      method: 'delete'
    })
  }
}
