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
    </BasicTable>
    <!-- 表单区域 -->
    <ProcessDetail @register="register1" :showApplyButton="false" />
    <SupplierUpdate @register="register2" :showApplyButton="false" />
  </div>
</template>

<script lang="ts" name="completeList">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from '../apply/workflow_data';
  import { completeList } from './todoList.api';
  import { useDrawer } from '@/components/Drawer';
  import { useUserStore } from '@/store/modules/user';
  import ProcessDetail from '@/views/settlement/workflow/compoments/process_detail.vue';
  import SupplierUpdate from '@/views/settlement/workflow/compoments/supplier_update.vue';

  export default defineComponent({
    components: { SupplierUpdate, ProcessDetail, BasicTable, TableAction },
    setup() {
      const taskId = ref('');
      const processInstanceId = ref('');
      const searchInfo = {};
      const userStore = useUserStore();
      const username = userStore.getUserInfo?.username;
      searchInfo['userId'] = username;
      //注册table数据
      const [register1, { openDrawer: openDrawer1 }] = useDrawer();
      const [register2, { openDrawer: openDrawer2 }] = useDrawer();
      const { tableContext } = useListPage({
        tableProps: {
          title: '我的已办',
          api: completeList,
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

      /**
       * 编辑事件
       */
      function handleEdit(record: Recordable) {
        console.log('111');
        detailInfo(record);
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
        register2,
        registerTable,
        getTableAction,
        searchInfo,
      };
    },
  });
</script>

<style scoped></style>
