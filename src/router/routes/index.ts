import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import {LAYOUT} from "@/router/constant";

const modules = import.meta.glob('./modules/**/*.ts', { eager: true });

const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  //新版后台登录，如果想要使用旧版登录放开即可
  // component: () => import('/@/views/sys/login/Login.vue'),
  component: () => import('/@/views/system/loginmini/MiniLogin.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};
export const RegisterRoute: AppRouteRecordRaw = {
  path: '/register',
  name: 'Register',
  //新版后台登录，如果想要使用旧版登录放开即可
  // component: () => import('/@/views/sys/login/Login.vue'),
  component: () => import('/@/views/system/loginmini/Register.vue'),
  meta: {
    title: t('routes.basic.register'),
    ignoreAuth: true,
  },
};
export const HomeRoute: AppRouteRecordRaw = {
  path: '/home',
  name: 'Home',
  component: () => import('/@/views/home/Home.vue'),
  meta: {
    title: '首页',
    ignoreAuth: true,
  },
};
export const AboutRoute: AppRouteRecordRaw = {
  path: '/about',
  name: 'About',
  component: () => import('/@/views/home/About.vue'),
  meta: {
    title: '关于我们',
    ignoreAuth: true,
  },
};

export const settlementRoute: AppRouteModule = {
  path: '/settlement',
  name: 'Settlement',
  component: () => import('/@/views/settlement/apply/index.vue'),
  redirect: '/settlement/applyInfo/add',
  meta: {
    title: '结算平台',
  },
};
export const NewsListRoute: AppRouteRecordRaw = {
  path: '/newsList',
  name: 'NewsList',
  component: () => import('/@/views/home/NewsList.vue'),
  meta: {
    title: '行业动态',
    ignoreAuth: true,
  },
};
export const NewsDetailRoute: AppRouteRecordRaw = {
  path: '/newsDetail',
  name: 'NewsDetail',
  component: () => import('/@/views/home/NewsDetail.vue'),
  meta: {
    title: '新闻详情',
    ignoreAuth: true,
  },
};
export const Oauth2LoginRoute: AppRouteRecordRaw = {
  path: '/oauth2-app/login',
  name: 'oauth2-app-login',
  //新版钉钉免登录，如果想要使用旧版放开即可
  // component: () => import('/@/views/sys/login/OAuth2Login.vue'),
  component: () => import('/@/views/system/loginmini/OAuth2Login.vue'),
  meta: {
    title: t('routes.oauth2.login'),
  },
};

/**
 * 【通过token直接静默登录】流程办理登录页面 中转跳转
 */
export const TokenLoginRoute: AppRouteRecordRaw = {
  path: '/tokenLogin',
  name: 'TokenLoginRoute',
  component: () => import('/@/views/sys/login/TokenLoginPage.vue'),
  meta: {
    title: '带token登录页面',
    ignoreAuth: true,
  },
};

// Basic routing without permission
export const basicRoutes = [
  HomeRoute,
  NewsDetailRoute,
  settlementRoute,
  NewsListRoute,
  AboutRoute,
  LoginRoute,
  RegisterRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  TokenLoginRoute,
  Oauth2LoginRoute,
];
