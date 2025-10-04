<template>
  <div class="bg-fff radius-6 pd-20">
    <el-row type="flex" justify="end">
      <router-link to="/collect/add">
        <el-button type="primary" round>新增</el-button>
      </router-link>
    </el-row>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" width="60" label="编号"></el-table-column>
      <el-table-column prop="taskName" label="任务名称"> </el-table-column>
      <el-table-column prop="category" label="所属栏目"> </el-table-column>
      <el-table-column prop="charset" label="编码">
        <template #default="scope">{{
          scope.row.charset === 1 ? "UTF-8" : "GB2312"
        }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">{{
          scope.row.status === 1 ? "草稿" : "发布"
        }}</template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="发布时间">
        <template #default="scope">{{ scope.row.updatedAt }}</template>
      </el-table-column>
      <el-table-column fixed="right" width="222" label="操作">
        <template #default="scope">
          <el-button :icon="Edit" circle @click="toEdit(scope.row)"></el-button>
          <el-button :icon="Delete" circle @click="handleDel(scope.row)"></el-button>
          <el-button type="primary" round :icon="Cpu" @click="toRun(scope.row)">执行</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-row type="flex" class="mt-20 align-c" justify="center">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="10"
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
import { Delete, Edit, Cpu } from '@element-plus/icons-vue'
import { list, del, getArticle } from '@/api/collect.js'
import { create } from '@/api/article.js'
import { filterHtml } from '@/utils/tool.js'

const router = useRouter()
const multipleTable = ref(null)

const tableData = ref([])
const multipleSelection = ref([])
const count = ref(0)
const cur = ref(1)
const step = ref(0)

const params = reactive({
  cid: 0,
  title: '',
  shortTitle: '',
  tagId: '',
  attr: [],
  source: '',
  author: '',
  description: '',
  img: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  content: '欢迎使用SuperCMS系统',
  status: '0',
  pv: 1,
  link: ''
})

// 查询
const doList = async () => {
  try {
    const res = await list(cur.value)
    if (res.code === 200) {
      tableData.value = [...res.data.list]
      count.value = res.data.count
    }
  } catch (error) {
    console.log(error)
  }
}

// 翻页
const handleCurrentChange = (e) => {
  cur.value = e
  list()
}

// 选择行
// const toggleSelection = (rows) => {
//   if (rows) {
//     rows.forEach((row) => {
//       multipleTable.value.toggleRowSelection(row)
//     })
//   } else {
//     multipleTable.value.clearSelection()
//   }
// }

// 选择改变
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 执行任务
const toRun = async (item) => {
  try {
    const {
      pages,
      titleTag,
      articleTag,
      parseData,
      charset,
      cid,
      status
    } = item
    const pageArray = pages.split(',')

    const res = await getArticle({
      taskUrl: pageArray[step.value],
      titleTag,
      articleTag,
      parseData,
      charset
    })
    if (res.code === 200) {
      const { title, article } = res.data
      params.title = title
      params.content = article
      params.cid = cid
      params.status = status === 1 ? 1 : 0
      toCreate(params)
    }
  } catch (error) {
    console.log(error)
  }
}

// 新增
const toCreate = async (scope) => {
  try {
    const paramsCopy = { ...params }
    paramsCopy.attr = paramsCopy.attr.toString()
    paramsCopy.tagId = paramsCopy.tagId.toString()

    if (!paramsCopy.description && paramsCopy.content) {
      paramsCopy.description = filterHtml(paramsCopy.content).substr(0, 255)
    }

    const res = await create({
      defaultParams: paramsCopy,
      fieldParams: {}
    })

    if (res.code === 200) {
      ElMessage({
        message: `第${step.value + 1}条数据完成^_^`,
        type: 'success'
      })

      setTimeout(() => {
        const { pages } = scope
        const pageArray = pages.split(',')
        if (step.value <= pageArray.length - 1) {
          toRun(scope)
          step.value = step.value + 1
        }
      }, 3000)
    } else {
      ElMessage({
        message: res.msg || `第${step.value + 1}条数据失败^_^`,
        type: 'error'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// 编辑
const toEdit = (e) => {
  const id = e.id
  router.push({ name: 'collect-edit', params: { id: id } })
}

// 删除
const handleDel = async (e) => {
  const id = e.id
  try {
    const res = await del(id)
    if (res.code === 200) {
      ElMessage({
        message: '删除成功 ^_^',
        type: 'success'
      })
      doList()
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

// 初始化数据
onMounted(() => {
  doList()
})
</script>

<style scoped></style>
