import 'uno.css';
import './styles/common.scss';
import 'element-plus/theme-chalk/dark/css-vars.css';

import { plugins, init } from 'etfm-engine';
import { staticRoutes } from './router';
import { transformObjToRoute } from './router/helper/routerHelper';
import PluginUser from './plugin/plugin-user';

import logo from '@/assets/images/logo.png';

async function boostrap() {

  await plugins.register(PluginUser);

  const routes = transformObjToRoute(staticRoutes);

  const preference = new Map();

  preference.set('PluginElementPreset', {
    uniqueOpened: true,
    title: 'Etfm Admin',
    image: logo,
  });

  await init(
    {
      router: {
        routes,
      },
    },
    preference,
  );
}

boostrap();
