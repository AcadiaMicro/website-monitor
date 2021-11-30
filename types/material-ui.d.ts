/* eslint-disable @typescript-eslint/no-unused-vars */
import * as createTheme from '@material-ui/core/styles/createTheme';
import * as createPalette from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createTheme' {
  export interface Theme {
    custom: {
      header: {
        height: number;
      };
      subHeader: {
        height: number;
      };
      footer: {
        heightXS: number;
        heightSM: number;
        heightLG: number;
      };
      layout: {
        maxWidth: number;
      };
    };
  }

  export interface ThemeOptions {
    custom: {
      header: {
        height: number;
      };
      subHeader: {
        height: number;
      };
      footer: {
        heightXS: number;
        heightSM: number;
        heightLG: number;
      };
      layout: {
        maxWidth: number;
      };
    };
  }
}

declare module '@material-ui/core/styles/createPalette' {
  export interface Palette {
    ampionColors: {
      [name: string]: string;
    };
  }

  export interface PaletteOptions {
    ampionColors: {
      [name: string]: string;
    };
  }
}
