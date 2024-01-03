import { FormSchema } from '/@/components/Form';
import { useUserStore } from '@/store/modules/user';
import { supplierListApi } from '@/api/demo/select';
const dynamicDefaultValue = '结算申请流程-' + getUserName() + '-' + getCurrentYearMonthDay();

export const step1Schemas: FormSchema[] = [
  {
    label: '标题',
    component: 'Input',
    field: 'name',
    defaultValue: dynamicDefaultValue,
    show: false,
  },
  {
    label: '供应商',
    component: 'ApiSelect',
    field: 'supplierId',
    componentProps: {
      api: supplierListApi,
      params: {
        username: getUserName(),
      },
      resultField: 'list',
      labelField: 'supplierName',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'bondholdersName',
    component: 'Input',
    label: '债券人姓名',
    required: true,
    defaultValue: '',
  },
  {
    field: 'idCode',
    component: 'Input',
    label: '证件号',
    required: true,
    defaultValue: '',
  },
  {
    field: 'phoneNumber',
    component: 'Input',
    label: '手机号',
    required: true,
    defaultValue: '',
  },
  {
    field: 'bankName',
    component: 'Input',
    label: '收款银行',
    defaultValue: '',
    required: true,
  },
  {
    field: 'bankAccount',
    component: 'Input',
    label: '银行账户',
    defaultValue: '',
    required: true,
  },
  {
    field: 'accountName',
    component: 'Input',
    label: '户名',
    defaultValue: '',
    required: true,
  },
];
// Helper function to get current year, month, and day in the format YYYYMMDD
function getCurrentYearMonthDay() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Helper function to get the user's name (replace this with your actual logic)
function getUserName() {
  const userStore = useUserStore();
  const username = userStore.getUserInfo?.username;
  return username; // Placeholder value
}
export const step2Schemas: FormSchema[] = [
  {
    field: 'bondholdersType',
    component: 'CheckboxGroup',
    label: '债权类型',
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
