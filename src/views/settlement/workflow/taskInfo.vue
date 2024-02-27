<template>
  <div>
    <ProcessUpdate @register="register1" @success="handeleSuccess" v-show="active === '1'" />
    <SupplierUpdate @register="register2" :showApplyButton="true" @success="handeleSuccess" v-show="active === '2'" />
  </div>
</template>

<script lang="ts" name="settlement-workflow">
  import { onMounted, ref, unref } from 'vue';
  import ProcessUpdate from '@/views/settlement/workflow/compoments/process_update.vue';
  import SupplierUpdate from '@/views/settlement/workflow/compoments/supplier_update.vue';
  import { useDrawer } from '@/components/Drawer';
  import { useUserStore } from '@/store/modules/user';
  import { defineComponent } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { useRouter } from 'vue-router';
  import { editCementSend, syncNotic } from '@/views/monitor/mynews/mynews.api';
  import { useAppStore } from '@/store/modules/app';

  const appStore = useAppStore();
  export default defineComponent({
    components: { SupplierUpdate, ProcessUpdate, BasicTable, TableAction },
    setup() {
      const procDefName = ref('');
      const active = ref('');
      const taskId = ref('');
      const processInstanceId = ref('');
      const searchInfo = {};
      const userStore = useUserStore();
      const username = userStore.getUserInfo?.username;
      searchInfo['userId'] = username;
      //注册table数据
      const [register1, { openDrawer: openDrawer1, closeDrawer: closeDrawer1 }] = useDrawer();
      const [register2, { openDrawer: openDrawer2, closeDrawer: closeDrawer2 }] = useDrawer();
      onMounted(async () => {
        // Fetch taskItems from your API
        try {
          debugger;
          const { currentRoute } = useRouter();
          let params = appStore.getMessageHrefParams;
          if (params) {
            let detailId = params.detailId;
            if (detailId) {
              // const response = await todoList({ pageNo: 0}); // Implement your fetchTaskItems function
              // taskItems.value = response; // Assuming your API returns an array of task items
              openDrawer1(true, {
                process_instance_id: detailId,
                bizId: '',
              });
              console.log(detailId);
            }
          }
        } catch (error) {
          console.error('Error fetching taskItems:', error);
        }
      });
      /**
       * 获取单个
       */
      async function detailInfo(record) {
        taskId.value = record.taskId;
        processInstanceId.value = record.procInsId;
        console.log(processInstanceId.value);
        procDefName.value = record.procDefName;
        if (record.procDefName.includes('结算')) {
          active.value = '1';
          openDrawer1(true, {
            process_instance_id: processInstanceId,
            bizId: '',
          });
        } else {
          active.value = '2';
          openDrawer2(true, {
            process_instance_id: processInstanceId,
            bizId: '',
          });
        }
      }
      function handeleSuccess() {
        if (procDefName.value.includes('结算')) {
          closeDrawer1();
        } else {
          closeDrawer2();
        }
      }
      /**
       * 编辑事件
       */
      function handleEdit(record: Recordable) {
        console.log('111');
        detailInfo(record);
      }
      return {
        register1,
        register2,
        handeleSuccess,
        active,
      };
    },
  });
</script>

<style scoped></style>
