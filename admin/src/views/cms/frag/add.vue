<template>
  <div class="bg-fff pd-20 radius-6">
    <el-form
      ref="formRef"
      :model="params"
      :rules="paramsRules"
      label-width="84px"
      class="mt-20"
      v-loading="loading"
    >
      <div>
        <el-form-item label="碎片名称" prop="name">
          <el-input v-model="params.name" placeholder="请输入汉字"></el-input>
        </el-form-item>

        <el-form-item label="碎片标识" prop="mark">
          <el-input v-model="params.mark" placeholder="模板使用标识"></el-input>
        </el-form-item>

        <el-form-item label="碎片类型" prop="type">
          <el-radio-group v-model="params.type" class="ml-4">
            <el-radio :label="1">富文本</el-radio>
            <el-radio :label="2">文本框</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="碎片内容" v-if="params.type === 1">
          <vue3-tinymce
            v-model="params.content"
            :setting="setting"
            @init="tinymce"
            script-src="/public/admin/tinymce/tinymce.min.js"
          />
        </el-form-item>

        <el-form-item label="碎片内容" v-if="params.type === 2">
          <el-input
            type="textarea"
            prop="textarea"
            class="textarea"
            :rows="3"
            v-model="params.content"
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { create } from '@/api/frag.js'
import Vue3Tinymce from '@/components/Vue3Tinymce/src/Main.vue'
import { tinymceSet } from '@/config/tinymce.js'
import { pinyin } from 'pinyin-pro'
import { uploadUrl } from '@/api/upload.js'

const router = useRouter()
const formRef = ref(null)

const setting = reactive(tinymceSet)
const loading = ref(true)

const params = reactive({
  type: 1,
  name: '',
  mark: '',
  content: '欢迎使用SuperCMS系统'
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
    params.mark = pinyin(newv, { toneType: 'none' }).replace(/\s+/g, '')
  }
)

// 初始化上传 URL
onMounted(async () => {
  setting.images_upload_url = await uploadUrl()
  loading.value = false
})

// TinyMCE 初始化
const tinymce = () => {
  loading.value = false
}


// 新增
const createFragment = async () => {
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
    console.log(error)
  }
}

// 提交表单
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      createFragment()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
</script>

<style scoped>
:deep(.tiny-textarea) {
  height: 436px;
}
</style>
