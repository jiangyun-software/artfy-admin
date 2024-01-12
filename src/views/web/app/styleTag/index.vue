<template>
  <div class="app-container">
   <el-row>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['artfy:product:edit']" @click="handleEdit(undefined)">新增</el-button>
   </el-row>
      
   <el-row style="margin-top: 12px;">
      <el-table v-loading="loading"
         :data="tagTree"
         row-key="id"
         :default-expand-all="true"
         :tree-props="{ children: 'children' }">
         <el-table-column label="序号" prop="seq" />
         <el-table-column label="名称" prop="name" />
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
            <template #default="scope">
               <el-button type="text" icon="Edit" @click="handleEdit(scope.row)" v-hasPermi="['artfy:paintingStyle:edit']" >修改</el-button>
               <el-button type="text" icon="Delete" @click="handleDelete(scope.row.id)" v-hasPermi="['artfy:paintingStyle:edit']" >删除</el-button>
            </template>
         </el-table-column>
      </el-table>
   </el-row>

  <el-dialog :title="editTitle" v-model="editDialogVisible" width="600px" append-to-body :close-on-click-modal="false" :show-close="true" @close="cancel" >
      <el-form ref="editFormRef" :model="formData" :rules="rules" label-width="96px">
         <el-form-item label="id" prop="id" style="display: none;">
            <el-input v-model="formData.id" placeholder="id" />
         </el-form-item>
         <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="" />
         </el-form-item>
         <el-form-item label="一级标签" prop="parentId">
            <el-select v-model="formData.parentId" style="width: 100%;">
               <el-option v-for="parent in tagTree.filter(item => !item.alone)" :key="parent.id" :value="parent.id" :label="parent.name" />
            </el-select>
         </el-form-item>
         <el-form-item label="排序" prop="seq">
            <el-input-number v-model.number="formData.seq" placeholder="排序" />
         </el-form-item>
         <el-form-item label="独立标签" prop="alone" v-show="!formData.parentId">
            <el-radio-group v-model="formData.alone">
               <el-radio :label="false">否</el-radio>
               <el-radio :label="true">是</el-radio>
            </el-radio-group>
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

<script setup name="StyleTag" lang="ts">
import { reactive, ref, nextTick } from 'vue';
import { styleTagTreeApi, styleTagEditApi, styleTagDeleteApi } from '@/api/api.js';
import { ElMessage } from 'element-plus'

const formData = reactive({
   id: undefined,
   parentId: null,
   name: '',
   seq: 0,
   alone: false
});


const model = ref<any>({});
const loading = ref(false);

const tagTree = ref<any>([]);

const getTree = () => {
   styleTagTreeApi().then((res) => {
      if (res.code == 200) {
         tagTree.value = res.data;
      }
   });
}

const handleEdit = async (row) => {
   editDialogVisible.value = true;
   await nextTick();
   editFormRef.value.resetFields();
   
   if (row) {
      editTitle.value = '修改';
      formData.id = row.id;
      formData.parentId = row.parentId
      formData.name = row.name;
      formData.seq = row.seq;
      formData.alone = row.alone;
   } else {
      editTitle.value = '新增';
   }
};

const editDialogVisible = ref(false);
const editTitle = ref('error')
const editFormRef = ref();

const submitForm = () => {
   editFormRef.value.validate((pass) => {
      if (pass) {
         styleTagEditApi(formData).then((res) => {
            if (res.code == 200) {
               loading.value = false;
               editDialogVisible.value = false;
               ElMessage.success(editTitle.value + '成功');
               getTree();
            }
         });
      }
   })
}

const cancel = () => {
   editDialogVisible.value = false;
}

const rules = reactive({
   name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
})

const handleDelete = (id) => {
   styleTagDeleteApi(id).then((res) => {
      if (res.code == 200) {
         ElMessage.success('删除成功');
         getTree();
      }
   });
}

getTree();
</script>

<style lang="scss" scoped>

</style>
