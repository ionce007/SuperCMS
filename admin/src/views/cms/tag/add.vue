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
        <el-input v-model="params.name" placeholder="请输入汉字"></el-input>
      </el-form-item>

      <el-form-item label="标签标识">
        <el-input v-model="params.path" placeholder="模板使用标识"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { create, has } from '@/api/tag.js'
import { pinyin } from 'pinyin-pro'

const router = useRouter()

const formRef = ref(null)

const params = reactive({
  name: '',
  path: ''
})

const paramsRules = reactive({
  name: [
    { required: true, message: '请输入栏目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' }
  ]
})

// 监听 params.name 变化
watch(
  () => params.name,
  (newv) => {
    params.path = pinyin(newv, { toneType: 'none' }).replace(/\s+/g, '')
  }
)

// 新增
const createTag = async () => {
  try {
    const res = await create(params)
    if (res.code === 200) {
      ElMessage({
        message: '新增成功^_^',
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
          message: '标签已存在，请不要再添加了',
          type: 'error'
        })
      } else {
        createTag()
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
</script>

<style scoped>
/* 样式保持不变 */
</style>