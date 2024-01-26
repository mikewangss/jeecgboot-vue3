import { defHttp, wfHttp } from '/@/utils/http/axios';

enum Api {
  supplierRegister = '/settlement/applySupplier/supplierRegister',
}

/**
 * 列表接口
 * @param params
 */
export const supplierRegister = (params) => defHttp.post({ url: Api.supplierRegister, params });
