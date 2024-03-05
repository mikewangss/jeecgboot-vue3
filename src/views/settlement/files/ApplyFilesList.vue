<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-if="hasPermission('settlement:apply_files:add')" @click="handleAdd" preIcon="ant-design:plus-outlined">
          新增</a-button
        >
        <a-button type="primary" v-if="hasPermission('settlement:apply_files:exportXls')" preIcon="ant-design:export-outlined" @click="onExportXls">
          导出</a-button
        >
        <j-upload-button
          type="primary"
          v-if="hasPermission('settlement:apply_files:importExcel')"
          preIcon="ant-design:import-outlined"
          @click="onImportXls"
          >导入</j-upload-button
        >
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('settlement:apply_files:delete')">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'file'">
          <!--文件字段回显插槽-->
          <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)"
            >下载</a-button
          >
        </template>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <ApplyFilesModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="settlement-applyFiles" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import ApplyFilesModal from './components/ApplyFilesModal.vue';
  import { columns, searchFormSchema } from './ApplyFiles.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './ApplyFiles.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';
  import { Base64 } from 'js-base64';
  import { usePermission } from '@/hooks/web/usePermission';
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  const glob = useGlobSetting();
  const { changeRole, hasPermission } = usePermission();
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '文件管理',
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
    exportConfig: {
      name: '文件管理',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
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
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
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
        auth: 'settlement:apply_files:edit', //通过权限指令控制显示（有权限显示/无权限不显示）
        onClick: handleEdit.bind(null, record),
      },
    ];
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
        auth: 'settlement:apply_files:delete', //通过权限指令控制显示（有权限显示/无权限不显示）
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
