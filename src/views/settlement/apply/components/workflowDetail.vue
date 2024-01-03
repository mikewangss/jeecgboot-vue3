<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="Drawer Title" width="50%">
    <PageWrapper title="申请审批进度详情">
      <BasicTable @register="registerTimeTable" />
    </PageWrapper>
  </BasicDrawer>
</template>

<script lang="ts" name="workflowList">
  import { defineComponent, watchEffect, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns, } from '@/views/settlement/apply/workflow_data';
  import { Divider, Card, Empty, Descriptions, Steps, Tabs } from 'ant-design-vue';
  import { Description } from '@/components/Description';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import {taskHiList} from "@/views/settlement/workflow/todoList.api";
  export default defineComponent({
    components: {
      Description,
      PageWrapper,
      BasicDrawer,
      BasicTable,
      [Divider.name]: Divider,
      [Card.name]: Card,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
    },
    setup() {
      const dictId = ref('');
      const refundTimeTableData = ref<any[]>([]);
      const [registerTimeTable, { reload, setProps }] = useTable({
        title: '审批记录',
        api: (requestData) => taskHiList(requestData.process_instance_id),
        columns: columns,
        pagination: false,
        dataSource: refundTimeTableData,
        showIndexColumn: false,
        scroll: { y: 300 },
        requestData: {
          process_instance_id: props.process_instance_id,
        },
      });
      const [registerDrawer] = useDrawerInner(async (data) => {
        dictId.value = data.id;
        setProps({ searchInfo: { id: unref(dictId) } });
        reload();
      });
      return {
        registerTimeTable,
        registerDrawer,
        refundTimeTableData,
      };
    },
  });
</script>
