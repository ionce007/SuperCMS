<template>
   <div class="bg-fff radius-6 pd-20">
    <el-row type="flex" justify="end">
      <router-link to="/user/add">
        <el-button type="primary" round>新增</el-button>
      </router-link>
    </el-row>

    <div class="mr-10 ml-10">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" width="100" label="编号"></el-table-column>
        <el-table-column prop="username" label="管理员"></el-table-column>
        <el-table-column prop="value" label="角色"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            {{ scope.row.status == 1 ? "启用" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间">
          <template #default="scope">{{ scope.row.createdAt }}</template>
        </el-table-column>
        <el-table-column fixed="right" width="200" label="操作">
          <template #default="scope">
            <el-button
              :icon="Edit"
              circle
              @click="toEdit(scope.row)"
            ></el-button>

            <el-popconfirm
              width="220"
              @confirm="() => handleDel(scope.row)"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="你确定吗？要删管理员？"
            >
              <template #reference>
                <el-button
                  :icon="Delete"
                  :disabled="username === scope.row.username"
                  circle
                ></el-button>
              </template>
            </el-popconfirm>
            <el-tooltip
              v-if="username === scope.row.username"
              content="当前登录用户不可删除"
              effect="light"
              placement="top-start"
            >
              <el-icon class="ml-10 t-4 pointer">
                <QuestionFilled class="c-165dff" />
              </el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        :page-size="10"
        :model-value="cur"
        @update:model-value="handleCurrentChange"
        hide-on-single-page
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Delete, Edit, QuestionFilled } from "@element-plus/icons-vue";
import { list, del } from "@/api/sys_user.js";
import { getCookie } from "@/utils/tool";
import { useRouter } from 'vue-router';

const router = useRouter();

const tableData = ref([]);
const multipleSelection = ref([]);
const count = ref(0);
const cur = ref(1);
const username = getCookie("username");

const fetchUsers = async () => {
  try {
    const res = await list(cur.value);
    if (res.code === 200) {
      tableData.value = [...res.data.list];
      count.value = res.data.count;
    }
  } catch (error) {
    console.log(error);
  }
};

const handleCurrentChange = (val) => {
  cur.value = val;
  fetchUsers();
};

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const toEdit = (e) => {
  router.push({ name: "user-edit", params: { id: e.id } });
};

const handleDel = async (e) => {
  try {
    const res = await del(e.id);
    if (res.code === 200) {
      // eslint-disable-next-line no-undef
      ElMessage.success('删除成功 ^_^');
      fetchUsers();
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
<style scoped></style>
