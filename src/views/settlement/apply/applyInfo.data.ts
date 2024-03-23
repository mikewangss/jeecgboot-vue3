import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { Input, render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '标题',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '项目名称',
    align: 'center',
    dataIndex: 'projectId',
  },
  {
    title: '合同名称',
    align: 'center',
    dataIndex: 'contractId',
    customRender: ({ text }) => {
      return text;
    },
  },
  {
    title: '施工单位送审额',
    align: 'center',
    dataIndex: 'amounts',
  },
  {
    title: '施工单位送审时间',
    align: 'center',
    dataIndex: 'reviewDate',
  },
  {
    title: '结算状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      // 判断 outcome 是否存在
      const outcome = text ? text : '审批中'; // 使用 'N/A' 或其他备用文本
      const color = text != '结算归档' ? 'yellow' : 'blue'; // 根据审批结果设置标签类型
      return render.renderTag(outcome, color);
    },
  },
  {
    title: '终审单',
    align: 'center',
    dataIndex: 'finalFile',
  },
  {
    title: '创建人',
    align: 'center',
    dataIndex: 'createBy',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const applyFormSchema: FormSchema[] = [
  {
    label: '手机号',
    field: 'phoneNumber',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入手机号!' }];
    },
  },
  {
    label: '债券人姓名',
    field: 'bondholdersName',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入债券人姓名!' }];
    },
  },
  {
    label: '证件号',
    field: 'idCode',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入证件号!' }];
    },
  },
  {
    label: '收款银行',
    field: 'bankName',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入收款银行!' }];
    },
  },
  {
    label: '银行账户',
    field: 'bankAccount',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入银行账户!' }];
    },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入户名!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: 'id',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return applyFormSchema;
}
