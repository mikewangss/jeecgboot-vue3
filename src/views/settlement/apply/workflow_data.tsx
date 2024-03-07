import { BasicColumn } from '/src/components/Table/src/types/table';

import { Badge } from 'ant-design-vue';
import { render } from '@/utils/common/renderUtils';
import { FormSchema } from '@/components/Form';
import { Button } from '@/components/Button';
import { DescItem } from '@/components/Description';
import { usePermission } from '/@/hooks/web/usePermission';
const { isDisabledAuth, hasPermission, initBpmFormData } = usePermission();
export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    ifShow: false,
  },
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '结算申请信息',
  },
  {
    field: 'createBy',
    component: 'Input',
    label: '创建人',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'createTime',
    component: 'Input',
    label: '创建时间',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'reviewDate',
    component: 'Input',
    label: '施工单位送审时间',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'amounts',
    component: 'Input',
    label: '施工单位送审额',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'firstAmounts',
    component: 'InputNumber',
    label: '初审审批金额',
    subLabel: '(单位:元 )',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'secondAmounts',
    component: 'InputNumber',
    label: '复审审批金额',
    subLabel: '(单位:元 )',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'thirdAmounts',
    component: 'InputNumber',
    label: '终审审批金额',
    subLabel: '(单位:元 )',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'totalArea',
    component: 'InputNumber',
    label: '总面积',
    subLabel: '(单位:平方米 )',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '项目基本信息',
  },
  {
    field: 'projectName',
    component: 'Input',
    label: '项目名称',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'unit',
    component: 'Input',
    label: '所属单位',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'owner',
    component: 'Input',
    label: '子分公司名称（发包人）',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'bidder',
    component: 'Input',
    label: '施工单位名称',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '合同基本信息',
  },
  {
    field: 'contractNum',
    component: 'Input',
    label: '合同编号',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'contractName',
    component: 'Input',
    label: '合同名称',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'signDate',
    component: 'Input',
    label: '签订时间',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'totalPrice',
    component: 'Input',
    label: '合同总价',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'startDate',
    component: 'Input',
    label: '合同开始时间',
    defaultValue: '',
    colProps: {
      span: 12,
    },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '终审结果',
  },
  {
    label: '终审单',
    field: 'finalFile',
    component: 'JUpload',
    // componentProps: {
    //   disabled: !hasPermission('settlement:apply_info:upload'),
    // },
    show: ({ values }) => {
      return hasPermission('settlement:apply_info:upload');
    },
  },
];
export const schema: DescItem[] = [
  {
    field: 'createBy',
    label: '创建人',
  },
  {
    field: 'createTime',
    label: '创建时间',
  },
  {
    field: 'amounts',
    label: '施工单位送审额',
  },
  {
    field: 'reviewDate',
    label: '施工单位送审时间',
  },
  {
    field: 'firstAmounts',
    label: '初审审批金额',
  },
  {
    field: 'secondAmounts',
    label: '复审审批金额',
  },
  {
    field: 'thirdAmounts',
    label: '终审审批金额',
  },
  {
    field: 'totalArea',
    label: '总面积',
  },
];
export const schema2: DescItem[] = [
  {
    field: 'projectName',
    label: '项目名称',
  },
  {
    field: 'unit',
    label: '所属单位',
  },
  {
    field: 'owner',
    label: '子分公司名称（发包人）',
  },
  {
    field: 'bidder',
    label: '施工单位名称',
  },
];
export const schema3: DescItem[] = [
  {
    field: 'contractNum',
    label: '合同编号',
  },
  {
    field: 'contractName',
    label: '合同名称',
  },
  {
    field: 'signDate',
    label: '签订时间',
  },
  {
    field: 'totalPrice',
    label: '合同总价',
  },
  {
    field: 'startDate',
    label: '合同开始时间',
  },
  {
    field: 'endDate',
    label: '合同结束时间',
  },
  {
    field: 'finalFile',
    label: '终审单',
  },
];
export const columns: BasicColumn[] = [
  {
    title: '任务节点名称',
    align: 'center',
    dataIndex: 'taskName',
  },
  {
    title: '任务ID',
    align: 'center',
    dataIndex: 'taskId',
  },
  {
    title: '流程名称',
    align: 'center',
    dataIndex: 'procDefName',
  },
  {
    title: '审批人',
    width: 150,
    dataIndex: 'assigneeId',
  },
  {
    title: '发起人',
    width: 150,
    dataIndex: 'startUserName',
  },
  {
    title: '所属部门',
    width: 150,
    dataIndex: 'startDeptName',
  },
  {
    title: '开始时间',
    width: 150,
    dataIndex: 'createTime',
  },
  {
    title: '结束时间',
    width: 150,
    dataIndex: 'finishTime',
  },
  {
    title: '办理时长',
    width: 150,
    dataIndex: 'duration',
  },
];

export const fileColumns: BasicColumn[] = [
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
