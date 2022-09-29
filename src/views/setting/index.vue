<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-row :gutter="10">
            <el-button type="primary" style="margin-left: 10px;" icon="el-icon-plus" size="small" @click="addRole">新增角色</el-button>
          </el-row>
          <el-table
            v-loading="loading"
            style="width: 100%"
            :data="roleList"
          >
            <el-table-column
              label="序号"
              width="120"
              type="index"
            />
            <el-table-column
              label="角色名称"
              width="240"
              prop="name"
            />
            <el-table-column
              label="描述"
              prop="description"
            />

            <!--! 操作(分配权限 编辑 删除) -->
            <el-table-column label="操作" width="240">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-row type="flex" justify="end" align="middle" style="height:60px">
            <el-pagination
              v-if="total>0"
              background
              layout="prev, pager, next,sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2,5,10,15]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>

        </el-tab-pane>

        <!--! 公司信息  -->
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form :model="companyInfo" label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!--! 新增角色 -->
      <add-role ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
    </el-card>
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import addRole from './components/addRole.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'HrsaasIndex',
  components: { addRole },

  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      list: [],
      page: {
        page: 1,
        pagesize: 2
      },
      total: 0,
      roleList: [],
      loading: false,
      companyInfo: {}
    }
  },

  computed: {
    ...mapGetters(['companyId'])
  },

  created() {
    getRoleList()
    // getCompanyInfo()
  },

  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        // console.log(rows)
        // console.log(total)
        this.total = total
        this.roleList = rows
        // total 大于0 并且 rows的length === 0 这种情况并不是没有数据，重新发起请求
        if (total > 0 && rows.length === 0) {
          this.page.page--
          this.getRoleList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    },
    // 绑定点击事件
    // 拿到当前行这条数据
    // 回显在新增角色的组件上
    editRole(row) {
      // row 直接赋值给 addRole 的 formData
      // 地址一样 指的是同一个对象
      this.$refs.addRole.formData = { ...row }
      // this.$refs.addRole.formData = row
      this.dialogVisible = true
      // 优化 数据是引用类型 带来的问题
    },

    // 删除角色
    async delRow(id) {
      // delRow(id){
      //   this.$confirm('确认删除该角色？', '提示',{
      //     confirmButtonText: '确认',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(success =>{
      //     console.log('success')
      //   }).catch(cancel =>{
      //     console.log('cancel')
      //   })
      // }
      try {
        await this.$confirm('确认删除该角色？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // console.log('success')
        // 删除接口封装
        // 调用删除接口
        await deleteRole(id)
        // 刷新列表
        this.getRoleList()
      } catch (error) {
        console.log('cancel')
      }
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
      console.log(this.companyInfo)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
