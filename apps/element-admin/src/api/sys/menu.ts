import { http } from '@etfm/plugin-http';

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return http.get({ url: Api.GetMenuList });
};
