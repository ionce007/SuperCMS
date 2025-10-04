<template>
   <div class="bg-fff radius-6 pd-20">
    <el-row type="flex" justify="end">
      <router-link to="/message/add">
        <el-button type="primary" round>新增</el-button>
      </router-link>
    </el-row>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      tooltip-effect="dark"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" width="80" label="编号"></el-table-column>
      <el-table-column prop="title" width="300" label="标题"></el-table-column>
      <el-table-column prop="type" label="留言类型">
        <template #default="scope">
          <span v-if="scope.row.type == 1">咨询</span>
          <span v-else-if="scope.row.type == 2">建议</span>
          <span v-else-if="scope.row.type == 3">投诉</span>
          <span v-else>其它</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="联系人"></el-table-column>
      <el-table-column prop="tel" label="手机号"></el-table-column>
      <el-table-column prop="company" label="公司单位"></el-table-column>
      <el-table-column prop="createdAt" label="发布时间">
        <template #default="scope">{{ scope.row.createdAt }}</template>
      </el-table-column>
      <el-table-column fixed="right" width="100" label="操作">
        <template #default="scope">
          <el-button :icon="Edit" circle @click="toEdit(scope.row)"></el-button>
          <el-button
            :icon="Delete"
            circle
            @click="handleDelete(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-row type="flex" class="mt-20 align-c" justify="center">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
        :page-size="10"
        :total="totalCount"
        hide-on-single-page
      ></el-pagination>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { list, del } from '@/api/message.js';

const multipleTableRef = ref(null);
const tableData = ref([]);
const multipleSelection = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const router = useRouter();

const Edit = EditIcon;
const Delete = DeleteIcon;

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    const res = await list(currentPage.value);
    if (res.code === 200) {
      tableData.value = res.data.list;
      totalCount.value = res.data.count;
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchData();
};

// const toggleSelection = (rows) => {
//   if (rows) {
//     rows.forEach((row) => {
//       multipleTableRef.value.toggleRowSelection(row);
//     });
//   } else {
//     multipleTableRef.value.clearSelection();
//   }
// };

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const toEdit = (row) => {
  router.push({ name: 'message-edit', params: { id: row.id } });
};

const handleDelete = async (row) => {
  try {
    const res = await del(row.id);
    if (res.code === 200) {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: '删除成功 ^_^',
        type: 'success',
      });
      fetchData();
    } else {
      // eslint-disable-next-line no-undef
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
