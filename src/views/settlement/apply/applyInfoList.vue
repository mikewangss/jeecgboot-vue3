<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--操作栏-->
      <template #action="{ record }">
        <!--        <ActHistoricDetailBtn :data-id="record.id" />-->
        <TableAction :actions="getTableAction(record)" />
      </template>

      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'finalFile'">
          <!--文件字段回显插槽-->
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)"
            >下载</a-button
          >
        </template>
      </template>
    </BasicTable>
    <ProcessDetail @register="register1" :showApplyButton="false" v-show="active" />
  </div>
</template>

<script lang="ts" name="settlement-applyInfo">
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './applyInfo.data';
  import { list, queryById, deleteOne } from './applyInfo.api';
  import { useUserStore } from '/@/store/modules/user';
  import { useDrawer } from '@/components/Drawer';
  import { defineComponent } from 'vue';
  import ProcessDetail from '@/views/settlement/workflow/compoments/process_detail.vue';
  import ActHistoricDetailBtn from '@/views/flowable/components/ActHistoricDetailBtn.vue';
  import { downloadFile } from '@/utils/common/renderUtils';

  export default defineComponent({
    components: { ProcessDetail, BasicTable, TableAction, ActHistoricDetailBtn },
    setup() {
      const active = ref(false);
      const taskId = ref('');
      const bizId = ref('');
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
      function onSelectChange(selectedRowKeys: (string | number)[]) {}
      /**
       * 获取单个
       */
      async function detailInfo(record) {
        active.value = true;
        bizId.value = record.id;
        openDrawer1(true, {
          process_instance_id: processInstanceId,
          bizId: bizId,
        });
      }

      /**
       * 编辑事件
       */
      function handleEdit(record: Recordable) {
        detailInfo(record);
      }

      /**
       * 成功回调
       */
      function handleSuccess() {
        (selectedRowKeys.value = []) && reload();
      }
      async function handleDelete(record: Recordable) {
        console.log(record);
        await deleteOne({ id: record.id }, handleSuccess);
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
            label: '撤销',
            onClick: handleDelete.bind(null, record),
          },
          // {
          //   label: '下载终审单',
          //   onClick: handleDelete.bind(null, record),
          // },
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
        bizId,
        active,
      };
    },
    methods: { downloadFile },
  });
</script>

<style scoped></style>
