<template>
   <div class="bg-fff radius-6 pd-20">
    <el-row type="flex" class="mt-10 mb-10" justify="end">
      <router-link to="/model/add">
        <el-button type="primary" round>新增</el-button>
      </router-link>
    </el-row>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      row-key="id"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" width="60" label="编号"></el-table-column>
      <el-table-column prop="model" label="模型名称"></el-table-column>
      <el-table-column prop="tableName" label="模型对应的表"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">{{
          scope.row.status == 1 ? "启用" : "禁用"
        }}</template>
      </el-table-column>
      <el-table-column fixed="right" width="150" label="操作">
        <template #default="scope">
          <el-button
            :icon="View"
            circle
            @click="handleClick(scope.row)"
          ></el-button>
          <el-button :icon="Edit" circle @click="toEdit(scope.row)"></el-button>
          <el-button
            :icon="Delete"
            circle
            @click="handleDel(scope.row)"
          ></el-button>
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { Delete, Edit, View } from '@element-plus/icons-vue';
import { list, hasUse, del } from '@/api/model.js';

const router = useRouter();
const multipleTable = ref(null);
const multipleSelection = ref([]);
const tableData = ref([]);
const count = ref(0);
const cur = ref(1);
const loading = ref(true);

onMounted(() => {
  listData();
});

const listData = async () => {
  try {
    const res = await list(cur.value);
    if (res.code === 200) {
      tableData.value = res.data.list;
      count.value = res.data.count;
      loading.value = false;
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.error(error);
  }
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

const handleCurrentChange = (e) => {
  cur.value = Number(e);
  sessionStorage.setItem('cur', Number(e));
  listData();
};

const toEdit = (e) => {
  const id = e.id;
  router.push({ name: 'model-edit', params: { id: id } });
};

const handleClick = (e) => {
  const { id } = e;
  router.push({ name: 'field-index', query: { mid: id } });
};

const handleDel = async (e) => {
  const { id, table } = e;
  try {
    const res = await hasUse(id);
    if (res.code === 200) {
      if (res.data.count === 0) {
        const res = await del(id, table);
        if (res.code === 200) {
          ElMessage({
            message: '删除成功 ^_^',
            type: 'success',
          });
          listData();
        } else {
          ElMessage({
            message: res.msg,
            type: 'error',
          });
        }
      } else {
        ElMessage({
          message: '当前模型已经使用，不能删除！',
          type: 'error',
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.el-input {
  width: 200px !important;
}
</style>
