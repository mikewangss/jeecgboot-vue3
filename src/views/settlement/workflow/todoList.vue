<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <!--插槽:table标题-->
      <template #tableTitle> </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!-- 插槽定义 -->
      <template #endTimeSlot="{ record }">
        <a-tag type="warning" v-if="record.end_time == null">待办理</a-tag>
        <a-tag type="success" v-else class="pending">已办理</a-tag>
      </template>
    </BasicTable>
    <ProcessUpdate @register="register1" :showApplyButton="true" @success="handeleSuccess" />
    <SupplierUpdate @register="register2" :showApplyButton="true" @success="handeleSuccess" />
  </div>
</template>

<script lang="ts" name="settlement-workflow">
  import { ref, unref } from 'vue';
  import { useListPage } from '/@/hooks/system/useListPage';
  import ProcessUpdate from '@/views/settlement/workflow/compoments/process_update.vue';
  import SupplierUpdate from '@/views/settlement/workflow/compoments/supplier_update.vue';
  import { columns, searchFormSchema } from './todoList.data';
  import { todoList } from './todoList.api';
  import { useDrawer } from '@/components/Drawer';
  import { useUserStore } from '@/store/modules/user';
  import { defineComponent } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';

  export default defineComponent({
    components: { SupplierUpdate, ProcessUpdate, BasicTable, TableAction },
    setup() {
      const procDefName = ref('');
      const taskId = ref('');
      const processInstanceId = ref('');
      const searchInfo = {};
      const userStore = useUserStore();
      const username = userStore.getUserInfo?.username;
      searchInfo['userId'] = username;
      //注册table数据
      const [register1, { openDrawer: openDrawer1, closeDrawer: closeDrawer1 }] = useDrawer();
      const [register2, { openDrawer: openDrawer2, closeDrawer: closeDrawer2 }] = useDrawer();
      const { tableContext, doRequest } = useListPage({
        tableProps: {
          title: '我的待办',
          api: todoList,
          columns,
          canResize: false,
          formConfig: {
            //labelWidth: 120,
            schemas: searchFormSchema,
            autoSubmitOnEnter: true,
            showAdvancedButton: true,
            fieldMapToNumber: [],
            fieldMapToTime: [],
          },
          actionColumn: {
            width: 120,
            fixed: 'right',
          },
        },
      });
      const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

      /**
       * 获取单个
       */
      async function detailInfo(record) {
        taskId.value = record.taskId;
        processInstanceId.value = record.procInsId;
        console.log(processInstanceId.value);
        procDefName.value = record.procDefName;
        if (record.procDefName.includes('结算')) {
          openDrawer1(true, {
            process_instance_id: processInstanceId,
            bizId: '',
          });
        } else {
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
        reload();
      }
      /**
       * 编辑事件
       */
      function handleEdit(record: Recordable) {
        console.log('111');
        detailInfo(record);
      }

      /**
       * 成功回调
       */
      function handleSuccess() {
        (selectedRowKeys.value = []) && reload();
      }

      /**
       * 操作栏
       */
      function getTableAction(record) {
        return [
          {
            label: '去处理',
            onClick: handleEdit.bind(null, record),
          },
        ];
      }

      return {
        processInstanceId,
        taskId,
        register1,
        register2,
        registerTable,
        getTableAction,
        searchInfo,
        handeleSuccess,
      };
    },
    // mounted() {
    //   // 通过this.$route.params来访问参数
    //   // const queryTaskId = this.$route.query.taskId;
    //   // const queryProcessInstanceId = this.$route.query.processInstanceId;
    //   // if (queryTaskId != null && queryProcessInstanceId != null) {
    //   //   debugger;
    //   //   console.log('Received parameter:', queryTaskId);
    //   //   this.taskDetailInfo(queryTaskId, queryProcessInstanceId);
    //   // }
    // },
  });
</script>

<style scoped></style>
