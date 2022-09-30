<template>
  <div class="departments-container">
    <el-card>
      <tree-tools :tree-node="company" :is-root="false" @addDept="handleAddDept" />
    </el-card>

    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tools slot-scope="{data}" :tree-node="data" @addDept="handleAddDept" />
    </el-tree>

    <!--! 新增部门 -->
    <add-dept :dialog-visble.sync="dialogVisble" :tree-node="currentNode" />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import treeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'HrsaasIndex',
  components: { treeTools, addDept },

  data() {
    return {
      dialogVisble: false,
      currentNode: {},
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }
    }
  },

  mounted() {
    this.getDepartments()
  },

  // created() {
  //   this.getDepartments() // 调用自身的方法
  // },

  methods: {
    // 拿组织架构大的数据
    async getDepartments() {
      const { depts, companyManage, companyName } = await getDepartments()
      // this.departs = depts
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage }
      this.company = { name: companyName, manager: '负责人', id: '' }
    },
    handleAddDept(node) {
      // addDept 显示
      // addDept 组件引入
      // addDept组件 绑定变量 dialogVisble
      this.dialogVisble = true
      this.currentNode = node
    }

  }
}
</script>

<style lang="scss">
  .departments-container {
    width: 900px;
    margin: 20px auto;
    .el-tree {
      .el-tree-node__content {
        // padding-right: 20px;
      }
    }
  }
  </style>
