<template>
  <div class="bg-fff radius-6 pd-20">
    <el-row type="flex" justify="end">
      <router-link
        :to="{
          name: 'field-add',
          query: {
            mid: query.mid,
            table: tableName,
            model: model,
          },
        }"
      >
        <el-button type="primary" round>新增</el-button>
      </router-link>
    </el-row>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="cname" label="中文名称"></el-table-column>
      <el-table-column prop="ename" label="字段名称"></el-table-column>
      <el-table-column prop="orderBy" label="排序"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
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

    <el-row type="flex" class="mt-20" justify="space-between">
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
import { ref, onMounted, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Delete, Edit,} from '@element-plus/icons-vue';
import { list, del } from '@/api/field.js';
import { hasUse } from '@/api/model.js';

const route = useRoute();
const router = useRouter();

const query = ref({ mid: route.query.mid });
const model = ref('');
const tableName = ref('');
const multipleSelection = ref([]);
const tableData = ref([]);
const count = ref(0);
const cur = ref(1);
const loading = ref(true);

const fetchData = async () => {
  try {
    const res = await list(query.value.mid, cur.value);
    if (res.code === 200) {
      const data = res.data;
      tableData.value = [...data.list];
      model.value = data.model.model;
      tableName.value = data.model.tableName;
      count.value = data.count;
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const handleCurrentChange = (e) => {
  cur.value = Number(e);
  sessionStorage.setItem('cur', Number(e));
  fetchData();
};

const toEdit = (e) => {
  const { id, ename } = e;
  router.push({
    name: 'field-edit',
    query: {
      fid: id,
      mid: query.value.mid,
      table: ename,
      model: model.value,
    },
  });
};

const handleDel = async (e) => {
  let { id } = e;
  try {
    let _res = await hasUse(query.value.mid);
    if (_res.data.count === 0) {
      let res = await del(id);
      if (res.code === 200) {
        ElMessage({
          message: '删除成功 ^_^',
          type: 'success',
        });
        fetchData();
      }
    } else {
      ElMessage({
        message: '当前模型正在使用，字段不能删除 ^_^',
        type: 'warning',
      });
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped></style>
