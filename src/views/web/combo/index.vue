<template>
  <div class="app-container">
   <el-row>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['web:combo:edit']" @click="handleEdit()">新增</el-button>
   </el-row>
      
   <el-row style="margin-top: 12px;">
      <el-table v-loading="loading" :data="comboList">
         <el-table-column label="点数" prop="point"/>
         <el-table-column label="金额" prop="amount" />
         <el-table-column label="平均价格" prop="average" />
         <el-table-column label="备注" prop="remark" />
         <el-table-column label="状态" align="center" class-name="small-padding fixed-width"  width="80">
            <template #default="scope">
               <el-tag type="danger" v-if="scope.row.disabled">禁用</el-tag>
               <el-tag type="success" v-else>启用</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="创建人" prop="createByUser.name" width="100" />
         <el-table-column label="创建时间" prop="createTime" width="156" />
         <el-table-column label="修改人" prop="updateByUser.name" width="100" />
         <el-table-column label="修改时间" prop="updateTime" width="156" />
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="160">
            <template #default="scope">
               <el-button type="text" icon="Edit" @click="handleEdit(scope.row)" v-hasPermi="['web:combo:edit']" >修改</el-button>
               <el-button type="text" icon="Edit" @click="handleDelete()" v-hasPermi="['web:combo:delete']" >删除</el-button>
            </template>
         </el-table-column>
      </el-table>
   </el-row>

    <el-dialog :title="editTitle" v-model="editDialogVisible" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="editFormRef" :model="comboFormData" :rules="rules" label-width="80px">
         <el-form-item label="id" prop="id" style="display: none;">
            <el-input v-model="comboFormData.id" />
         </el-form-item>
         <el-form-item label="点数" prop="point">
            <el-input-number v-model.number="comboFormData.point" placeholder="请输入点数" :min="1" :step="1" :stepStrictly="1" />
         </el-form-item>
         <el-form-item label="金额" prop="amount">
            <el-input-number v-model="comboFormData.amount" placeholder="请输入金额" :min="0" />
         </el-form-item>
         <el-form-item label="平均价格" prop="average">
            <el-input v-model="average" placeholder="" readonly style="width: 150px" />
         </el-form-item>
         <el-form-item label="状态" prop="disabled">
            <el-radio-group v-model="comboFormData.disabled" class="ml-4">
               <el-radio :label="false">启用</el-radio>
               <el-radio :label="true">禁用</el-radio>
            </el-radio-group>
         </el-form-item>
         <el-form-item label="备注" prop="remark">
            <el-input v-model="comboFormData.remark" placeholder="备注" type="textarea" />
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

<script setup name="Combo">
import { reactive, ref, computed } from 'vue';
import { comboListApi, comboEditApi, comboDeleteApi } from '@/api/api';
import { ElMessage, ElMessageBox } from 'element-plus'

const queryFormData = reactive({
   pageNum: 1,
   pageSize: 10,
   name: '',
   key: '',
});

const comboFormData = reactive({
   id: '',
   point: 1,
   amount: 0.01,
   remark: '',
   disabled: false,
});

const average = computed(() => {
   return Math.round(comboFormData.amount * 100 / comboFormData.point) / 100;
});

const total = ref(0);

const loading = ref(false);

const comboList = ref([]);

const handleQuery = () => {
   loading.value = true;
   comboListApi(queryFormData).then((res) => {
      if (res.code == 200) {
         comboList.value = res.data.rows;
         total.value = res.data.total;
         loading.value = false;
      }
   });
}

const handleEdit = (row) => {
   if (row) {
      editTitle.value = '修改';
      comboFormData.id = row.id;
      comboFormData.point = row.point;
      comboFormData.amount = row.amount;
      comboFormData.remark = row.remark;
      comboFormData.disabled = row.disabled;
   } else {
      editTitle.value = '新增';
   }
   editDialogVisible.value = true;
};

const handleDelete = (id) => {
   ElMessageBox.confirm('是否确认删除？').then(() => {
      comboDeleteApi(id).then((res) => {
         if (res.code == 200) {
            ElMessage.success('删除成功');
            handleQuery();
         }
      });
   });
};

const editDialogVisible = ref(false);
const editTitle = ref('error')
const editFormRef = ref();

const submitForm = () => {
   editFormRef.value.validate((pass) =>{
      if (pass) {
         comboEditApi(comboFormData).then((res) => {
            if (res.code == 200) {
               loading.value = false;
               editDialogVisible.value = false;
               ElMessage.success(editTitle.value + '成功');
               handleQuery();
               editFormRef.value.resetFields();
            }
         });
      }
   })
}

const cancel = () => {
   editFormRef.value.resetFields();
   editDialogVisible.value = false;
}

const rules = reactive({
   name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
   point: [{ required: true, message: '消耗点数不能为空', trigger: 'blur' }],
   url: [{ required: true, message: '接口地址不能为空', trigger: 'blur' }],
   key: [{ required: true, message: '产品key不能为空', trigger: 'blur' }],
   disabled: [{ required: true, message: '请选择状态', trigger: 'blur' }]
});

handleQuery();
</script>
<style lang="scss">

</style>
