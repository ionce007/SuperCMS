<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form
      ref="formRef"
      :model="params"
      :rules="paramsRules"
      label-width="84px"
      class="mt-20"
    >
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="params.name"></el-input>
      </el-form-item>

      <el-form-item label="标签标识">
        <el-input v-model="params.path"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { update, detail, has } from '@/api/tag.js'
import { pinyin } from 'pinyin-pro'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const params = reactive({
  id: 0,
  name: '',
  path: ''
})

const paramsRules = reactive({
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 8, message: '名称长度在 2 到 8 个字符之间', trigger: 'blur' }
  ]
})

// 监听 params.name 变化
watch(
  () => params.name,
  (newv) => {
    params.path = pinyin(newv, { toneType: 'none' }).replace(/\s+/g, '')
  }
)

// 获取标签详情
const fetchDetail = async () => {
  try {
    const res = await detail(params.id)
    if (res.code === 200) {
      Object.assign(params, res.data)
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 更新标签
const updateTag = async () => {
  try {
    const res = await update(params)
    if (res.code === 200) {
      ElMessage({
        message: '更新成功^_^',
        type: 'success'
      })
      router.go(-1)
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 检查标签是否存在
const checkTagExistence = async () => {
  try {
    const res = await has(params.path)
    if (res.code === 200) {
      if (res.data) {
        ElMessage({
          message: '标签已存在，修改无效',
          type: 'error'
        })
      } else {
        updateTag()
      }
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 提交表单
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      checkTagExistence()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// 初始化获取标签详情
onMounted(async () => {
  params.id = parseInt(route.params.id, 10)
  await fetchDetail()
})
</script>

<style scoped>
/* 样式保持不变 */
</style>