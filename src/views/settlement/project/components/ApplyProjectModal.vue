<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" width="70%" @ok="handleSubmit">
    <BasicForm @register="registerForm" :labelWidth="200" :actionColOptions="{ span: 24 }" :labelCol="{ span: 12 }" ref="formRef">
      <template #localSearch="{ model, field }">
        <ApiSelect
          :api="getSupplierList"
          :params="selectParams"
          showSearch
          v-model:value="model[field]"
          :filterOption="false"
          resultField="list"
          labelField="supplierName"
          valueField="id"
          @search="debounceEmitChange"
        />
      </template>
      <template #localSearch1="{ model, field }">
        <ApiSelect
          :api="getSupplierList"
          :params="selectParams1"
          showSearch
          v-model:value="model[field]"
          :filterOption="false"
          resultField="list"
          labelField="supplierName"
          valueField="id"
          @search="debounceEmitChange1"
        />
      </template>
    </BasicForm>
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="合同信息" key="applyContract" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="applyContract"
          :loading="applyContractTable.loading"
          :columns="applyContractTable.columns"
          :dataSource="applyContractTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="true"
        />
      </a-tab-pane>
      <a-tab-pane tab="项目附件管理" key="applyFiles" :forceRender="true">
        <JVxeTable
          ref="applyFiles"
          :loading="applyFilesTable.loading"
          :columns="applyFilesTable.columns"
          :dataSource="applyFilesTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="true"
          :linkageConfig="linkageConfig"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive, onMounted, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, ApiSelect, useForm } from '/@/components/Form/index';
  import { useDebounceFn } from '@vueuse/core';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, applyContractColumns, applyFilesColumns } from '../ApplyProject.data';
  import { saveOrUpdate, applyContractList, getSupplierList } from '../ApplyProject.api';
  import { requestFilesList } from '@/views/settlement/files/ApplyFiles.api';
  import { JVxeLinkageConfig, JVxeTableInstance } from '@/components/jeecg/JVxeTable/types';
  import { getSubFileMenu } from '/@/views/settlement/files/ApplyFiles.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['applyContract', 'applyFiles']);
  const activeKey = ref('applyContract');
  const applyContract = ref<JVxeTableInstance>();
  const applyFiles = ref<JVxeTableInstance>();
  const tableRefs = { applyContract, applyFiles };
  const applyContractTable = reactive({
    loading: false,
    dataSource: [],
    columns: applyContractColumns,
  });
  const applyFilesTable = reactive({
    loading: false,
    dataSource: [],
    columns: applyFilesColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  // 联动配置
  const linkageConfig = ref<JVxeLinkageConfig[]>([
    // 可配置多个联动
    { requestData: requestFileType, key: 'fc' },
  ]);
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({
      confirmLoading: false,
      showCancelBtn: data?.showFooter,
      showOkBtn: data?.showFooter,
    });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      requestSubTableData(applyContractList, { id: data?.record?.id }, applyContractTable);
      requestSubTableData(requestFilesList, { projectId: data?.record?.id, fc: '2' }, applyFilesTable);
      // debugger;
      // console.log(applyFilesTable.dataSource.length);
      // if (applyFilesTable.dataSource.length == 0) {
      //   // 默认添加五行数据
      //   applyFiles.value!.addRows([{ fileName: '工程施工合同', fc: '2', bizType: '1', flag: 1 }], {
      //     setActive: false,
      //   });
      // }
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //方法配置
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );
  const keyword = ref<string>('');
  const keyword1 = ref<string>('');
  const selectParams = computed<Recordable>(() => {
    return { keyword: unref(keyword), type: '0' };
  });
  const selectParams1 = computed<Recordable>(() => {
    return { keyword: unref(keyword1), type: '1' };
  });
  const debounceEmitChange = useDebounceFn(onSearch, 1000);
  const debounceEmitChange1 = useDebounceFn(onSearch1, 1000);
  function onSearch(value: string) {
    keyword.value = value;
  }
  function onSearch1(value: string) {
    keyword1.value = value;
  }
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  async function reset() {
    await resetFields();
    activeKey.value = 'applyContract';
    applyContractTable.dataSource = [];
    applyFilesTable.dataSource = [];
  }

  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      applyContractList: allValues.tablesValue[0].tableData,
      applyFilesList: allValues.tablesValue[1].tableData,
    };
  }

  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  /** 查询后台真实数据 */
  async function requestFileType(parent) {
    let result;
    result = await getSubFileMenu({ parent: parent });
    console.log(result);
    // 返回的数据里必须包含 value 和 text 字段
    return result
      .filter((item) => item.id === '2' || item.parent === '2')
      .map((item) => ({
        value: item.id,
        text: item.name,
      }));
  }
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
