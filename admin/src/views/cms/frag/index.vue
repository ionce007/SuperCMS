<template>
  <div>
    <!-- 搜索区域 -->
    <div class="bg-fff radius-6 pd-20 mb-10">
      <el-form :inline="true" :model="params" ref="formRef">
        <el-form-item label="标题" prop="keywords">
          <el-input
            placeholder="请输入内容"
            :suffix-icon="Search"
            clearable
            @clear="doSearch"
            v-model="params.keywords"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch" round>搜索</el-button>
          <el-button @click="clearSearch('formRef')" round>清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="bg-fff pd-20 radius-6">
      <div class="flex justify-end">
        <router-link class="mt-10" to="/frag/add">
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
        <el-table-column prop="id" width="60" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="mark" label="标识"></el-table-column>
        <el-table-column prop="createdAt" label="发布时间">
          <template #default="scope">{{ scope.row.createdAt }}</template>
        </el-table-column>
        <el-table-column fixed="right" width="120" label="操作">
          <template #default="scope">
            <el-button :icon="Edit" circle @click="toEdit(scope.row)"></el-button>
            <div class="inline-b ml-5">
              <el-popconfirm
                width="220"
                @confirm="handleDel(scope.row)"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon-color="#626AEF"
                title="确定删除吗？如果在使用，删掉会模板会报错"
              >
                <template #reference>
                  <el-button :icon="Delete" circle></el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-row type="flex" class="mt-20 align-c" justify="center">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="count"
        hide-on-single-page
      ></el-pagination>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { Delete, Edit,  Search } from '@element-plus/icons-vue'
import { search, del } from '@/api/frag.js'

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

// 清空搜索
const clearSearch = (str) => {
  if (str) {
    formRef.value.resetFields()
  }
  doSearch()
}

// 查询
const doSearch = async () => {
  try {
    const res = await search(cur.value, params.keywords)
    if (res.code === 200) {
      tableData.value = res.data.list
      count.value = res.data.count
    }
  } catch (error) {
    console.log(error)
  }
}

// 翻页
const handleCurrentChange = (e) => {
  cur.value = e
  doSearch()
}

// 切换选择
// const toggleSelection = (rows) => {
//   if (rows) {
//     rows.forEach((row) => {
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
const toEdit = (row) => {
  const id = row.id
  router.push({ name: 'frag-edit', params: { id } })
}

// 删除
const handleDel = async (row) => {
  const id = row.id
  try {
    const res = await del(id)
    if (res.code === 200) {
      ElMessage({
        message: '文章删除成功 ^_^',
        type: 'success'
      })
      search()
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

// 初始化加载数据
onMounted(() => {
  doSearch()
})
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 0px;
}
</style>
