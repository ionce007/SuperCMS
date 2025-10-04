<template>
  <div class="bg-fff radius-6 pd-20">
    <el-form ref="formRef" :model="params" label-width="84px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="params.username" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
        ]"
      >
        <el-input v-model="params.password"></el-input>
      </el-form-item>

      <el-form-item
        label="角色"
        prop="role_id"
        :rules="[
          { required: true, message: '请选择角色', trigger: 'change' },
        ]"
      >
        <el-radio-group v-model="params.role_id">
          <el-radio
            :value="item.id"
            v-for="item in role"
            :key="item.id"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否显示">
        <el-radio v-model="params.status" value="1">启用</el-radio>
        <el-radio v-model="params.status" value="2">关闭</el-radio>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { update, detail } from '@/api/sys_user.js'
import { list } from '@/api/sys_role.js'
import { getCookie } from '@/utils/tool'
import { userStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const router = useRouter()
const params = reactive({
  id: '',
  username: '',
  password: '',
  status: '1',
  role_id: 0,
})

const role = ref([])
const cur = ref(1)

const listRoles = async () => {
  try {
    const res = await list(cur.value)
    if (res.code === 200) {
      role.value = res.data.list;
      console.log(role.value )
    }
  } catch (error) {
    console.log(error)
  }
}

const fetchDetail = async () => {
  try {
    const res = await detail(params.id)
    if (res.code === 200) {
      let data = res.data;
      data.role_id = parseInt(data.role_id)
      Object.assign(params, data) // 更新 params 对象
    }
  } catch (error) {
    console.error(error)
  }
}


const updateProfile = async () => {
  try {
    const { username } = params
    delete params.name
    delete params.value
    const res = await update(params)

    if (res.code == 200) {
      if (getCookie('username') == username) {
        ElMessage({
          message: '更新成功,请重新登录^_^',
          type: 'success',
        })
        const userInfo = userStore()
        userInfo.logout()
        location.reload()
      } else {
        router.go(-1)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const submit = formRef => {
  formRef.validate((valid,fields) => {
    if (valid) {
     updateProfile()
    } else {
      console.log('error submit!!', fields)
      return false
    }
  })
}
// 初始化时获取详情和角色列表
onMounted(async () => {
  params.id = router.currentRoute.value.params.id // 使用 Vue Router 的 currentRoute
  await listRoles()
  await fetchDetail()
})
</script>

<style scoped>
/* 添加样式 */
</style>
