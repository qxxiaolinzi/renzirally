<template>
  <el-dialog
    :title="title"
    width="60%"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="formData"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required:true,message:'角色必填',trigger:'blur'}]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  name: 'HrsaasAddRole',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        name: '',
        description: ''
      },
      loading: false
    //   rules: {
    //     name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
    //   }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    handleClose() {
      // 表单效果重置
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.resetFields()
      this.formData = {
        name: '',
        description: ''
      }
    },
    async submit() {
      try {
        await this.$refs.roleDialogForm.validate()
        // 接口
        this.loading = true
        this.formData.id ? await updateRole(this.formData) : await addRole(this.formData)
        // 实现编辑功能
        // 1.编辑接口封装
        // 2.formData.id 存在与否 判断当前处于编辑还是新增
        // 3.编辑模式 调用编辑接口  新增模式 调用新增接口
        this.$emit('refreshList')
        this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
        // 优化点
        // 1.当打开新增的时候 id 是否会混乱（数据清楚）
        // 2.dialog 标题显示
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
