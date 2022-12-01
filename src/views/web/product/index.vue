<template>
  <div class="app-container">
   <el-row>
      <el-form :model="queryFormData" ref="queryRef" :inline="true">
         <el-form-item label="产品名称" prop="name">
         <el-input v-model="queryFormData.name" placeholder="产品名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="产品Key" prop="key">
         <el-input v-model="queryFormData.key" placeholder="产品key" clearable style="width: 240px" @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item>
         <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         <el-button icon="Refresh" @click="resetQuery()">重置</el-button>
         </el-form-item>
      </el-form>
   </el-row>

   <el-row>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['web:product:edit']" @click="handleEdit()">新增</el-button>
   </el-row>
      
   <el-row style="margin-top: 12px;">
      <el-table v-loading="loading" :data="apiList">
         <el-table-column label="产品名称" prop="name" />
         <el-table-column label="消耗点数" prop="point" width="80" />
         <el-table-column label="api类型" prop="apiType" width="80">
            <template #default="scope">
               {{ scope.row.apiType == '0' ? '自研' : '外链' }}
            </template>
         </el-table-column>
         <el-table-column label="接口地址" prop="url" />
         <el-table-column label="产品key" prop="key" width="130" />
         <el-table-column label="产品描述" prop="remark" />
         <el-table-column label="创建人" prop="createByUser.name" width="100" />
         <el-table-column label="创建时间" prop="createTime" width="156" />
         <el-table-column label="修改人" prop="updateByUser.name" width="100" />
         <el-table-column label="修改时间" prop="updateTime" width="156" />
         <el-table-column label="状态" align="center" class-name="small-padding fixed-width"  width="80">
            <template #default="scope">
               <el-tag type="danger" v-if="scope.row.disabled">禁用</el-tag>
               <el-tag type="success" v-else>启用</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="80">
            <template #default="scope">
               <el-button type="text" icon="Edit" @click="handleEdit(scope.row)" v-hasPermi="['web:product:edit']" >修改</el-button>
            </template>
         </el-table-column>
      </el-table>
   </el-row>

    <el-dialog :title="editTitle" v-model="editDialogVisible" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="editFormRef" :model="apiFormData" :rules="rules" label-width="80px">
         <el-form-item label="产品名称" prop="name">
            <el-input v-model="apiFormData.name" placeholder="请输入产品名称" />
         </el-form-item>
         <el-form-item label="消耗点数" prop="point">
            <el-input-number v-model.number="apiFormData.point" placeholder="请输入消耗点数" :min="0" :max="100" />
         </el-form-item>
         <el-form-item label="api类型" prop="apiType">
            <el-select v-model="apiFormData.apiType">
               <el-option label="自研" value="0" />
               <el-option label="外链" value="1" />
            </el-select>
         </el-form-item>
         <el-form-item label="接口地址" prop="url">
            <el-input v-model="apiFormData.url" placeholder="请输入接口地址" />
         </el-form-item>
         <el-form-item label="产品key" prop="key">
            <el-input v-model="apiFormData.key" placeholder="请输入产品key" :disabled="Boolean(apiFormData.id)" />
         </el-form-item>
         <el-form-item label="状态" prop="disabled">
            <el-radio-group v-model="apiFormData.disabled" class="ml-4">
               <el-radio :label="false">启用</el-radio>
               <el-radio :label="true">禁用</el-radio>
            </el-radio-group>
         </el-form-item>
         <el-form-item label="备注" prop="remark">
            <el-input v-model="apiFormData.remark" placeholder="请输入产品名称" type="textarea" />
         </el-form-item>
      </el-form>
      <template #footer>
         <div class="dialog-footer">
         <el-button type="primary" @click="submitForm">确 定</el-button>
         <el-button @click="cancel()">取 消</el-button>
         </div>
      </template>
   </el-dialog>
  </div>
</template>

<script setup name="Product" lang="ts">
import { reactive, ref } from 'vue';
import { productListApi, productEditApi } from '@/api/api.js';
import { ElMessage } from 'element-plus'

const queryFormData = reactive({
   pageNum: 1,
   pageSize: 10,
   name: '',
   key: '',
});

const apiFormData = reactive({
   id: '',
   name: '',
   point: 0,
   key: '',
   url: '',
   remark: '',
   disabled: false,
   apiType: '0', 
});

const total = ref(0);

const loading = ref(false);

const apiList = ref([]);

const handleQuery = () => {
   loading.value = true;
   productListApi(queryFormData).then((res) => {
      if (res.code == 200) {
         apiList.value = res.data.rows;
         total.value = res.data.total;
         loading.value = false;
      }
   });
}

const queryRef = ref();
const resetQuery = () => {
   queryRef.value.resetFields();
   handleQuery();
}

const handleEdit = (row) => {
   if (row) {
      editTitle.value = '修改';
      apiFormData.id = row.id;
      apiFormData.name = row.name;
      apiFormData.key = row.key;
      apiFormData.url = row.url;
      apiFormData.remark = row.remark;
      apiFormData.disabled = row.disabled;
      apiFormData.apiType = row.apiType;
   } else {
      editTitle.value = '新增';
   }
   editDialogVisible.value = true;
};

const editDialogVisible = ref(false);
const editTitle = ref('error')
const editFormRef = ref();

const submitForm = () => {
   editFormRef.value.validate((pass) =>{
      if (pass) {
         productEditApi(apiFormData).then((res) => {
            if (res.code == 200) {
               loading.value = false;
               editDialogVisible.value = false;
               editFormRef.value.resetFields();
               ElMessage.success(editTitle.value + '成功');
               handleQuery();
            }
         });
      }
   })
}

const cancel = () => {
   editFormRef.value.resetFields();
   editDialogVisible.value = false;
}

const validateUrl = (rule: any, value: any, callback: any) => {
  if (apiFormData.apiType == '0' && value === '') {
    callback(new Error('请输入api地址'))
  } else {
    callback()
  }
}

const rules = reactive({
   name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
   point: [{ required: true, message: '消耗点数不能为空', trigger: 'blur' }],
   url: [{ validator: validateUrl, trigger: 'blur' }],
   key: [{ required: true, message: '产品key不能为空', trigger: 'blur' }],
   disabled: [{ required: true, message: '请选择状态', trigger: 'blur' }],
});

handleQuery();
</script>
<style lang="scss">

</style>
