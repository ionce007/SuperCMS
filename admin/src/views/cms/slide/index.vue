<template>
  <div class="pd-20 bg-fff radius-6">
    <el-row type="flex" class="mt-10 mb-10" justify="end">
      <router-link to="/slide/add">
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
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="imgUrl" label="图片链接">
        <template #default="scope">
          <el-popover
            v-if="scope.row.imgUrl"
            placement="right"
            :width="600"
            trigger="hover"
          >
            <template #reference>
              <el-image
                class="avatar-uploader-icon pointer ml-10"
                :src="scope.row.imgUrl"
              />
            </template>
            <el-image style="width: 100%" :src="scope.row.imgUrl" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="linkUrl" label="跳转链接"> </el-table-column>
      <el-table-column fixed="right" width="100" label="操作">
        <template #default="scope">
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
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Delete, Edit,  } from '@element-plus/icons-vue';
import { list, del } from '@/api/slide.js';

const router = useRouter();

const tableData = ref([]);
const multipleSelection = ref([]);
const count = ref(0);
const cur = ref(1);

// 查询
const fetchData = async () => {
  try {
    const res = await list(cur.value);
    if (res.code === 200) {
      tableData.value = [...res.data.list];
      count.value = res.data.count;
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// 翻页
const handleCurrentChange = (e) => {
  cur.value = e;
  fetchData();
};

// 切换选中项
// const toggleSelection = (rows) => {
//   if (rows) {
//     rows.forEach((row) => {
//       multipleTable.value.toggleRowSelection(row);
//     });
//   } else {
//     multipleTable.value.clearSelection();
//   }
// };

// 处理选中变化
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 编辑
const toEdit = (e) => {
  const id = e.id;
  router.push({ name: 'slide-edit', params: { id: id } });
};

// 删除
const handleDel = async (e) => {
  const id = e.id;
  try {
    const res = await del(id);
    if (res.code === 200) {
      ElMessage({
        message: '删除成功 ^_^',
        type: 'success',
      });
      fetchData();
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const multipleTable = ref(null);

onMounted(() => {
  fetchData();
});
</script>

<style scoped></style>
