<!--部门选择框-->
<template>
  <div>
    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="500px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
      <a-input-search placeholder="按部门名称搜索…" style="margin-bottom: 10px" @search="onSearch" allowClear />
      <BasicTree
        ref="treeRef"
        :treeData="treeData"
        :load-data="sync == false ? null : onLoadData"
        v-bind="getBindValue"
        @select="onSelect"
        @check="onCheck"
        :fieldNames="fieldNames"
        :checkedKeys="checkedKeys"
        :multiple="multiple"
        :checkStrictly="getCheckStrictly"
      />
      <!--树操作部分-->
      <template #insertFooter>
        <a-dropdown placement="top">
          <template #overlay>
            <a-menu>
              <a-menu-item v-if="multiple" key="1" @click="checkALL(true)">全部勾选</a-menu-item>
              <a-menu-item v-if="multiple" key="2" @click="checkALL(false)">取消全选</a-menu-item>
              <a-menu-item key="3" @click="expandAll(true)">展开全部</a-menu-item>
              <a-menu-item key="4" @click="expandAll(false)">折叠全部</a-menu-item>
            </a-menu>
          </template>
          <a-button style="float: left"> 树操作 <Icon icon="ant-design:up-outlined" /> </a-button>
        </a-dropdown>
      </template>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { queryDepartTreeSync, queryTreeList } from '/@/api/common/api';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { treeProps } from '/@/components/Form/src/jeecg/props/props';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { useTreeBiz } from '/@/components/Form/src/jeecg/hooks/useTreeBiz';
  import { propTypes } from '/@/utils/propTypes';
  import { omit } from 'lodash-es';
  import {searchByKeywords} from "@/views/system/departUser/depart.user.api";

  export default defineComponent({
    name: 'DeptSelectModal',
    components: {
      BasicModal,
      BasicTree,
    },
    props: {
      ...treeProps,
      //选择框标题
      modalTitle: {
        type: String,
        default: '部门选择',
      },
      value: propTypes.oneOfType([propTypes.string, propTypes.array]),
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
      //注册弹框
      const [register, { closeModal }] = useModalInner();
      const attrs = useAttrs();
      const treeRef = ref<Nullable<TreeActionType>>(null);
      // 搜索关键字
      // 当前展开的项
      const expandedKeys = ref<any[]>([]);
      const searchKeyword = ref('');
      const loading = ref<boolean>(false);
      // 树组件重新加载
      const treeReloading = ref<boolean>(false);
      //update-begin-author:taoyan date:2022-10-28 for: 部门选择警告类型不匹配
      let propValue = props.value === '' ? [] : props.value;
      //update-begin-author:liusq date:2023-05-26 for:  [issues/538]JSelectDept组件受 dynamicDisabled 影响
      let temp = Object.assign({}, unref(props), unref(attrs), { value: propValue }, { disabled: false });
      const getBindValue = omit(temp, 'multiple');
      //update-end-author:liusq date:2023-05-26 for:  [issues/538]JSelectDept组件受 dynamicDisabled 影响
      //update-end-author:taoyan date:2022-10-28 for: 部门选择警告类型不匹配

      const queryUrl = getQueryUrl();
      const [{ visibleChange, checkedKeys, getCheckStrictly, getSelectTreeData, onCheck, onLoadData, treeData, checkALL, expandAll, onSelect }] =
        useTreeBiz(treeRef, queryUrl, getBindValue, props);
      const searchInfo = ref(props.params);
      const tree = ref([]);
      //替换treeNode中key字段为treeData中对应的字段
      const fieldNames = {
        key: props.rowKey,
      };
      // {children:'children', title:'title', key:'key' }
      /**
       * 确定选择
       */
      function handleOk() {
        getSelectTreeData((options, values) => {
          //回传选项和已选择的值
          emit('getSelectResult', options, values);
          //关闭弹窗
          closeModal();
        });
      }
      // 加载顶级部门信息
      async function loadRootTreeData() {
        try {
          loading.value = true;
          treeData.value = [];
          const result = await queryDepartTreeSync();
          if (Array.isArray(result)) {
            treeData.value = result;
          }
          if (expandedKeys.value.length === 0) {
            autoExpandParentNode();
          }
        } finally {
          loading.value = false;
        }
      }
      // 搜索事件
      async function onSearch(value: string) {
        if (value) {
          try {
            loading.value = true;
            treeData.value = [];
            let result = await searchByKeywords({ keyWord: value });
            if (Array.isArray(result)) {
              treeData.value = result;
            }
            autoExpandParentNode();
          } finally {
            loading.value = false;
          }
        } else {
          loadRootTreeData();
        }
        searchKeyword.value = value;
      }
      // 自动展开父节点，只展开一级
      function autoExpandParentNode() {
        let item = treeData.value[0];
        if (item) {
          if (!item.isLeaf) {
            expandedKeys.value = [item.key];
          }
          reloadTree();
        }
      }

      // 重新加载树组件，防止无法默认展开数据
      async function reloadTree() {
        await nextTick();
        treeReloading.value = true;
        await nextTick();
        treeReloading.value = false;
      }
      /** 获取查询数据方法 */
      function getQueryUrl() {
        let queryFn = props.sync ? queryDepartTreeSync : queryTreeList;
        //update-begin-author:taoyan date:2022-7-4 for: issues/I5F3P4 online配置部门选择后编辑，查看数据应该显示部门名称，不是部门代码
        return (params) => queryFn(Object.assign({}, params, { primaryKey: props.rowKey }));
        //update-end-author:taoyan date:2022-7-4 for: issues/I5F3P4 online配置部门选择后编辑，查看数据应该显示部门名称，不是部门代码
      }

      return {
        tree,
        handleOk,
        searchInfo,
        treeRef,
        treeData,
        onCheck,
        onSelect,
        checkALL,
        expandAll,
        fieldNames,
        checkedKeys,
        register,
        getBindValue,
        getCheckStrictly,
        visibleChange,
        onLoadData,
        onSearch,
      };
    },
  });
</script>
