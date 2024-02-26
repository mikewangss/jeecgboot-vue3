<template>
  <div>
    <BasicForm @register="registerForm" :labelWidth="200" :actionColOptions="{ span: 24 }" :labelCol="{ span: 8 }" ref="formRef">
      <template #remoteSearch="{ model, field }">
        <ApiSelect
          :api="getSupplierList"
          showSearch
          v-model:value="model[field]"
          :filterOption="false"
          resultField="list"
          labelField="name"
          valueField="id"
          @search="onSearch"
        />
      </template>
    </BasicForm>
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="合同" key="applyContract" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="applyContract"
          v-if="applyContractTable.show"
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
          keep-source
          resizable
          ref="applyFiles"
          v-if="applyFilesTable.show"
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

    <div style="width: 100%; text-align: center" v-if="!formDisabled">
      <a-button @click="handleSubmit" pre-icon="ant-design:check" type="primary">提 交</a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { computed, defineComponent, reactive, ref, unref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { propTypes } from '/@/utils/propTypes';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import { getBpmFormSchema, applyContractColumns, applyFilesColumns } from '../ApplyProject.data';
  import { saveOrUpdate, applyContractList, applyFilesList, getSupplierList } from '../ApplyProject.api';
  import { getSubFileMenu } from '/@/views/settlement/files/ApplyFiles.api';
  import { JVxeLinkageConfig } from '@/components/jeecg/JVxeTable/types';
  import { useDebounceFn } from '@vueuse/core';
  export default defineComponent({
    name: 'ApplyProjectForm',
    components: {
      BasicForm,
    },
    props: {
      formData: propTypes.object.def({}),
      formBpm: propTypes.bool.def(true),
    },
    setup(props) {
      const keyword = ref<string>('');
      const searchParams = computed<Recordable>(() => {
        return { keyword: unref(keyword) };
      });
      const [registerForm, { setFieldsValue, setProps }] = useForm({
        labelWidth: 150,
        schemas: getBpmFormSchema(props.formData),
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
      });

      const formDisabled = computed(() => {
        if (props.formData.disabled === false) {
          return false;
        }
        return true;
      });

      const refKeys = ref(['applyContract', 'applyFiles']);
      const activeKey = ref('applyContract');
      const applyContract = ref();
      const applyFiles = ref();
      const tableRefs = { applyContract, applyFiles };
      const applyContractTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyContractColumns,
        show: false,
      });
      const applyFilesTable = reactive({
        loading: false,
        dataSource: [],
        columns: applyFilesColumns,
        show: false,
      });

      const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
        requestAddOrEdit,
        classifyIntoFormData,
        tableRefs,
        activeKey,
        refKeys
      );
      // 联动配置
      const linkageConfig = ref<JVxeLinkageConfig[]>([
        // 可配置多个联动
        { requestData: requestFileType, key: 'fc' },
      ]);
      /** 查询后台真实数据 */
      async function requestFileType(parent) {
        let result;
        result = await getSubFileMenu(parent);
        // 返回的数据里必须包含 value 和 text 字段
        return result.filter((item) => item.id === '2' || item.parent === '2').map((item) => ({ value: item.id, text: item.name }));
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
        await saveOrUpdate(values, true);
      }

      const queryByIdUrl = '/settlement/applyProject/queryById';
      async function initFormData() {
        let params = { id: props.formData.dataId };
        const data = await defHttp.get({ url: queryByIdUrl, params });
        //设置表单的值
        await setFieldsValue({ ...data });
        requestSubTableData(applyContractList, { id: data.id }, applyContractTable, () => {
          applyContractTable.show = true;
        });
        requestSubTableData(applyFilesList, { id: data.id }, applyFilesTable, () => {
          applyFilesTable.show = true;
        });
        //默认是禁用
        await setProps({ disabled: formDisabled.value });
      }
      initFormData();
      function onSearch(value: string) {
        keyword.value = value;
      }
      return {
        onSearch: useDebounceFn(onSearch, 300),
        getSupplierList,
        searchParams,
        registerForm,
        formDisabled,
        formRef,
        handleSubmit,
        activeKey,
        handleChangeTabs,
        applyContract,
        applyFiles,
        applyContractTable,
        applyFilesTable,
        linkageConfig,
      };
    },
  });
</script>
