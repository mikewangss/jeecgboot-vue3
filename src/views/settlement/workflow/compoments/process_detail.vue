<template>
  <BasicDrawer v-bind="$attrs" @register="register2" title="Drawer Title" width="50%">
    <PageWrapper title="详情组件示例">
      <Description
        title="流程基本信息"
        :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
        :column="3"
        :data="mockData"
        :schema="schema"
      />
      <Description
        title="流程表单信息"
        :collapseOptions="{ canExpand: true, helpMessage: 'help me' }"
        :column="3"
        :data="mockData2"
        :schema="schema2"
      />
      <a-divider />
      <BasicTable @register="registerTimeTable" />
      <a-divider />
      <a-row v-if="showApplyButton">
        <a-textarea v-model="approvalComment" rows="5" style="width: 90%; margin-bottom: 20px" placeholder="请输入你的审批意见"></a-textarea>
      </a-row>
      <a-row v-if="showApplyButton">
        <div class="demo-drawer__footer">
          <a-button type="primary" class="ml-2" @click="handleApply('approval')"> 同意</a-button>
          <a-button type="dashed" class="ml-2" @click="handleApply('reject')"> 拒绝</a-button>
        </div>
      </a-row>
    </PageWrapper>
  </BasicDrawer>
</template>

<script lang="tsx">
  import { defineComponent, ref, toRefs, watch, watchEffect } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description, DescItem } from '/@/components/Description/index';
  import { PageWrapper } from '/@/components/Page';
  import { apply, queryByProcessId, reject, taskHiList } from '../todoList.api';
  import { useGlobSetting } from '@/hooks/setting';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns } from '@/views/settlement/apply/workflow_data';

  const mockData = ref({});
  const mockData2 = ref({});
  const approvalComment = ref('');
  export default defineComponent({
    components: { BasicTable, Description, PageWrapper, BasicDrawer },
    props: {
      task_id: {
        type: [String] as PropType<string>,
        default: '0',
      },
      process_instance_id: {
        type: [String] as PropType<string>,
        default: '0',
      },
      showApplyButton: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const { task_id, process_instance_id, showApplyButton } = toRefs(props);
      watch(
        () => props.process_instance_id,
        (newVal, oldVal) => {
          console.log('process_instance_id changed:', newVal, oldVal);
          fetchDataBasedOnPropChange(newVal);
          reloadTable();
        }
      );
      const glob = useGlobSetting();
      const [register2] = useDrawerInner();
      const [registerTimeTable, { setTableData }] = useTable({
        title: '审批记录',
        columns: columns,
        pagination: false,
        showIndexColumn: false,
        scroll: { y: 300 },
      });
      const reloadTable = async () => {
        const newData = await taskHiList({ process_instance_id: process_instance_id.value });
        // Assuming setTableData is a function that sets the fetched data to the table
        setTableData(newData);
      };
      // 示例的 render 函数，负责渲染文件列表
      const renderFileList = (filePaths: string) => {
        const fileList = filePaths.split(','); // 假设文件路径使用逗号分隔
        return (
          <ul>
            {fileList.map((filePath, index) => {
              // 从文件路径中提取文件名
              const pathSegments = filePath.split('/');
              const fileName = pathSegments[pathSegments.length - 1];
              // 构建完整的文件路径href="http://localhost:8080/jeecg-boot/sys/common/static/temp/合同管理_1700626538167.docx"
              const fullFilePath = `${glob.domainUrl}/sys/common/static/${filePath}`;
              return (
                <li key={index}>
                  <a href={fullFilePath} target="_blank" rel="noopener noreferrer">
                    {fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        );
      };

      async function fetchDataBasedOnPropChange(newProcessInstanceId) {
        // Fetch data using the new process_instance_id
        const newData = await queryByProcessId({ process_id: newProcessInstanceId });
        // Update reactive variables or perform other actions
        mockData.value = newData;
        mockData2.value = newData;
      }

      const schema: DescItem[] = [
        {
          field: 'bondholdersName',
          label: '用户名',
        },
        {
          field: 'accountName',
          label: '昵称',
        },
        {
          field: 'phoneNumber',
          label: '联系电话',
        },
        {
          field: 'idCode',
          label: '证件号',
        },
      ];
      const schema2: DescItem[] = [
        {
          field: 'bondholdersType',
          label: '债权类型',
        },
        {
          field: 'money',
          label: '金额',
        },
        {
          field: 'remark',
          label: '说明',
        },
        {
          field: 'file',
          label: '附件',
          render: (val: any, data: Recordable) => {
            // 假设你的数据中包含一个名为 'attachments' 的字段，存储了文件列表
            const filePaths: string = data['file'] || '';
            // 调用 renderFileList 渲染文件列表
            return renderFileList(filePaths);
          },
        },
      ];

      async function handleApply(state) {
        await apply({
          taskId: props.task_id,
          approval_comment: approvalComment.value,
          state: state,
        });
        handleReset();
      }

      function handleReset() {
        approvalComment.value = '';
      }

      return {
        mockData,
        mockData2,
        schema,
        schema2,
        register2,
        glob,
        handleApply,
        registerTimeTable,
        approvalComment,
      };
    },
  });
</script>
