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
         <el-table-column label="剩余点数" prop="point" width="150" />
         <el-table-column label="状态" align="center" class-name="small-padding fixed-width" width="80">
            <template #default="scope">
               <el-switch
                  v-model="scope.row.disabled"
                  :active-value="false"
                  :inactive-value="true"
                  @change="handleDisable(scope.row)"
               ></el-switch>
            </template>
         </el-table-column>
         <el-table-column label="备注" prop="remark" />
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
            <template #default="scope">
               <el-button type="text" v-hasPermi="['artfy:member:edit']" @click="editRemark(scope.row)" >修改备注</el-button>
               <el-button type="text" v-hasPermi="['artfy:member:edit']" @click="editPoint(scope.row)" >加减点数</el-button>
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

   <el-dialog title="修改备注" v-model="remarkDialogVisible" width="600px" append-to-body :close-on-click-modal="false">
      <div><el-input v-model="memberParams.remark" placeholder="备注" type="textarea" /></div>
      <template #footer>
         <div class="dialog-footer">
         <el-button type="primary" @click="submitRemark">确 定</el-button>
         <el-button @click="remarkDialogVisible = false">取 消</el-button>
         </div>
      </template>
    </el-dialog>
    
    <el-dialog title="加减点数" v-model="pointDialogVisible" width="400px" append-to-body :close-on-click-modal="false">
      <div><el-input-number v-model.number="memberParams.point" placeholder="点数" style="width: 100%" /></div>
      <template #footer>
         <div class="dialog-footer">
         <el-button type="primary" @click="submitPoint">确 定</el-button>
         <el-button @click="pointDialogVisible = false">取 消</el-button>
         </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Account">
import { accountListApi, accountDisableApi, memberRemarkApi, memberPointApi } from "@/api/api";
import { ElMessage } from 'element-plus'

const accountList = ref([]);
const loading = ref(true);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  params: {
   searchValue: ''
  }
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

const remarkDialogVisible = ref(false);
const memberParams = reactive({
   id: 0,
   remark: '',
   point: 0
});
const editRemark = (member) => {
   remarkDialogVisible.value = true;
   memberParams.id = member.id;
   memberParams.remark = member.remark;
}
const submitRemark = () => {
   memberRemarkApi(memberParams).then((res) => {
      if (res.code == 200) {
         ElMessage.success('更新成功');
         remarkDialogVisible.value = false;
         getList();
      }
   });
}

const pointDialogVisible = ref(false);
const editPoint = (member) => {
   pointDialogVisible.value = true;
   memberParams.id = member.id;
   memberParams.point = 0;
}
const submitPoint = () => {
   memberPointApi(memberParams).then((res) => {
      if (res.code == 200) {
         pointDialogVisible.value = false;
         ElMessage.success('更新成功');
         getList();
      }
   });
}

getList();
</script>
