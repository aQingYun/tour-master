import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: 'node16',
  externals: ['@vue/reactivity', '@floating-ui/dom', '@vueuse/shared'],
  failOnWarn: false,
});
