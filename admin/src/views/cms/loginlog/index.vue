<template>
  <div class="pd-20 bg-fff bg-fff radius-6">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" width="100" label="编号"></el-table-column>
      <el-table-column prop="username" label="登录用户"></el-table-column>
      <el-table-column prop="ip" label="登录IP"></el-table-column>
      <el-table-column prop="isp" label="网络"></el-table-column>
      <el-table-column prop="country" label="地理位置">
        <template #default="scope">
          {{ scope.row.lat }}
          {{ scope.row.lng }}
        </template>
      </el-table-column>
      <el-table-column prop="country" label="登录地点">
        <template #default="scope">
          {{ scope.row.prov }}
          {{ scope.row.city }}
          {{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="登录日期"></el-table-column>
    </el-table>

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
import { ref, onMounted } from 'vue';
import { list, del } from '@/api/login_log.js';

const multipleTable = ref(null);
const tableData = ref([]);
const multipleSelection = ref([]);
const count = ref(0);
const cur = ref(1);

// 查询
const listLogs = async () => {
  try {
    const res = await list(cur.value);
    if (res.code === 200) {
      tableData.value = [...res.data.list];
      count.value = res.data.count;
      if (res.data.total > 100) {
        await handleDel();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// 翻页
const handleCurrentChange = (e) => {
  cur.value = e;
  listLogs();
};

const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTable.value.toggleRowSelection(row);
    });
  } else {
    multipleTable.value.clearSelection();
  }
};

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 删除
const handleDel = async () => {
  try {
    const res = await del();
    if (res.code === 200) {
      listLogs();
    }
  } catch (error) {
    console.log(error);
  }
};

// 初始化时获取数据
onMounted(() => {
  listLogs();
});
</script>

<style scoped>
/* 添加样式 */
</style>