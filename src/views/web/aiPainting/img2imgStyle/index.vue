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
         <el-table-column label="人脸融合" align="center" class-name="small-padding fixed-width" >
            <template #default="scope">
               <el-tag type="success" v-if="scope.row.faceSwap">启用</el-tag>
               <el-tag type="danger" v-else>禁用</el-tag>
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
         <el-form-item label="风格名称" prop="label">
            <el-input v-model="formData.label" placeholder="请输入风格名称" />
         </el-form-item>
         <el-form-item label="排序" prop="seq">
            <el-input-number v-model.number="formData.seq" placeholder="排序" />
         </el-form-item>
         <el-form-item label="封面" prop="image" style="font-weight: 700">
            <div style="width: 96px;height: 96px;border-radius: 4px;overflow: hidden;border: 1px solid grey;position: relative;">
               <div v-show="!formData.image" style="width: 100%; height: 100%;text-align: center;padding-top: 20px;">
                  <el-icon><Plus /></el-icon>
                  <div style="font-weight: 400">点击上传</div>
               </div>
               <div v-show="formData.image" style="width: 100%; height: 100%;"><img :src="formData.image" alt="" style="width: 100%; height: 100%;" /></div>
               <input type="file" style="position: absolute; font-size: 0px; top: 0px; left: 0px; width: 100%;height: 100%; opacity: 0;cursor: pointer;" @change="uploadFile($event)" />
            </div>
         </el-form-item>
         <el-form-item label="示例图" prop="example">
            <div v-for="(item, index) in formData.exampleList" :key="index" class="example">
               <div class="example-origin"><img v-if="item.origin" :src="item.origin" alt=""><el-icon v-else :size="32"><UploadFilled /></el-icon><div v-if="!item.origin">上传原图</div><input type="file" @change="uploadExample($event, index, 'origin')" /></div>
               <div class="example-target"><img v-if="item.target" :src="item.target" alt=""><el-icon v-else :size="32"><UploadFilled /></el-icon><div v-if="!item.target">上传效果图</div><input type="file" @change="uploadExample($event, index, 'target')" /></div>
               <div class="example-change"><el-icon :size="24" @click="addExample(index)"><CirclePlus v-if="index == 0" /><Remove v-else /></el-icon></div>
            </div>
         </el-form-item>
         <el-form-item label="标签" prop="tags">
            <el-select style="width: 100%;"
               ref="headerSearchSelectRef"
               v-model="formData.tagsArry"
               default-first-option
               multiple
            >
               <el-option-group v-for="group in tagTree.filter(item => !item.alone)" :key="group.id" :label="group.name">
                  <el-option v-for="tag in group.children" :key="tag.id" :value="tag.name" :label="tag.name" />
               </el-option-group>
               <el-option-group label="独立标签">
                  <el-option v-for="group in tagTree.filter(item => item.alone)" :key="group.id" :label="group.name" :value="group.name"/>
               </el-option-group>
            </el-select>
         </el-form-item>
         <el-form-item label="来源" prop="source">
            <el-radio-group v-model="formData.source">
               <el-radio label="0">自研</el-radio>
               <el-radio label="3">无界</el-radio>
            </el-radio-group>
         </el-form-item>
         <el-form-item label="参数" prop="jsonParams">
            <JsonEditorVue class="editor" v-model="formData.jsonParamsObj" @blur="validateJ"  style="width: 100%"/>
         </el-form-item>
         <el-form-item label="状态" prop="disabled">
            <el-radio-group v-model="formData.disabled" class="ml-4">
               <el-radio :label="false">启用</el-radio>
               <el-radio :label="true">禁用</el-radio>
            </el-radio-group>
         </el-form-item>
         <el-form-item label="人脸融合" prop="faceSwap">
            <el-switch class="ml-4"
                  v-model="formData.faceSwap"
                  :active-value="true"
                  :inactive-value="false"
               ></el-switch>
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
import { paintingStyleTreeApi, paintingStyleEditApi, paintingStyleDeleteApi, getStaticUploadSingnatureApi, styleTagTreeApi } from '@/api/api.js';
import { getDicts } from '@/api/system/dict/data.js';
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { listData } from "@/api/system/dict/data";
import JsonEditorVue from 'json-editor-vue3'

const formData = reactive({
   id: undefined,
   parent: {
      id: undefined
   },
   seq: 0,
   label: '',
   image: '',
   disabled: false,
   faceSwap: false,
   remark: '',
   type: '1',
   source: '0',
   jsonParams: '',
   jsonParamsObj: {},
   tags: '',
   tagsArry: [],
   example: '',
   exampleList: []
});


const model = ref<any>({});

const sampler = ['Euler a', 'Euler', 'LMS', 'Heun', 'DPM2', 'DPM2 a', 'DPM++ 2S a', 'DPM++ 2M', 'DPM++ SDE', 'DPM fast', 'DPM adaptive', 'LMS Karras', 'DPM2 Karras', 'DPM2 a Karras', 'DPM++2S a Karras', 'DPM++2M Karras', 'DPM++ SDE Karras', 'DDIM', 'PLMS'];

const loading = ref(false);

const tree = ref<any>([]);

const getTree = () => {
   paintingStyleTreeApi('1').then((res) => {
      if (res.code == 200) {
         tree.value = res.data;
      }
   });
}

const handleEdit = async (row) => {
   editDialogVisible.value = true;
   await nextTick();
   editFormRef.value.resetFields();
   formData.jsonParamsObj = {};
   if (row) {
      editTitle.value = '修改';
      formData.id = row.id;
      formData.parent.id = row.parent?.id;
      formData.label = row.label;
      formData.image = row.image;
      formData.disabled = row.disabled;
      formData.faceSwap = row.faceSwap;
      formData.remark = row.remark;
      formData.source = row.source;
      formData.seq = row.seq;
      formData.jsonParamsObj = (row.jsonParams == ''?{}:JSON.parse(row.jsonParams));
      formData.tagsArry = row.tags == ''? [] : row.tags.split(',');
      formData.exampleList = JSON.parse(row.example || '[{"origin": "", "target": ""}]');
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

         formData.jsonParams = JSON.stringify(formData.jsonParamsObj);
         formData.tags = formData.tagsArry.join(',');
         formData.example = JSON.stringify(formData.exampleList);
         paintingStyleEditApi(formData).then((res) => {
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

const validateImage = (rule: any, value: any, callback: any) => {
   if (formData.parent.id && !formData.image) {
      callback(new Error('请上传图片'))
   } else {
      callback()
   }
}

const validateExample = (rule: any, value: any, callback: any) => {
   if (formData.exampleList.filter(item => !item.origin || !item.target).length > 0) {
      callback(new Error('请上传示例图'))
   } else {
      callback()
   }
}

const jsonEditorValidateRes = ref([]);
const validateJ = async (editor) => {
   jsonEditorValidateRes.value = await editor.validate();
};

const validateJsonParam = (rule: any, value: any, callback: any) => {
  if (jsonEditorValidateRes.value.length > 0) {
    callback(new Error('参数json格式错误'))
  } else {
    callback()
  }
}

const rules = reactive({
   label: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
   image: [{ validator: validateImage, trigger: 'blur' }],
   disabled: [{ required: true, message: '请选择状态', trigger: 'blur' }],
   jsonParams: [{ validator: validateJsonParam, trigger: 'blur' }],
   example: [{ validator: validateExample, trigger: 'blur' }],
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

const getModelList = () => {
   listData({ pageNum: 1, pageSize: 999, dictType: 'painting_model' }).then(response => {
      const models = {};
      model.value = response.rows.forEach((item) => {
         models[item.dictValue] = item.dictLabel;
      });
      model.value = models;
   });
}

const tagTree = ref<any>([]);

styleTagTreeApi().then(res => {
   tagTree.value = res.data;
})

const addExample = (index) => {
   if (index == 0 && formData.exampleList.length < 3) {
      formData.exampleList.push({"origin": "", "target": ""});
   } else if (index > 0) {
      formData.exampleList.splice(index, 1);
   }
}

const uploadExample = (e, index, type) => {
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
         formData.exampleList[index][type] = res.data.url;
      });
   });
}

getModelList();

getTree();
</script>

<style lang="scss" scoped>
:deep(.jsoneditor-poweredBy) {
   display: none;
}

.example {
   display: flex;
   width: 100%;
   gap: 16px;
   margin: 6px 0px;
   .example-origin {
      position: relative;
      height: 72px;
      width: 72px;
      border: solid 1px black;
   }
   .example-target {
      position: relative;
      height: 72px;
      width: 72px;
      border: solid 1px black;
   }

   .example-origin, .example-target, .example-change {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 12px;
      line-height: 12px;
   }

   .example-change {
      cursor: pointer;
   }

   input {
      position: absolute;
      width: 100%;
      height: 100%;
      font-size: 0;
      left: 0;
      top: 0;
      opacity: 0;
      cursor: pointer;
   }

   img {
      width: 100%;
      height: 100%;
   }
}
</style>
