import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import {DeptListItem} from "@/api/demo/model/systemModel";
const { createConfirm } = useMessage();
import { DemoOptionsItem, selectParams } from './components/optionsModel';

enum Api {
  list = '/settlement/applyProject/list',
  queryContractById = '/settlement/applyContract/queryById',
  querySupplierList = '/settlement/applySupplier/querySupplierList',
  projectListApi = '/settlement/applyProject/myProjectList',
  myProjectPageList = '/settlement/applyProject/myProjectPageList',
  save = '/settlement/applyProject/add',
  edit = '/settlement/applyProject/edit',
  deleteOne = '/settlement/applyProject/delete',
  deleteBatch = '/settlement/applyProject/deleteBatch',
  importExcel = '/settlement/applyProject/importExcel',
  exportXls = '/settlement/applyProject/exportXls',
  applyContractList = '/settlement/applyProject/queryApplyContractByMainId',
  applyFilesList = '/settlement/applyProject/queryApplyFilesByMainId',
}
export const contractListApi = (params) => defHttp.get({ url: Api.applyContractList, params });
export const projectListApi = (params) => defHttp.get({ url: Api.projectListApi, params });
export const myProjectPageList = (params) => defHttp.get({ url: Api.myProjectPageList, params });
/**
 * @description: Get sample options value
 */
export const getSupplierList = (params?: selectParams) => defHttp.get({ url: Api.querySupplierList, params });
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 合同接口
 * @param params
 */
export const queryContractById = (params) => defHttp.get({ url: Api.queryContractById, params });
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 查询子表数据
 * @param params
 */
export const applyContractList = Api.applyContractList;
/**
 * 查询子表数据
 * @param params
 */
export const applyFilesList = Api.applyFilesList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
