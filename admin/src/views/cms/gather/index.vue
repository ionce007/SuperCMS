<template>
   <div class="bg-fff radius-6 pd-20">
    <el-row type="flex" justify="end">
      <router-link to="/gather/add">
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
      <el-table-column prop="targetUrl" label="接口链接"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">{{ scope.row.status == 1 ? "草稿" : "发布" }}</template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="发布时间"> </el-table-column>
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
import { ref, onMounted ,reactive } from 'vue';
import {  useRouter } from 'vue-router';
import { Delete, Edit, Cpu } from '@element-plus/icons-vue';
import { list, del, getArticle } from '@/api/gather.js';
import { create } from '@/api/article.js';

const router = useRouter();

const tableData = ref([]);
const multipleSelection = ref([]);
const count = ref(0);
const cur = ref(1);
const step = ref(0);

const params = reactive({
  cid: 0,
  title: '',
  shortTitle: '',
  tagId: '',
  attr: [],
  articleView: '',
  source: '',
  author: '',
  description: '',
  img: '',
  content: '欢迎使用SuperCMS系统',
  status: '0',
  pv: 1,
  link: ''
});

// 查询
const getlist = async () => {
  try {

    let res = await list(cur.value);
    if (res.code === 200) {
      tableData.value = [...res.data.list];
      count.value = res.data.count;
    }
  } catch (error) {
    console.error('Error fetching list:', error);
  }
};

// 翻页
const handleCurrentChange = (e) => {
  cur.value = e;
  getlist();
};

// const toggleSelection = (rows) => {
//   if (rows) {
//     rows.forEach((row) => {
//       multipleTable.value.toggleRowSelection(row);
//     });
//   } else {
//     multipleTable.value.clearSelection();
//   }
// };

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const toRun = async (item) => {
  try {
    let { targetUrl, title, parseData, cid, status } = item;
    let res = await getArticle({
      targetUrl,
      title,
      parseData,
    });

    if (res.code === 200) {
      const { title, content } = res.data;
      params.attr = params?.attr?.toString() || '';
      params.title = title;
      params.content = content;
      params.cid = cid;
      params.status = status === 1 ? 1 : 0;
      tocreate();

      // eslint-disable-next-line no-undef
      ElMessage({
        message: '内功获取成功^_^',
        type: 'success',
      });
    }
  } catch (error) {
    console.error('Error running task:', error);
  }
};

// 新增
const tocreate = async () => {
  try {

    let res = await create({
      defaultParams: params,
      fieldParams: {},
    });
    if (res.code === 200) {

      // eslint-disable-next-line no-undef
      ElMessage({
        message: `第${step.value + 1}条数据完成^_^`,
        type: 'success',
      });
    }
  } catch (error) {
    console.error('Error creating article:', error);
  }
};

// 编辑
const toEdit = (e) => {
  let id = e.id;
  router.push({ name: 'gather-edit', params: { id: id } });
};

// 删除
const handleDel = async (e) => {
  let id = e.id;
  try {
    let res = await del(id);
    if (res.code === 200) {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: '删除成功 ^_^',
        type: 'success',
      });
      getlist();
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

onMounted(() => {
  getlist();
});
</script>

<style scoped>
/* 样式部分根据实际情况添加 */
</style>
