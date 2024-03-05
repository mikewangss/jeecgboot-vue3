import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '供应商名称',
    align: 'center',
    dataIndex: 'supplierName',
  },
  {
    title: '法人姓名',
    align: 'center',
    dataIndex: 'legalPersonName',
  },
  {
    title: '法人身份证',
    align: 'center',
    dataIndex: 'legalPersonIdcard',
  },
  {
    title: '法人电话',
    align: 'center',
    dataIndex: 'legalPersonPhone',
  },
  {
    title: '公司地址',
    align: 'center',
    dataIndex: 'firmAddress',
  },
  {
    title: '营业执照开始日期',
    align: 'center',
    dataIndex: 'businessLicenseStartDate',
  },
  {
    title: '营业执照结束日期',
    align: 'center',
    dataIndex: 'businessLicenseEndDate',
  },
  {
    title: '营业执照',
    align: 'center',
    dataIndex: 'businessLicenseFile',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const supplierFormSchema: FormSchema[] = [
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '用户信息',
  },
  {
    label: '用户名称',
    field: 'username',
    component: 'Input',
    colProps: {
      span: 12,
    },
  },
  {
    label: '用户手机号',
    field: 'phone',
    component: 'Input',
    colProps: {
      span: 12,
    },
  },
  {
    label: '用户邮箱',
    field: 'email',
    component: 'Input',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '供应商信息',
  },
  {
    label: '供应商名称',
    field: 'supplierName',
    component: 'Input',
    colProps: {
      span: 12,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入供应商名称!' }];
    },
  },
  {
    label: '法人姓名',
    field: 'legalPersonName',
    component: 'Input',
    colProps: {
      span: 12,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入法人姓名!' }];
    },
  },
  {
    label: '法人身份证',
    field: 'legalPersonIdcard',
    component: 'Input',
    colProps: {
      span: 12,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入法人身份证!' }];
    },
  },
  {
    label: '法人电话',
    field: 'legalPersonPhone',
    component: 'Input',
    colProps: {
      span: 12,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入法人电话!' }];
    },
  },
  {
    label: '公司地址',
    field: 'firmAddress',
    component: 'Input',
    colProps: {
      span: 12,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入公司地址!' }];
    },
  },
  {
    label: '营业执照开始日期',
    field: 'businessLicenseStartDate',
    component: 'Input',
    colProps: {
      span: 12,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入营业执照开始日期!' }];
    },
  },
  {
    label: '营业执照结束日期',
    field: 'businessLicenseEndDate',
    component: 'Input',
    colProps: {
      span: 12,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入营业执照结束日期!' }];
    },
  },
  {
    label: '营业执照',
    field: 'businessLicenseFile',
    component: 'JUpload',
    componentProps: {},
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入营业执照!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '项目信息',
  },
  {
    label: '项目名称',
    field: 'projectName',
    component: 'Input',
    colProps: {
      span: 12,
    },
  },
  {
    label: '项目对接人',
    field: 'projectManger',
    component: 'Input',
    colProps: {
      span: 12,
    },
  },
  {
    label: '项目对接人手机号',
    field: 'projectMangerPhone',
    component: 'Input',
    colProps: {
      span: 12,
    },
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return supplierFormSchema;
}
