<template>
  <div>
    <!-- 搜索区域 -->
    <div class="bg-fff radius-6 pd-20 mb-10">
      <el-form :inline="true" :model="params" label-width="68px" ref="formRef">
        <el-form-item label="栏目筛选" prop="categorySelected">
          <el-cascader
            :show-all-levels="false"
            v-model="params.categorySelected"
            :options="category"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="标题" prop="keywords">
          <el-input
            placeholder="请输入文章标题"
            :suffix-icon="Search"
            v-model="params.keywords"
            clearable
            @clear="clearSearch"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doSearch" round>搜索</el-button>
          <el-button @click="clearSearch('formRef')" round>清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="radius-6 bg-fff pd-20">
      <div class="flex justify-between align-c">
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="此操作将永久删除, 是否继续?"
          @confirm="delSome"
          @cancel="cancelEvent"
        >
          <template #reference>
            <el-button>删除</el-button>
          </template>
        </el-popconfirm>
        <router-link class="mt-10" to="/article/add">
          <el-button type="primary" round>新增</el-button>
        </router-link>
      </div>

      <el-table
        ref="multipleTableRef"
        :data="tableData"
        tooltip-effect="dark"
        row-key="id"
        @selection-change="handleSelectionChange"
        v-loading="loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="编号" width="80" fixed></el-table-column>
        <el-table-column prop="title" label="标题">
          <template #default="scope">
            <a class="block" v-if="scope.row.status === 0" :href="scope.row.type == '0'? `${domain}/article-${scope.row.id}.html`: `${domain}${scope.row.path}/page-${scope.row.id}.html`" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="栏目" width="80"></el-table-column>
        <el-table-column rop="createdAt" label="更新时间" width="170"></el-table-column>
        <el-table-column prop="status" label="状态" width="60">
          <template #default="scope">{{scope.row.status == 0 ? '显示' : '隐藏'}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
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
      <!-- 分页 -->
      <el-row type="flex" class="mt-20" justify="space-between">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="20"
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
import { useRouter, useRoute } from 'vue-router'
import { Delete, Edit, View, Search, InfoFilled } from '@element-plus/icons-vue'
import { search, del } from '@/api/article.js'
import { find } from '@/api/category.js'
import { addLabelValue, tree } from '@/utils/tool.js'

const router = useRouter()
const route = useRoute()

const domain = ref(location.origin)
const formRef = ref(null)
const multipleTableRef = ref(null)
const loading = ref(true)
const tableData = ref([])
const multipleSelection = ref([])
const count = ref(0)
const cur = ref(1)
const cid = ref(0)
const category = ref([])

const params = reactive({
  keywords: '',
  categorySelected: [],
})

// 清空搜索
const clearSearch = str => {
  if (str) {
    formRef.value.resetFields()
  }
  router.replace({
    name: 'article-index',
    query: { cur: 1, cid: 0, keywords: '' },
  })
  cur.value = 1
  params.keywords = ''
  cid.value = 0
  searchArticles()
}

// 执行搜索
const doSearch = () => {
  router.replace({
    name: 'article-index',
    query: { cur: cur.value, cid: cid.value, keywords: params.keywords },
  })
  searchArticles()
}

// 查询文章
const searchArticles = async () => {
  try {
    loading.value = true
    const res = await search(cur.value, params.keywords, cid.value)
    if (res.code === 200) {
      tableData.value = [...res.data.list]
      count.value = res.data.count
      cur.value = res.data.current
      loading.value = false
    }
  } catch (error) {
    console.error(error)
  }
}

// 翻页
const handleCurrentChange = e => {
  cur.value = e
  doSearch()
}

// 切换选中项
const toggleSelection = rows => {
  if (rows) {
    rows.forEach(row => {
      multipleTableRef.value.toggleRowSelection(row)
    })
  } else {
    multipleTableRef.value.clearSelection()
  }
}

// 处理选中变化
const handleSelectionChange = val => {
  multipleSelection.value = val
}

// 查询分类
const queryCategory = async () => {
  try {
    const res = await find()
    if (res.code === 200) {
      const dataTree = addLabelValue(tree(res.data))
      category.value = [...dataTree]
    }
  } catch (error) {
    console.error(error)
  }
}

// 选择栏目
const handleChange = e => {
  cid.value = e[e.length - 1]
}

// 跳转到编辑
const toEdit = e => {
  router.push({ name: 'article-edit', params: { id: e.id } })
}

// 取消事件
const cancelEvent = () => {}

// 删除所选项
const delSome = async () => {
  const ids = multipleSelection.value.map(item => item.id).join(',')
  try {
    const res = await del(ids)
    if (res.code === 200) {
      ElMessage({
        message: '删除成功 ^_^',
        type: 'success',
      })
      searchArticles()
    }
  } catch (error) {
    console.error(error)
  }
}

// 查看详情
const handleClick = e => {
  const url =
    e.type == '0'
      ? `${domain.value}/article-${e.id}.html`
      : `${domain.value}${e.path}/page-${e.id}.html`
  window.open(url)
}

// 删除文章
const handleDel = e => {
  ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await del(e.id)
        if (res.code === 200) {
          ElMessage({
            message: '文章删除成功 ^_^',
            type: 'success',
          })
          searchArticles()
        }
      } catch (error) {
        console.error(error)
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

// 初始化查询参数
watch(
  () => route.query,
  newQuery => {
    cur.value = newQuery.cur
    cid.value = newQuery.cid
    params.keywords = newQuery.keywords || ''
    searchArticles()
  },
  { immediate: true },
)

onMounted(() => {
  queryCategory()
})
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 0px;
}

:deep(a) {
  color: #1f1f1f;
}

:deep(a:hover) {
  color: #165dff;
}
</style>
