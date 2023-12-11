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
            <el-select v-model="queryParams.payType" placeholder="支付方式" clearable >
               <el-option label="微信" value="1"/>
               <el-option label="支付宝" value="2"/>
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-select v-model="queryParams.payStatus" placeholder="支付状态" clearable > 
               <el-option label="未支付" value="0"/>
               <el-option label="已支付" value="1"/>
               <el-option label="已退款" value="2"/>
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-select v-model="queryParams.type" placeholder="订单类型" clearable >
               <el-option label="照片打印" value="1"/>
               <el-option label="照片保存" value="2"/>
            </el-select>
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
         <el-table-column label="订单类型" prop="type" >
            <template #default="scope">
               {{ orderTypeMap[scope.row.type] }}
            </template>
         </el-table-column>
         <el-table-column label="金额" prop="amount" />
         <el-table-column label="创建时间" prop="createTime" />
         <el-table-column label="支付状态">
            <template #default="scope">
               <el-tag type="warning" v-if="scope.row.payStatus == '0'">未支付</el-tag>
               <el-tag type="success" v-if="scope.row.payStatus == '1'">已支付</el-tag>
               <el-tag type="error" v-if="scope.row.payStatus == '2'">已退款</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="支付方式">
            <template #default="scope">
               {{ payTypeMap[scope.row.payType] }}
            </template>
         </el-table-column>
         <el-table-column label="支付时间" prop="payTime" />
         <el-table-column label="操作">
            <template #default="scope">
               <el-button v-if="scope.row.payStatus == '1'" type="text" icon="Edit" @click="refund(scope.row.id)" >退款</el-button>
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

<script setup name="PhotoOrder">
import { photoOrderListApi, photoOrderRefundApi } from "@/api/api";
import { ElMessage } from 'element-plus'

const orderList = ref([]);
const loading = ref(true);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  params: {
   searchValue: ''
  },
  payType: '',
  payStatus: ''
});


function getList() {
  loading.value = true;
  photoOrderListApi(queryParams).then(result => {
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
   '1': '微信',
   '2': '支付宝',
}

const orderTypeMap = {
   '1': '照片打印',
   '2': '照片保存',
}

const refund = (id) => {
   photoOrderRefundApi(id).then(result => {
      if (result.code == 200) {
         ElMessage.success('退款操作成功，30秒内刷新数据');
      }
  });
}

getList();
</script>
