<template>
  <div>
    <div class="bg-fff radius-6 pd-20 mb-10">
      <el-form :inline="true" :model="params" ref="formRef">
        <el-form-item label="标题" prop="keywords">
          <el-input
            placeholder="请输入内容"
            :suffix-icon="Search"
            clearable
            @clear="clearSearch"
            v-model="params.keywords"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch" round>搜索</el-button>
          <el-button @click="clearSearch('formRef')" round>清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="bg-fff radius-6 pd-20">
      <div class="flex justify-end align-c">
        <router-link to="/tag/add">
          <el-button type="primary" round>新增</el-button>
        </router-link>
      </div>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        tooltip-effect="dark"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="path" label="标识"></el-table-column>

        <el-table-column fixed="right" width="100" label="操作">
          <template #default="scope">
            <el-button
              :icon="Edit"
              circle
              @click="navigateToEdit(scope.row)"
            ></el-button>
            <el-button
              :icon="Delete"
              circle
              @click="deleteTag(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" class="mt-20 align-c" justify="center">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handlePageChange"
          :page-size="10"
          :total="count"
          v-model:currentPage="cur"
          hide-on-single-page
        ></el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Delete, Edit,  Search } from '@element-plus/icons-vue'
import { search, del } from '@/api/tag.js'

const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const multipleTableRef = ref(null)

const params = reactive({
  keywords: ''
})

const tableData = ref([])
const multipleSelection = ref([])
const count = ref(0)
const cur = ref(1)

// 初始化加载数据
onMounted(() => {
  const { cur: current = 1, keywords = '' } = route.query
  cur.value = parseInt(current, 10)
  params.keywords = keywords
  fetchData()
})

// 监听路由变化
watch(route, (to, from) => {
  if (to.name === 'tag-index') {
    const { cur: current, keywords } = to.query
    cur.value = parseInt(current, 10)
    params.keywords = keywords
    fetchData()
  }
})

// 清空搜索
const clearSearch = (str) => {
  if (str) {
    formRef.value.resetFields()
  }
  router.replace({
    name: 'tag-index',
    query: { cur: 1, keywords: '' }
  })
  fetchData()
}

// 查询
const fetchData = async () => {
  try {
    const res = await search(cur.value, params.keywords)
    if (res.code === 200) {
      tableData.value = res.data.list
      count.value = res.data.count
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// 搜索
const doSearch = () => {
  router.replace({
    name: 'tag-index',
    query: { cur: cur.value, keywords: params.keywords }
  })
  fetchData()
}

// 翻页
const handlePageChange = (e) => {
  cur.value = parseInt(e, 10)
  doSearch()
}

// 切换选择
// const toggleSelection = (rows) => {
//   if (rows) {
//     rows.forEach(row => {
//       multipleTableRef.value.toggleRowSelection(row)
//     })
//   } else {
//     multipleTableRef.value.clearSelection()
//   }
// }

// 选择改变
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 编辑跳转
const navigateToEdit = (row) => {
  const id = row.id
  router.push({ name: 'tag-edit', params: { id } })
}

// 删除
const deleteTag = async (row) => {
  const id = row.id
  try {
    const res = await del(id)
    if (res.code === 200) {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: '删除成功 ^_^',
        type: 'success'
      })
      fetchData()
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 0px;
}
</style>
