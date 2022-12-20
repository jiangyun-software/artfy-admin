<template>
  <div class="app-container">
   <el-row>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['artfy:product:edit']" @click="handleEdit(undefined)">新增</el-button>
   </el-row>
      
   <el-row style="margin-top: 12px;">
      <el-table v-loading="loading"
         :data="tree"
         row-key="id"
         :default-expand-all="false"
         :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
         <el-table-column label="风格" prop="label" />
         <el-table-column label="图片">
            <template #default="scope">
               <img v-if="scope.row.image" :src="scope.row.image" alt="" style="width: 50px; height: 50px;">
            </template>
         </el-table-column>
         <el-table-column label="描述词" prop="keyword" />
         <el-table-column label="反向描述词" prop="reverseKeyword" />
         <el-table-column label="模型">
            <template #default="scope">
               {{ scope.row.parent ? model[scope.row.model] : '' }}
            </template>
         </el-table-column>
         <el-table-column label="状态" align="center" class-name="small-padding fixed-width" >
            <template #default="scope">
               <el-tag type="danger" v-if="scope.row.disabled">禁用</el-tag>
               <el-tag type="success" v-else>启用</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="备注" prop="remark" />
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
         <el-form-item v-show="!(formData.id && !formData.parent.id)" label="风格分组" prop="parent.id">
            <el-select v-model="formData.parent.id" clearable placeholder="请选择风格分组">
               <el-option
                  v-for="item in tree"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="风格名称" prop="label">
            <el-input v-model="formData.label" placeholder="请输入风格名称" />
         </el-form-item>
         <el-form-item v-show="formData.parent.id" label="图片" prop="image" style="font-weight: 700">
            <div style="width: 96px;height: 96px;border-radius: 4px;overflow: hidden;border: 1px solid grey;position: relative;">
               <div v-show="!formData.image" style="width: 100%; height: 100%;text-align: center;padding-top: 20px;">
                  <el-icon><Plus /></el-icon>
                  <div style="font-weight: 400">点击上传</div>
               </div>
               <div v-show="formData.image" style="width: 100%; height: 100%;"><img :src="formData.image" alt="" style="width: 100%; height: 100%;" /></div>
               <input type="file" style="position: absolute; font-size: 0px; top: 0px; left: 0px; width: 100%;height: 100%; opacity: 0;cursor: pointer;" @change="uploadFile($event)" />
            </div>
         </el-form-item>
         <el-form-item v-show="formData.parent.id" label="描述词" prop="keyword">
            <el-input type="textarea" :rows="3" v-model="formData.keyword" placeholder="请输入描述词" />
         </el-form-item>
         <el-form-item v-show="formData.parent.id" label="反向描述词" prop="reverseKeyword">
            <el-input type="textarea" :rows="2" v-model="formData.reverseKeyword" placeholder="请输入反向描述词" />
         </el-form-item>
         <el-form-item v-show="formData.parent.id" label="模型" prop="model">
            <el-select v-model="formData.model" placeholder="请选择模型">
               <el-option v-for="(label, value) in model" :key="value" :label="label" :value="value" />
            </el-select>
         </el-form-item>
         <el-form-item v-show="formData.parent.id" label="采样方式" prop="sampler">
            <el-select v-model="formData.sampler" clearable placeholder="请选择采样方式">
               <el-option v-for="item in sampler" :key="item" :label="item" :value="item" />
            </el-select>
         </el-form-item>
         <el-form-item v-show="formData.parent.id" label="步数" prop="step">
            <el-input-number v-model.number="formData.step" placeholder="步数" :min="0" :max="100" />
         </el-form-item>
         <el-form-item label="状态" prop="disabled">
            <el-radio-group v-model="formData.disabled" class="ml-4">
               <el-radio :label="false">启用</el-radio>
               <el-radio :label="true">禁用</el-radio>
            </el-radio-group>
         </el-form-item>
         <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="备注" type="textarea" />
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

<script setup name="PaintingStyle" lang="ts">
import { reactive, ref, nextTick } from 'vue';
import { paintingStyleTreeApi, paintingStyleEditApi, paintingStyleDeleteApi, getStaticUploadSingnatureApi } from '@/api/api.js';
import { ElMessage } from 'element-plus'
import axios from 'axios';

const formData = reactive({
   id: undefined,
   parent: {
      id: undefined
   },
   label: '',
   keyword: '',
   reverseKeyword: '',
   image: '',
   disabled: false,
   remark: '',
   model: '0',
   sampler: 'Euler',
   step: 50,
});


const model = { '0': 'SD', '1': 'NovaAI' };

const sampler = ['Euler a', 'Euler', 'LMS', 'Heun', 'DPM2', 'DPM2 a', 'DPM++ 2S a', 'DPM++ 2M', 'DPM++ SDE', 'DPM fast', 'DPM adaptive', 'LMS Karras', 'DPM2 Karras', 'DPM2 a Karras', 'DPM++2S a Karras', 'DPM++2M Karras', 'DPM++ SDE Karras', 'DDIM', 'PLMS'];

const loading = ref(false);

const tree = ref<any>([]);

const getTree = () => {
   paintingStyleTreeApi().then((res) => {
      if (res.code == 200) {
         tree.value = res.data;
      }
   });
}

const handleEdit = (row) => {
   editDialogVisible.value = true;
   if (row) {
      editTitle.value = '修改';
      formData.id = row.id;
      formData.parent.id = row.parent?.id;
      formData.label = row.label;
      formData.keyword = row.keyword;
      formData.reverseKeyword = row.reverseKeyword;
      formData.image = row.image;
      formData.disabled = row.disabled;
      formData.remark = row.remark;
      formData.model = row.model;
      formData.sampler = row.sampler;
      formData.step = row.step;
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
         paintingStyleEditApi(formData).then((res) => {
            if (res.code == 200) {
               loading.value = false;
               editDialogVisible.value = false;
               editFormRef.value.resetFields();
               ElMessage.success(editTitle.value + '成功');
               getTree();
            }
         });
      }
   })
}

const cancel = () => {
   editFormRef.value.resetFields();
   editDialogVisible.value = false;
}

const validateImage = (rule: any, value: any, callback: any) => {
  if (formData.parent.id && !formData.image) {
    callback(new Error('请上传图片'))
  } else {
    callback()
  }
}
const validateKeyword = (rule: any, value: any, callback: any) => {
  if (formData.parent.id && !formData.keyword) {
    callback(new Error('请填写描述词'))
  } else {
    callback()
  }
}

const rules = reactive({
   label: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
   keyword: [{ validator: validateKeyword, trigger: 'blur' }],
   image: [{ validator: validateImage, trigger: 'blur' }],
   disabled: [{ required: true, message: '请选择状态', trigger: 'blur' }],
});

const handleDelete = (id) => {
   paintingStyleDeleteApi(id).then((res) => {
      if (res.code == 200) {
         ElMessage.success('删除成功');
         getTree();
      }
   });
}

const uploadFile = (e) => {
   if (e.target.files.length == 0) {
      return false;
   }
   getStaticUploadSingnatureApi().then((res) => {
      const params = new FormData();
      params.append('key', res.data.key);
      params.append('policy', res.data.policy);
      params.append('OSSAccessKeyId', res.data.OSSAccessKeyId);
      params.append('success_action_status', '200');
      params.append('signature', res.data.signature);
      params.append('file', e.target.files[0]);
      axios({
         url: res.data.host,
         method: 'post',
         data: params,
         headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
         onUploadProgress: function (progress) {
         },
      }).then(() => {
         formData.image = res.data.url;
      });
   });
};

getTree();
</script>
<style lang="scss">

</style>
