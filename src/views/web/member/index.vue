<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
         <el-form-item label="手机号" prop="phonenumber">
            <el-input
               v-model="queryParams.phonenumber"
               placeholder="请输入手机号"
               clearable
               style="width: 240px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         </el-form-item>
      </el-form>

      <!-- 表格数据 -->
      <el-table v-loading="loading" :data="accountList">
         <!-- <el-table-column type="selection" align="center" /> -->
         <el-table-column label="编号" prop="id" />
         <el-table-column label="手机号" prop="phonenumber" />
         <el-table-column label="注册时间" prop="createTime" />
         <el-table-column label="微信绑定状态">
            <template #default="scope">
               <el-tag type="warning" v-if="scope.row.openid == ''">未绑定</el-tag>
               <el-tag type="success" v-else>已绑定</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="剩余点数" prop="point" />
         <el-table-column label="状态" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-switch
                  v-model="scope.row.disabled"
                  :active-value="false"
                  :inactive-value="true"
                  @change="handleDisable(scope.row)"
               ></el-switch>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />

   </div>
</template>

<script setup name="Account">
import { accountListApi, accountDisableApi } from "@/api/api";

const accountList = ref([]);
const loading = ref(true);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  phonenumber: undefined,
});


/** 查询账号列表 */
function getList() {
  loading.value = true;
  accountListApi(queryParams).then(result => {
    accountList.value = result.data.rows;
    total.value = result.data.total;
    loading.value = false;
  });
}

/** 启用禁用 */
function handleDisable(row) {
   accountDisableApi(row).then(result => {
      getList();
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

getList();
</script>
