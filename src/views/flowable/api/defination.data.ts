import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '流程id',
    align: 'center',
    dataIndex: 'id',
  },
  {
    title: '流程名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '流程分类',
    align: 'center',
    dataIndex: 'category',
  },
  {
    title: '流程key',
    align: 'center',
    dataIndex: 'key',
    customRender: ({ text }) => {
      return text;
    },
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
  },
  {
    title: '流程定义是否最新版本',
    align: 'center',
    dataIndex: 'isLastVersion',
  },
  {
    title: '流程定义状态',
    align: 'center',
    dataIndex: 'suspensionState',
  },
  {
    title: '部署时间',
    align: 'center',
    dataIndex: 'deploymentTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '流程名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入流程名称!' }];
    },
  },
  {
    label: '流程分类',
    field: 'category',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入流程分类!' }];
    },
  },
  {
    label: '流程key',
    field: 'key',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入流程key!' }];
    },
  },
  {
    label: '版本',
    field: 'version',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入版本!' }];
    },
  },
  {
    label: '流程定义状态',
    field: 'suspensionState',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入suspensionState!' }];
    },
  },
  {
    label: '部署时间',
    field: 'deploymentTime',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入户名!' }];
    },
  },
  {
    label: 'xml',
    field: 'xml',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入衡量标准',
      rows: 30,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入xml!' }];
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
  return formSchema;
}
