import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '文件名称',
    align: 'center',
    dataIndex: 'fileName',
  },
  {
    title: '文件类型',
    align: 'center',
    dataIndex: 'bizType',
  },
  {
    title: '是否可用',
    align: 'center',
    dataIndex: 'flag',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: '0' },
        { text: '否', value: '1' },
      ]);
    },
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '分册',
    align: 'center',
    dataIndex: 'fc_dictText',
  },
  {
    title: '文件',
    align: 'center',
    dataIndex: 'file',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    field: 'fc',
    component: 'Select',
    label: '分册',
    colProps: {
      span: 8,
    },
    componentProps: ({ formModel, formActionType }) => {
      return {
        dictCode: 'apply_fc',
        onChange: (e: any) => {
          const { updateSchema } = formActionType;
          updateSchema({
            field: 'bizType',
            componentProps: {
              options: [{ label: '国内订单', value: '1', key: '1' }],
            },
          });
        },
      };
    },
  },
  {
    field: 'bizType',
    component: 'Select',
    label: '文件类型',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [], // defalut []
    },
  },
  {
    label: '文件名称',
    field: 'fileName',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '文件',
    field: 'file',
    component: 'JUpload',
    componentProps: {},
  },
  {
    label: '是否可用',
    field: 'flag',
    component: 'JSwitch',
    defaultValue: '0',
    componentProps: {
      options: [0, 1],
    },
  },
  {
    label: '',
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
