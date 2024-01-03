import { FormSchema } from '/@/components/Form';
import { useUserStore } from '@/store/modules/user';
export const step2Schemas: FormSchema[] = [
  {
    field: 'suply',
    component: 'CheckboxGroup',
    label: '供应商名称',
    defaultValue: '',
    required: true,
    componentProps: {
      options: [
        {
          label: '工资',
          value: '1',
        },
        {
          label: '施工款',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'money',
    component: 'Input',
    label: '金额',
    defaultValue: '',
    required: true,
    renderComponentContent: () => {
      return {
        prefix: () => '￥',
      };
    },
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '说明',
    defaultValue: '',
    required: true,
  },
  {
    field: 'file',
    component: 'JUpload',
    label: '附件',
    defaultValue: '',
    required: true,
  },
];
