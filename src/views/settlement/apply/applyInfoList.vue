<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <ProcessDetail @register="register1" :task_id="taskId" :process_instance_id="processInstanceId" :showApplyButton="false" />
  </div>
</template>

<script lang="ts" name="settlement-applyInfo">
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './applyInfo.data';
  import { list, queryProcessId } from './applyInfo.api';
  import { useUserStore } from '/@/store/modules/user';
  import { useDrawer } from '@/components/Drawer';
  import { defineComponent } from 'vue';
  import ProcessDetail from '@/views/settlement/workflow/compoments/process_detail.vue';
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
          title: '申请记录',
          api: list,
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
      const [registerTable, { reload }, { selectedRowKeys }] = tableContext;
      /**
       * 选择列配置
       */
      const rowSelection = {
        type: 'checkbox',
        columnWidth: 30,
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      };
      /**
       * 选择事件
       */
      function onSelectChange(selectedRowKeys: (string | number)[]) {

      }
      /**
       * 获取单个
       */
      async function detailInfo(record) {
        processInstanceId.value = await queryProcessId({ id: record.id });
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
      function handleDelete(record: Recordable) {
        console.log(record);
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
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
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
        rowSelection,
      };
    },
  });
</script>

<style scoped></style>
