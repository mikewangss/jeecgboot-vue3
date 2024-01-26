/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * 这段代码是一个Vue.js指令（Directive），
 * 用于在应用中实现对组件权限的细粒度控制。这个指令被命名为v-auth，
 * 可以在组件上使用，通过绑定权限值来进行权限控制。
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue';

import { usePermission } from '/@/hooks/web/usePermission';

function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission();

  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
