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
      <el-table v-loading="loading" :data="dataList">
         <!-- <el-table-column type="selection" align="center" /> -->
         <el-table-column label="会员id" prop="member.id" />
         <el-table-column label="会员手机号" prop="member.phonenumber" />
         <el-table-column label="会员备注" prop="member.remark" />
         <el-table-column label="产品" prop="product" />
         <el-table-column label="调用时间" prop="requestTime" />
         <el-table-column label="输入对象">
            <template #default="scope">
               <!-- <el-button type="primary" size="small" link @click="previewImage(scope.row.inputObjects)">点击查看</el-button> -->
               <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.inputObjects.split(',')[0]"
                  :preview-src-list="scope.row.inputObjects.split(',')"
                  fit="cover"
                  :preview-teleported="true"
               />
            </template>
         </el-table-column>
         <el-table-column label="输出对象">
            <template #default="scope">
               <!-- <el-button type="primary" size="small" link @click="previewImage(scope.row.outputObjects)">点击查看</el-button> -->
               <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.outputObjects.split(',')[0]"
                  :preview-src-list="scope.row.outputObjects.split(',')"
                  fit="cover"
                  :preview-teleported="true"
               />
            </template>
         </el-table-column>
         <el-table-column label="调用方式">
            <template #default="scope">
               {{ requestTypeMap[scope.row.type] }}
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

      <el-image-viewer v-if="viewImage" :url-list="previewSrc" :teleported="true" @close="viewImage = false" />

   </div>
</template>

<script setup name="ApiLog">
import { apiLogApi, getSingnatureUrlsApi } from "@/api/api";

const dataList = ref([]);
const loading = ref(true);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  params: {
   searchValue: '',
  }
});


function getList() {
  loading.value = true;
  apiLogApi(queryParams).then(result => {
   dataList.value = result.data.rows;
    total.value = result.data.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

const requestTypeMap = {
   'web': '网页调用',
   'api': 'api调用'
}

const viewImage = ref(false);
const previewSrc = ref([]);

const previewImage = (objects) => {
   getSingnatureUrlsApi(objects).then((res) => {
      if (res.code == 200) {
         previewSrc.value = res.data;
         viewImage.value = true;
      }
   });
}

getList();
</script>
