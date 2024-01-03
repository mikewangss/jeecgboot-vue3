import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  getNewsList = '/settlement/applyNews/list',
  getNewsById = '/settlement/applyNews/queryById',
  queryProcessId = '/settlement/applyInfo/queryProcessId',
  save = '/settlement/applyInfo/add',
  edit = '/settlement/applyInfo/edit',
  deleteOne = '/settlement/applyInfo/delete',
  deleteBatch = '/settlement/applyInfo/deleteBatch',
  importExcel = '/settlement/applyInfo/importExcel',
  exportXls = '/settlement/applyInfo/exportXls',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表接口
 * @param params
 */
export const queryProcessId = (params) => defHttp.get({ url: Api.queryProcessId, params });
/**
 * 列表接口
 * @param params
 */
export const getNewsList = (params) => defHttp.get({ url: Api.getNewsList, params });
/**
 * 获取单个
 */
export const getNewsById = (params) => {
  return defHttp.get({ url: Api.getNewsById, params });
};

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
  const url = Api.save;
  return defHttp.post({ url: url, params });
};
