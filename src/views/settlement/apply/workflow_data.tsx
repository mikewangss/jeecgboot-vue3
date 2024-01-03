import { BasicColumn } from '/src/components/Table/src/types/table';

import { Badge } from 'ant-design-vue';
import {render} from "@/utils/common/renderUtils";
import {FormSchema} from "@/components/Form";

export const columns: BasicColumn[] = [
  {
    title: 'ProcessInstanceId',
    align: 'center',
    dataIndex: 'process_instance_id',
    ifShow: false,
  },
  {
    title: '任务ID',
    align: 'center',
    dataIndex: 'task_id',
  },
  {
    title: '节点名称',
    width: 150,
    dataIndex: 'name',
  },
  {
    title: '节点状态', // Add a new column for approval parameters
    dataIndex: 'approvalParameters',
    customRender: ({ text }) => {
      // 判断 outcome 是否存在
      const outcome = text && text.outcome ? text.outcome : '审批中'; // 使用 'N/A' 或其他备用文本
      const color = outcome === '通过' ? 'blue' : 'yellow'; // 根据审批结果设置标签类型
      return render.renderTag(outcome, color);
    },
  },
  {
    title: '审批人',
    width: 150,
    dataIndex: 'approvalParameters',
    customRender: ({ text }) => {
      const assignee = text && text.assignee ? text.assignee : ''; // 使用 'N/A' 或其他备用文本
      return <span>{assignee}</span>;
    },
  },
  {
    title: '审批意见',
    width: 150,
    dataIndex: 'approvalParameters',
    customRender: ({ text }) => {
      const approval_comment = text && text.approval_comment ? text.approval_comment : ''; // 使用 'N/A' 或其他备用文本
      return <span>{approval_comment}</span>;
    },
  },
  {
    title: '开始时间',
    width: 150,
    dataIndex: 'start_time',
  },
  {
    title: '结束时间',
    width: 150,
    dataIndex: 'end_time',
  },
  {
    title: '办理时长',
    width: 150,
    dataIndex: 'duration',
  },
];

export const refundTimeTableData: any[] = [];

//查询数据
export const searchFormSchema: FormSchema[] = [];
