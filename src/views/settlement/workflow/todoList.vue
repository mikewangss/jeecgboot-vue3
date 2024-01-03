<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <!--插槽:table标题-->
      <template #tableTitle></template>
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
    <ProcessDetail @register="register1" :task_id="taskId" :process_instance_id="processInstanceId" :showApplyButton="true" />
  </div>
</template>

<script lang="ts" name="settlement-workflow">
  import { ref, unref } from 'vue';
  import { useListPage } from '/@/hooks/system/useListPage';
  import ProcessDetail from '@/views/settlement/workflow/compoments/process_detail.vue';
  import { columns, searchFormSchema } from './todoList.data';
  import { todoList } from './todoList.api';
  import { useDrawer } from '@/components/Drawer';
  import { useUserStore } from '@/store/modules/user';
  import { defineComponent } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';

  export default defineComponent({
    components: { ProcessDetail, BasicTable, TableAction },
    setup() {
      let info = ref(null);
      const taskId = ref('');
      const processInstanceId = ref('');
      const searchInfo = {};
      const userStore = useUserStore();
      const username = userStore.getUserInfo?.username;
      searchInfo['userId'] = username;
      //注册table数据
      const [register1, { openDrawer: openDrawer1 }] = useDrawer();
      const { tableContext } = useListPage({
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
        taskId.value = record.task_id;
        processInstanceId.value = record.process_instance_id;
        // info.value = await queryByProcessId({ process_id: record.process_instance_id });
        console.log(processInstanceId.value);
        openDrawer1(true, info);
      }
      /**
       * 获取单个
       */
      async function taskDetailInfo(queryTaskId, queryProcessInstanceId) {
        taskId.value = queryTaskId;
        processInstanceId.value = queryProcessInstanceId;
        console.log(processInstanceId.value);
        openDrawer1(true, info);
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
            label: '查看',
            onClick: handleEdit.bind(null, record),
          },
        ];
      }

      return {
        processInstanceId,
        taskId,
        register1,
        registerTable,
        getTableAction,
        searchInfo,
        taskDetailInfo,
      };
    },
    mounted() {
      // 通过this.$route.params来访问参数
      const queryTaskId = this.$route.query.taskId;
      const queryProcessInstanceId = this.$route.query.processInstanceId;
      if (queryTaskId != null && queryProcessInstanceId != null) {
        console.log('Received parameter:', queryTaskId);
        this.taskDetailInfo(queryTaskId, queryProcessInstanceId);
      }
    },
  });
</script>

<style scoped></style>
