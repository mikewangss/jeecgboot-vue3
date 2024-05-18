import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn, JVxeLinkageConfig } from '/@/components/jeecg/JVxeTable/types';
import { usePermission } from '/@/hooks/web/usePermission';
const { isDisabledAuth, hasPermission, initBpmFormData } = usePermission();
import { getSupplierList } from '/@/views/settlement/project/ApplyProject.api';
import { treeOptionsListApi } from '@/api/demo/tree';
// 生成唯一编号的函数
function generateUniqueNumber() {
  return 'No' + Math.random().toString(36).substr(2, 9); // 生成随机字符串
}
//查询数据
export const searchFormSchema: FormSchema[] = [];
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
    title: '子分公司名称（发包人）',
    align: 'center',
    dataIndex: 'owner_dictText',
  },
  {
    title: '施工单位名称',
    align: 'center',
    dataIndex: 'bidder_dictText',
  },
  // {
  //   title: '是否结案',
  //   align: 'center',
  //   dataIndex: 'status',
  // },
];
//查询数据
/*export const searchFormSchema: FormSchema[] = [
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
    label: '施工单位名称',
    field: 'bidder',
    component: 'ApiSelect',
    slot: 'localSearch1',
    colProps: { span: 6 },
  },
];*/
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
    defaultValue: generateUniqueNumber(),
    component: 'Input',
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入项目编号!' }];
    },
  },
  {
    field: 'unit',
    component: 'JSelectDept',
    label: '所属单位',
    componentProps: { showButton: false },
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入所属单位!' }];
    },
  },
  {
    label: '子分公司名称（发包人）',
    component: 'Input',
    field: 'owner',
    slot: 'localSearch',
    required: true,
    colProps: { span: 12 },
  },
  {
    label: '施工单位名称',
    component: 'Input',
    field: 'bidder',
    slot: 'localSearch1',
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
    title: 'id',
    key: 'id',
    type: JVxeTypes.hidden,
  },
  {
    title: '合同编号',
    key: 'contractNum',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: generateUniqueNumber(),
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '合同名称',
    key: 'contractName',
    type: JVxeTypes.input,
    minWidth: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '签订时间',
    key: 'signDate',
    type: JVxeTypes.date,
    minWidth: '200px',
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
    minWidth: '200px',
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
    minWidth: '200px',
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
    minWidth: '140px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '合同状态',
    key: 'status',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'contract_status',
    minWidth: '140px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '预计完工时间',
    key: 'estimatedDate',
    type: JVxeTypes.date,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '实际开工时间',
    key: 'startDate',
    type: JVxeTypes.date,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '竣备时间',
    key: 'endDate',
    type: JVxeTypes.date,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '总价(元)',
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
    width: '150px',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    defaultValue: '0',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '已付款金额(元)',
    key: 'amountPaid',
    type: JVxeTypes.inputNumber,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '0',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
];
export const applyFilesColumns: JVxeColumn[] = [
  {
    title: 'id',
    key: 'id',
    type: JVxeTypes.hidden,
  },
  {
    title: '文件名称',
    key: 'fileName',
    type: JVxeTypes.input,
    minWidth: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '分册',
    key: 'fc',
    type: JVxeTypes.select,
    minWidth: '180px',
    // 联动字段（即下一级的字段）
    linkageKey: 'bizType',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '文件类型',
    key: 'bizType',
    type: JVxeTypes.select,
    minWidth: '180px',
    placeholder: '请选择${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '文件',
    key: 'file',
    type: JVxeTypes.file,
    token: true,
    responseName: 'message',
    minWidth: '200px',
    placeholder: '请选择文件',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '是否审批通过',
    key: 'flag',
    type: JVxeTypes.select,
    options: [
      { title: '通过', value: '1' },
      { title: '不通过', value: '0' },
    ],
    width: '100px',
    fixed: 'right',
    placeholder: '请输入${title}',
    defaultValue: '1',
    validateRules: [
      {
        required: hasPermission('settlement:apply_files:addComment'),
        message: '${title}不能为空',
      },
    ],
    disabled: !hasPermission('settlement:apply_files:addComment'),
  },
  {
    title: '审批意见',
    key: 'description',
    type: JVxeTypes.textarea,
    minWidth: '200px',
    fixed: 'right',
    placeholder: '请输入${title}',
    defaultValue: '无',
    validateRules: [
      {
        required: hasPermission('settlement:apply_files:addComment'),
        message: '${title}不能为空',
      },
    ],
    disabled: !hasPermission('settlement:apply_files:addComment'),
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
