<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
         <el-form-item label="">
            <el-input
               v-model="queryParams.params.searchValue"
               placeholder="请输入会员id、手机号或备注"
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
      <el-table v-loading="loading" :data="orderList">
         <!-- <el-table-column type="selection" align="center" /> -->
         <el-table-column label="会员id" prop="member.id" />
         <el-table-column label="会员手机号" prop="member.phonenumber" />
         <el-table-column label="会员备注" prop="member.remark" />
         <el-table-column label="订单备注" prop="subject" />
         <el-table-column label="金额" prop="amount" />
         <el-table-column label="点数" prop="point" />
         <el-table-column label="付款方式">
            <template #default="scope">
               {{ payTypeMap[scope.row.payType] }}
            </template>
         </el-table-column>
         <el-table-column label="支付状态">
            <template #default="scope">
               <el-tag type="warning" v-if="scope.row.payStatus == '0'">未支付</el-tag>
               <el-tag type="success" v-if="scope.row.payStatus == '1'">已支付</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="支付时间" prop="payTime" />
         <el-table-column label="创建时间" prop="createTime" />
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

<script setup name="Order">
import { orderListApi } from "@/api/api";

const orderList = ref([]);
const loading = ref(true);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  params: {
   searchValue: ''
  },
});


function getList() {
  loading.value = true;
  orderListApi(queryParams).then(result => {
    orderList.value = result.data.rows;
    total.value = result.data.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

const payTypeMap = {
   '0': '支付宝',
   '1': '微信'
}

getList();
</script>
