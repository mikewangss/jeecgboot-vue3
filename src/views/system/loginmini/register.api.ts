import { defHttp, wfHttp } from '/@/utils/http/axios';

enum Api {
  supplierRegister = '/sys/user/supplierRegister',
}

/**
 * 列表接口
 * @param params
 */
export const supplierRegister = (params) => defHttp.post({ url: Api.supplierRegister, params });

