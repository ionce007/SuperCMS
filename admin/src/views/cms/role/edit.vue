<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form ref="paramsForm" :model="params" label-width="84px" class="mt-20">
      <el-form-item
        label="角色名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '名称长度在 2 到 50 个字符之间',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="params.name"></el-input>
      </el-form-item>

      <el-form-item label="角色值">
        <el-input v-model="params.value"></el-input>
      </el-form-item>

      <el-form-item label="是否显示">
        <el-radio v-model="params.status" value="1">启用</el-radio>
        <el-radio v-model="params.status" value="2">关闭</el-radio>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit('paramsForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { update, detail } from '@/api/sys_role.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const paramsForm = ref(null)
const params = reactive({
  id: 0,
  name: '',
  value: '',
  status: '1',
})

// 获取角色详情
const fetchRoleDetail = async () => {
  try {
    const res = await detail(params.id)
    if (res.code === 200) {
      Object.assign(params, res.data) // 更新 params 对象
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 更新角色信息
const updateRole = async () => {
  try {
    const res = await update(params)
    if (res.code === 200) {
      ElMessage({
        message: '更新成功^_^',
        type: 'success',
      })
      router.go(-1)
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// const handleAttr = e => {
//   console.log('e-->', e)
// }

// const handleSubCid = e => {
//   console.log('e-->', e)
// }

const submit = () => {
  paramsForm.value.validate(valid => {
    if (valid) {
      updateRole()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// 初始化时获取角色详情
onMounted(async () => {
  params.id = route.params.id // 使用 Vue Router 的 route
  await fetchRoleDetail()
})
</script>

<style scoped>
/* 添加样式 */
</style>
