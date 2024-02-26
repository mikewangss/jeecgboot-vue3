import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn, JVxeLinkageConfig } from '/@/components/jeecg/JVxeTable/types';
import { ref } from 'vue/dist/vue';
import { getSupplierList } from '/@/views/settlement/project/ApplyProject.api';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '项目名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '项目编号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '所属单位',
    align: 'center',
    dataIndex: 'unit_dictText',
  },
  {
    title: '负责主体',
    align: 'center',
    dataIndex: 'owner_dictText',
  },
  {
    title: '开始时间',
    align: 'center',
    dataIndex: 'startDate',
  },
  {
    title: '结束时间',
    align: 'center',
    dataIndex: 'endDate',
  },
  {
    title: '中标单位',
    align: 'center',
    dataIndex: 'bidder_dictText',
  },
  {
    title: '是否结案',
    align: 'center',
    dataIndex: 'status',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '项目名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '项目编号',
    field: 'code',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '中标单位',
    field: 'bidder',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'sys_depart,depart_name,id',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '项目名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入项目名称!' }];
    },
  },
  {
    label: '项目编号',
    field: 'code',
    component: 'Input',
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入项目编号!' }];
    },
  },
  {
    field: 'unit',
    component: 'JTreeSelect',
    label: '所属单位',
    colProps: { span: 12 },
    helpMessage: ['component模式'],
    componentProps: {
      dict: 'sys_depart,depart_name,id',
      pidField: 'parent_id',
      hasChildField: 'iz_leaf',
      converIsLeafVal: 0,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入所属单位!' }];
    },
  },
  {
    label: '子分公司名称（发包人）',
    component: 'ApiSelect',
    field: 'owner',
    componentProps: {
      api: getSupplierList,
      params: {
        type: 0,
      },
      resultField: 'list',
      labelField: 'supplierName',
      valueField: 'id',
    },
    required: true,
    colProps: { span: 12 },
  },
  // {
  //   field: 'owner',
  //   component: 'Input',
  //   label: '子分公司名称（发包人）',
  //   required: true,
  //   slot: 'remoteSearch',
  //   colProps: { span: 12 },
  // },
  // {
  //   label: '开始时间',
  //   field: 'startDate',
  //   colProps: { span: 12 },
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //   },
  //   dynamicRules: ({ model, schema }) => {
  //     return [{ required: true, message: '请输入开始时间!' }];
  //   },
  // },
  // {
  //   label: '结束时间',
  //   field: 'endDate',
  //   colProps: { span: 12 },
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //   },
  //   dynamicRules: ({ model, schema }) => {
  //     return [{ required: true, message: '请输入结束时间!' }];
  //   },
  // },
  {
    label: '施工单位名称',
    component: 'ApiSelect',
    field: 'bidder',
    componentProps: {
      api: getSupplierList,
      params: {
        type: 1,
      },
      resultField: 'list',
      labelField: 'supplierName',
      valueField: 'id',
    },
    required: true,
    colProps: { span: 12 },
  },

  // {
  //   field: 'status',
  //   component: 'RadioButtonGroup',
  //   label: '是否结案',
  //   colProps: { span: 12 },
  //   componentProps: {
  //     options: [
  //       {
  //         label: '结案',
  //         value: '1',
  //       },
  //       {
  //         label: '未结',
  //         value: '0',
  //       },
  //     ],
  //   },
  // },
  {
    label: '描述',
    colProps: { span: 12 },
    field: 'description',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表表格配置
export const applyContractColumns: JVxeColumn[] = [
  {
    title: '合同编号',
    key: 'contractNum',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '合同名称',
    key: 'contractName',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '签订时间',
    key: 'signDate',
    type: JVxeTypes.date,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '合同类型',
    key: 'type',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'contract_type',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '专业类型',
    key: 'major',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'major_type',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '项目期区',
    key: 'period',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'project_period',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '合同状态',
    key: 'status',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'contract_status',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '预计完工时间',
    key: 'estimatedDate',
    type: JVxeTypes.date,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '实际开工时间',
    key: 'startDate',
    type: JVxeTypes.date,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '竣备时间',
    key: 'endDate',
    type: JVxeTypes.date,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '总价(万元)',
    key: 'totalPrice',
    width: '200px',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '已发生产值',
    key: 'outputValue',
    width: '200px',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '已付款金额(万元)',
    key: 'amountPaid',
    type: JVxeTypes.inputNumber,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
];
export const applyFilesColumns: JVxeColumn[] = [
  {
    title: '文件名称',
    key: 'fileName',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '分册',
    key: 'fc',
    type: JVxeTypes.select,
    width: '180px',
    // 联动字段（即下一级的字段）
    linkageKey: 'bizType',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '文件类型',
    key: 'bizType',
    type: JVxeTypes.select,
    width: '180px',
    placeholder: '请选择${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '文件',
    key: 'file',
    type: JVxeTypes.file,
    token: true,
    responseName: 'message',
    width: '200px',
    placeholder: '请选择文件',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
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
