import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import { existsSync, mkdirSync, readdirSync, lstatSync, copyFileSync } from 'fs-extra';
import path from 'path';

import { commonConfig } from './common';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

// 递归拷贝文件夹
function copyDirectory(source: string, outPath: string, inited = false) {
  let destination = outPath;
  if (inited) {
    destination = `${outPath}/src`;
  }

  // 创建目标文件夹
  if (!existsSync(outPath)) {
    mkdirSync(outPath);
  }

  if (!existsSync(destination)) {
    mkdirSync(destination);
  }

  // 读取源文件夹中的所有文件和子文件夹
  const items = readdirSync(source);

  // 遍历文件和子文件夹
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const sourcePath = path.join(source, item);

    const destinationPath = path.join(destination, item);

    // 如果是文件夹，则递归拷贝
    if (lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      // 如果是文件，则直接拷贝
      copyFileSync(sourcePath, destinationPath);
    }
  }
}

function definePackageConfigCss(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;
  const root = process.cwd();
  return defineConfig(async () => {
    copyDirectory(`${root}/src`, path.resolve(root, '../', 'engine/dist/theme'), true);

    const packageConfig: UserConfig = {
      build: {
        lib: {
          entry: 'src/index.ts',
          formats: ['es'],
          fileName: () => 'index.mjs',
        },
        rollupOptions: {
          external: ['vue', 'vue-i18n', 'vue-router'],
          output: {
            format: 'es',
            dir: '../engine/dist/theme',
          },
        },
        sourcemap: false,
      },
    };
    const mergedConfig = mergeConfig(commonConfig, packageConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}

export { definePackageConfigCss };
