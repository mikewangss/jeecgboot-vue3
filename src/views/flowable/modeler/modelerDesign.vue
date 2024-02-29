<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <WorkflowDetailBtn :data-id="record.deploymentId" />
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <FlowableDesignModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="settlement-applyProject" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import FlowableDesignModal from '../components/FlowableDesignModal.vue';
  import { columns, searchFormSchema } from '../api/defination.data';
  import { listDefinition, deleteOne, readXml } from '../api/defination.api';
  import WorkflowDetailBtn from '@/views/flowable/components/WorkflowDetailBtn.vue';
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      title: '流程定义列表',
      api: listDefinition,
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
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    const xmlData = await readXml(record.deploymentId);
    record['xml'] = xmlData;
    debugger;
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  async function handleDetail(record: Recordable) {
    const xmlData = await readXml(record.deploymentId);
    record['xml'] = xmlData;
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 预览
   */
  function handleView(record) {
    if (record && record.file) {
      console.log('glob.onlineUrl', glob.viewUrl);
      let filePath = encodeURIComponent(Base64.encode(record.file));
      //文档采用pdf预览高级模式
      // if(filePath.endsWith(".pdf") || filePath.endsWith(".doc") || filePath.endsWith(".docx")){
      //   filePath = filePath + '&officePreviewType=pdf'
      // }
      let url = `${glob.viewUrl}?url=` + filePath;
      window.open(url, '_blank');
    }
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ deployId: record.deploymentId }, handleSuccess);
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
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '预览',
        onClick: handleView.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        },
      },
    ];
  }
</script>

<style scoped></style>
