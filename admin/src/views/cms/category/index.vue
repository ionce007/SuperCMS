<template>
  <div >
    <!-- 搜索区域 -->
    <div class="bg-fff radius-6 pd-20 mb-10">
      <el-form :inline="true" :model="params">
        <el-form-item label="名称" prop="keywords">
          <el-input
            placeholder="请输入栏目名称"
            :suffix-icon="Search"
            v-model="params.keywords"
            clearable
          />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="search" round>搜索</el-button>
          <el-button @click="clearSearch" round>清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="bg-fff radius-6 pd-20">

      <div class="flex justify-end">
        <router-link to="/category/add">
        <el-button type="primary" round>新增</el-button>
      </router-link>
      </div>
      <!-- //@selection-change="handleSelectionChange" -->
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        tooltip-effect="dark"
        row-key="name"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="loading"
      >
        <!-- <el-table-column type="selection"></el-table-column> -->

        <el-table-column
          prop="name"
          label="栏目名称"
          width="140"
        ></el-table-column>

        <el-table-column
          prop="id"
          align="center"
          label="编号"
        ></el-table-column>

        <el-table-column prop="type" label="类型" width="80">
          <template #default="scope">
            <p v-if="scope.row.type == 0">栏目</p>
            <p v-else>单页</p>
          </template>
        </el-table-column>

        <el-table-column prop="orderBy" align="center" label="排序">
          <template #default="scope">{{ scope.row.orderBy }}</template>
        </el-table-column>

        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <p v-if="scope.row.status == 0">显示</p>
            <p v-else>隐藏</p>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="160">
          <template #default="scope">
            <el-button
              :icon="View"
              circle
              @click="handleClick(scope.row)"
            ></el-button>
            <el-button
              :icon="Edit"
              circle
              @click="toEdit(scope.row)"
            ></el-button>
            <el-button
              :icon="Delete"
              circle
              @click="handleDel(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Edit, View, Search } from '@element-plus/icons-vue'
import { findSubId, destory, search as searchApi } from '@/api/category.js'
import { tree, addLabelValue } from '@/utils/tool.js'
import { useRouter } from 'vue-router'

const params = reactive({
  keywords: '',
})
const loading = ref(true)
const tableData = ref([])
const multipleTableRef = ref(null)
const multipleSelection = ref([])

const router = useRouter()

// 清空
const clearSearch = () => {
  params.keywords = ''
  tableData.value = []
  multipleSelection.value = []
  search()
}

// 查询
const search = async () => {
  try {
    const q = params.keywords
    const res = await searchApi(q)
    if (res.code === 200) {
      const data = tree(res.data)
      tableData.value = addLabelValue(data)
      loading.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

// 全选和反选
// const toggleSelection = rows => {
//   if (rows) {
//     rows.forEach(row => {
//       multipleTableRef.value.toggleRowSelection(row)
//     })
//   } else {
//     multipleTableRef.value.clearSelection()
//   }
// }

// // 选择
// const handleSelectionChange = val => {
//   multipleSelection.value = val
// }

// 编辑
const toEdit = e => {
  const id = e.id
  router.push({ name: 'category-edit', params: { id: id } })
}

// 查询是否有子栏目
const hasChild = async id => {
  try {
    const res = await findSubId(id)
    if (res.code === 200) {
      return res.data.length > 0
    }
  } catch (error) {
    console.log(error)
  }
  return false
}

// 删除
const del = async id => {
  try {
    const res = await destory(id)
    if (res.code === 200) {
      ElMessage({
        message: '删除成功 ^_^',
        type: 'success',
      })
      clearSearch()
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

// 跳转到首页
const handleClick = e => {
  let url
  if (e.type === 0) {
    url = `${location.origin}${e.path}/index.html`
  } else {
    url = `${location.origin}${e.path}/page.html`
  }
  window.open(url)
}

// 删除栏目  还需要判断是否当前栏目下面有文章？
const handleDel = async e => {
  const id = e.id
  const has = await hasChild(id)
  if (has) {
    ElMessage({
      message: '我下面还有栏目啊 ^_^',
      type: 'warning',
    })
    return
  }
  del(id)
}

onMounted(() => {
  search()
})
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 0px;
}
</style>
