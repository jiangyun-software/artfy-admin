<template>
  <div class="app-container">
   <el-row>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['artfy:swiper:edit']" @click="handleEdit()">新增</el-button>
   </el-row>
      
   <el-row style="margin-top: 12px;">
      <el-table v-loading="loading" :data="swiperList">
         <el-table-column label="排序" prop="seq" />
         <el-table-column label="图片" prop="image">
            <template #default="scope">
               <img :src="scope.row.image" alt="" style="width: 100px;height: 100px;">
            </template>
         </el-table-column>
         <el-table-column label="url" prop="url" />
         <el-table-column label="状态" align="center" class-name="small-padding fixed-width"  width="80">
            <template #default="scope">
               <el-tag type="danger" v-if="scope.row.disabled">禁用</el-tag>
               <el-tag type="success" v-else>启用</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" prop="createTime" width="156" />
         <el-table-column label="修改时间" prop="updateTime" width="156" />
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="160">
            <template #default="scope">
               <el-button type="text" icon="Edit" @click="handleEdit(scope.row)" v-hasPermi="['artfy:swiper:edit']" >修改</el-button>
               <el-button type="text" icon="Edit" @click="handleDelete(scope.row.id)" v-hasPermi="['artfy:swiper:delete']" >删除</el-button>
            </template>
         </el-table-column>
      </el-table>
   </el-row>

    <el-dialog :title="editTitle" v-model="editDialogVisible" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="editFormRef" :model="swiperFormData" :rules="rules" label-width="80px">
         <el-form-item label="id" prop="id" style="display: none;">
            <el-input v-model="swiperFormData.id" />
         </el-form-item>
         <el-form-item label="图片" prop="image" style="font-weight: 700">
            <div style="width: 96px;height: 96px;border-radius: 4px;overflow: hidden;border: 1px solid grey;position: relative;">
               <div v-show="!swiperFormData.image" style="width: 100%; height: 100%;text-align: center;padding-top: 20px;">
                  <el-icon><Plus /></el-icon>
                  <div style="font-weight: 400">点击上传</div>
               </div>
               <div v-show="swiperFormData.image" style="width: 100%; height: 100%;"><img :src="swiperFormData.image" alt="" style="width: 100%; height: 100%;" /></div>
               <input type="file" style="position: absolute; font-size: 0px; top: 0px; left: 0px; width: 100%;height: 100%; opacity: 0;cursor: pointer;" @change="uploadFile($event)" />
            </div>
         </el-form-item>
         <el-form-item label="url" prop="url">
            <el-input v-model="swiperFormData.url" placeholder="" />
         </el-form-item>
         <el-form-item label="排序" prop="seq">
            <el-input-number v-model="swiperFormData.seq" placeholder="" />
         </el-form-item>
         <el-form-item label="状态" prop="disabled">
            <el-radio-group v-model="swiperFormData.disabled" class="ml-4">
               <el-radio :label="false">启用</el-radio>
               <el-radio :label="true">禁用</el-radio>
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

<script setup name="Swiper">
import { reactive, ref, computed } from 'vue';
import { swiperListApi, swiperEditApi, swiperDeleteApi, getStaticUploadSingnatureApi } from '@/api/api';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'

const queryFormData = reactive({
   pageNum: 1,
   pageSize: 10,
   name: '',
   key: '',
});

const swiperFormData = reactive({
   id: '',
   image: '',
   url: '',
   seq: 0,
   disabled: false,
});

const average = computed(() => {
   return Math.round(swiperFormData.amount * 100 / swiperFormData.point) / 100;
});

const total = ref(0);

const loading = ref(false);

const swiperList = ref([]);

const handleQuery = () => {
   loading.value = true;
   swiperListApi(queryFormData).then((res) => {
      if (res.code == 200) {
         swiperList.value = res.data.rows;
         total.value = res.data.total;
         loading.value = false;
      }
   });
}

const handleEdit = (row) => {
   if (row) {
      editTitle.value = '修改';
      swiperFormData.id = row.id;
      swiperFormData.image = row.image;
      swiperFormData.url = row.url;
      swiperFormData.seq = row.seq;
      swiperFormData.disabled = row.disabled;
   } else {
      editTitle.value = '新增';
   }
   editDialogVisible.value = true;
};

const handleDelete = (id) => {
   ElMessageBox.confirm('是否确认删除？').then(() => {
      swiperDeleteApi(id).then((res) => {
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
         swiperEditApi(swiperFormData).then((res) => {
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
         swiperFormData.image = res.data.url;
      });
   });
};

handleQuery();
</script>
<style lang="scss">

</style>
