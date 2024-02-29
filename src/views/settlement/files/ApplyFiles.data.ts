import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {filterDictTextByCache} from "@/utils/dict/JDictSelectUtil";
import {contractListApi, queryContractById} from "@/views/settlement/project/ApplyProject.api";
import {getSubFileMenu} from "@/views/settlement/files/ApplyFiles.api";
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '文件名称',
    align: 'center',
    dataIndex: 'fileName',
  },
  {
    title: '分册',
    align: 'center',
    dataIndex: 'fc',
    customRender: ({ text }) => {
      return render.renderDict(text, 'apply_fc');
    },
  },
  {
    title: '文件类型',
    align: 'center',
    dataIndex: 'bizType',
    customRender: ({ text }) => {
      return render.renderDict(text, 'apply_file_type');
    },
  },
  {
    title: '是否审批通过',
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
    title: '审批意见',
    align: 'center',
    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    field: 'fc',
    component: 'JDictSelectTag',
    label: '分册',
    componentProps: ({ formModel, formActionType }) => {
      return {
        dictCode: 'apply_fc',
        onChange: async (e: any) => {
          if (e) {
            getSubFileMenu({ parent: e }).then((res) => {
              const bizTypeList = res || [];
              bizTypeList.map((o) => {
                o.label = o.name;
                o.value = o.id;
                o.key = o.id;
              });
              formModel.bizType = undefined; //  reset city value
              const { updateSchema } = formActionType;
              updateSchema({
                field: 'bizType',
                componentProps: {
                  options: bizTypeList,
                },
              });
            });
          }
        },
      };
    },
  },
  {
    field: 'bizType',
    component: 'Select',
    label: '文件类型',
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
    label: '文件',
    field: 'file',
    component: 'JUpload',
    componentProps: {},
  },
  {
    label: '是否审批通过',
    field: 'flag',
    component: 'JSwitch',
    defaultValue: '0',
    componentProps: {
      options: [0, 1],
    },
  },
  {
    label: '审批意见',
    field: 'description',
    component: 'Input',
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
