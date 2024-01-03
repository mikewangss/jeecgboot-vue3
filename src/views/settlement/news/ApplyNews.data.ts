import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {uploadUrl} from "@/api/common/api";
import {UploadTypeEnum} from "@/components/Form/src/jeecg/components/JUpload";
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '标题',
    align:"center",
    dataIndex: 'title'
   },
   {
    title: '头像',
    align:"center",
    dataIndex: 'avatar'
   },
   {
    title: '图片',
    align:"center",
    dataIndex: 'img'
   },
   {
    title: '简介',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '内容',
    align:"center",
    dataIndex: 'content'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '头像',
    field: 'avatar',
    component: 'Input',
  },
  {
    field: 'img',
    component: 'JUpload',
    label: '上传图片（1）',
    helpMessage: '最多上传1张图片',
    componentProps: {
      fileType: UploadTypeEnum.image,
      maxCount: 1,
    },
  },
  {
    label: '简介',
    field: 'description',
    component: 'Input',
  },
  {
    label: '内容',
    field: 'content',
    component: 'Input',
    render: render.renderTinymce,
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];



/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
