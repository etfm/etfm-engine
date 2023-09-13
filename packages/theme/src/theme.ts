import { IPublicTheme, IPublicThemeOptins } from '@etfm/types';
import {
  DEFAULT_PRIMARY_VAR,
  DEFAULT_LIGHT,
  DEFAULT_DARK,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_THEME,
} from './constants';

import { engineConfig } from '@etfm/editor';

export class Theme implements IPublicTheme {
  private _theme: string = DEFAULT_THEME;
  private _isDark: boolean = false;
  private _color: string;
  private mixLightColor;
  private mixDarkColor;

  private _overrides: Record<string, any>;

  get overrides() {
    return this._overrides;
  }

  get isDark() {
    return this._isDark;
  }

  get theme() {
    return this._theme;
  }

  get color() {
    return this._color;
  }

  get cssVar() {
    const defaultCssVar = this.defaultCssVar();

    return {
      ...defaultCssVar,
      ...this.overrides,
    };
  }

  constructor() {
    this.setConfig({
      theme: DEFAULT_THEME,
      color: DEFAULT_PRIMARY_COLOR,
      mixDarkColor: DEFAULT_DARK,
      mixLightColor: DEFAULT_LIGHT,
      overrides: {},
      isDark: false,
    });

    engineConfig.onceGot('theme').then((theme: IPublicThemeOptins) => {
      this.setConfig(theme);
    });

    engineConfig.onGot('theme.overrides', (e) => {
      this.setConfig({
        overrides: e ?? this.overrides,
      });
      this.reload();
    });
  }

  setConfig(options: Partial<IPublicThemeOptins>) {
    this._theme = options?.theme ?? this.theme;
    this._color = options?.color ?? this.color;
    this._overrides = options?.overrides ?? this.overrides;
    this._isDark = options?.isDark ?? this.isDark;
    this.mixDarkColor = options?.mixDarkColor ?? this.mixDarkColor;
    this.mixLightColor = options?.mixLightColor ?? this.mixLightColor;

    this.reload();
  }

  /**
   * 强制刷新主题变更
   * @param
   */
  reload() {
    this.setCssVar();
  }

  /**
   * 设置主题类型
   * @default light
   * @param theme
   */
  setTheme(theme: string) {
    this._theme = theme;

    this.reload();
  }

  /**
   * 设置颜色主题
   * @param color
   */
  setColor(color: string) {
    this._color = color;

    this.reload();
  }

  /**
   * 设置暗黑主题
   * @param theme
   */
  setDark(dark: boolean) {
    this._isDark = dark;

    this.reload();
  }

  /**
   * 设置主题混入颜色
   * @param color
   */
  setMixDarkColor(color: string) {
    this.mixDarkColor = color;

    this.reload();
  }

  /**
   * 设置主题混入颜色
   * @param color
   */
  setMixLightColor(color: string) {
    this.mixLightColor = color;
  }

  /**
   * 设置主题变量覆盖
   * @param overrides
   */
  setOverrides(overrides: Record<string, any>) {
    this._overrides = overrides;
    this.reload();
  }

  /**
   * 暗黑主题切换
   * @param
   */
  toggle() {
    engineConfig.set('theme.isDark', !this._isDark);
  }

  /**
   * 切换主题颜色
   * @param color
   */
  change(color?: string) {
    engineConfig.set('theme.color', color);
  }

  /**
   * 设置css变量
   * @param overrides
   */
  setCssVar(overrides?: Record<string, any>) {
    overrides && (this._overrides = overrides);
    document.documentElement.className = this.isDark ? 'dark' : 'light';

    for (const key in this.cssVar) {
      if (Object.prototype.hasOwnProperty.call(this.cssVar, key)) {
        document.documentElement.style.setProperty(key, this.cssVar[key]);
      }
    }
  }

  /**
   * 默认的主题颜色
   */
  defaultCssVar() {
    const defaujltPrimaryColors = {
      LIGHT: this.mixLightColor,
      DARK: this.mixDarkColor,
    };

    if (this.isDark) {
      defaujltPrimaryColors.LIGHT = this.mixDarkColor;
      defaujltPrimaryColors.DARK = this.mixLightColor;
    }
    const cssVar: Record<string, any> = {
      [DEFAULT_PRIMARY_VAR]: this.color,
      [`${DEFAULT_PRIMARY_VAR}-dark-2`]: this.mix(this.color, defaujltPrimaryColors.DARK, 0.2),
    };
    for (let i = 1; i < 10; i += 1) {
      cssVar[`${DEFAULT_PRIMARY_VAR}-light-${i}`] = this.mix(
        this.color,
        defaujltPrimaryColors.LIGHT,
        i * 0.1,
      );
    }

    return cssVar;
  }

  /**
   * 混合颜色
   * @param color1
   * @param color2
   * @param weight
   */
  mix(color1: string, color2: string, weight: number) {
    weight = Math.max(Math.min(Number(weight), 1), 0);
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    const r = Math.round(r1 * (1 - weight) + r2 * weight);
    const g = Math.round(g1 * (1 - weight) + g2 * weight);
    const b = Math.round(b1 * (1 - weight) + b2 * weight);
    const _r = ('0' + (r || 0).toString(16)).slice(-2);
    const _g = ('0' + (g || 0).toString(16)).slice(-2);
    const _b = ('0' + (b || 0).toString(16)).slice(-2);
    return '#' + _r + _g + _b;
  }
}

export const globalTheme = new Theme();
