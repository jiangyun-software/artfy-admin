<template>
   <div class="app-container">
      <div class="counts">
         <div class="count-item">
            <div class="count-item-header">
               <div class="count-item-title">用户增长数</div>
               <div class="count-item-unit"><el-tag size="mini" type="success">日</el-tag></div>
            </div>
            <div class="count-item-content">
               <div class="count-item-content-main">
                  <div class="count-item-content-main-number"><countTo :startVal='0' :endVal='100' :duration='3000' separator="," /></div>
                  <div class="count-item-content-main-icon">icon</div>
               </div>
               <div class="count-item-content-total">
                  <div class="count-item-content-total-title">总用户数</div>
                  <div class="count-item-content-total-number">2000</div>
               </div>
            </div>
         </div>
         <div class="count-item">
            <div class="count-item-header">
               <div class="count-item-title">API调用数</div>
               <div class="count-item-unit"><el-tag size="mini" type="primary">周</el-tag></div>
            </div>
            <div class="count-item-content">
               <div class="count-item-content-main">
                  <div class="count-item-content-main-number"><countTo :startVal='0' :endVal='100' :duration='3000' separator="," /></div>
                  <div class="count-item-content-main-icon">icon</div>
               </div>
               <div class="count-item-content-total">
                  <div class="count-item-content-total-title">API调用总数</div>
                  <div class="count-item-content-total-number">2000</div>
               </div>
            </div>
         </div>
         <div class="count-item">
            <div class="count-item-header">
               <div class="count-item-title">充值金额</div>
               <div class="count-item-unit"><el-tag size="mini" type="warning">月</el-tag></div>
            </div>
            <div class="count-item-content">
               <div class="count-item-content-main">
                  <div class="count-item-content-main-number"><countTo :startVal='0' :endVal='9999' :duration='2000' prefix="￥" separator="," /></div>
                  <div class="count-item-content-main-icon">icon</div>
               </div>
               <div class="count-item-content-total">
                  <div class="count-item-content-total-title">充值总金额</div>
                  <div class="count-item-content-total-number">￥2000</div>
               </div>
            </div>
         </div>
         <div class="count-item">
            <div class="count-item-header">
               <div class="count-item-title">订单数</div>
               <div class="count-item-unit"><el-tag size="mini" type="error">年</el-tag></div>
            </div>
            <div class="count-item-content">
               <div class="count-item-content-main">
                  <div class="count-item-content-main-number"><countTo :startVal='0' :endVal='100' :duration='3000' separator="," /></div>
                  <div class="count-item-content-main-icon">icon</div>
               </div>
               <div class="count-item-content-total">
                  <div class="count-item-content-total-title">总订单数</div>
                  <div class="count-item-content-total-number">2000</div>
               </div>
            </div>
         </div>
      </div>
      <div style="margin-top: 20px">
         <img src="/src/assets/images/dashboard_example.png" alt="">
      </div>
   </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { CountTo } from 'vue3-count-to';

  export default defineComponent({
    name: 'Dashboard',
    components: { CountTo },
    setup() {},
  });
</script>
<style lang="scss">
.counts {
   display: flex;

   .count-item {
      flex: 1;
      margin: 0px 12px;
      box-shadow: 0px 4px 20px rgb(0 0 0 / 10%);

      .count-item-header {
         display: flex;
         justify-content: space-between;
         padding: 8px 12px;
         border-bottom: 1px solid rgb(229, 231, 235);
         font-size: 14px;
      }

      .count-item-content {
         padding: 12px 0px;

         .count-item-content-main {
            padding: 16px;
            display: flex;
            justify-content: space-between;

            .count-item-content-main-number {
               font-size: 24px;
               font-weight: 500;
            }
         }

         .count-item-content-total {
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
         }
      }
   }
}
</style>
