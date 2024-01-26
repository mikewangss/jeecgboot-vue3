/**
 * 这段代码是一个Vue.js指令（Directive），用于处理页面加载时的加载状态。该指令被命名为`v-loading`，可以通过在元素上使用该指令来控制加载状态的显示和隐藏。
 *
 * 以下是代码的主要逻辑：
 *
 * 1. 通过`createLoading`函数创建一个加载组件实例，并根据绑定的属性设置加载组件的相关参数。
 * 2. 在`mounted`钩子中，当指令绑定的元素被挂载到DOM上时，创建加载组件实例，并将实例挂载到元素的`instance`属性上，以便后续可以在其他钩子中访问。
 * 3. 在`updated`钩子中，当指令绑定值发生变化时，更新加载组件的相关属性，例如加载提示文本和加载状态。
 * 4. 在`unmounted`钩子中，当指令绑定的元素被销毁时，关闭加载组件实例。
 *
 * 总体来说，该指令允许你在元素上添加`v-loading`属性，以控制加载状态的显示和隐藏，并通过元素的属性来配置加载组件的各种参数。在Vue应用中使用时，可以通过`setupLoadingDirective`函数将该指令注册到应用中，以便在组件中使用。
 */
import { createLoading } from '/@/components/Loading';
import type { Directive, App } from 'vue';

const loadingDirective: Directive = {
  mounted(el, binding) {
    const tip = el.getAttribute('loading-tip');
    const background = el.getAttribute('loading-background');
    const size = el.getAttribute('loading-size');
    const fullscreen = !!binding.modifiers.fullscreen;
    const instance = createLoading(
      {
        tip,
        background,
        size: size || 'large',
        loading: !!binding.value,
        absolute: !fullscreen,
      },
      fullscreen ? document.body : el
    );
    el.instance = instance;
  },
  updated(el, binding) {
    const instance = el.instance;
    if (!instance) return;
    instance.setTip(el.getAttribute('loading-tip'));
    if (binding.oldValue !== binding.value) {
      if (binding.oldValue !== binding.value) {
        instance.setLoading?.(binding.value && !instance.loading);
      }
    }
  },
  unmounted(el) {
    el?.instance?.close();
  },
};

export function setupLoadingDirective(app: App) {
  app.directive('loading', loadingDirective);
}

export default loadingDirective;
