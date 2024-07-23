import { Font } from 'p5';

export enum SketchFont {
  /* ROBOTO */
  ROBOTO_THIN = '/fonts/Roboto/Roboto-Thin.ttf',
  ROBOTO_THIN_ITALIC = '/fonts/Roboto/Roboto-ThinItalic.ttf',
  ROBOTO_LIGHT = '/fonts/Roboto/Roboto-Light.ttf',
  ROBOTO_LIGHT_ITALIC = '/fonts/Roboto/Roboto-LightItalic.ttf',
  ROBOTO_REGULAR = '/fonts/Roboto/Roboto-Regular.ttf',
  ROBOTO_REGULAR_ITALIC = '/fonts/Roboto/Roboto-Italic.ttf',
  ROBOTO_MEDIUM = '/fonts/Roboto/Roboto-Medium.ttf',
  ROBOTO_MEDIUM_ITALIC = '/fonts/Roboto/Roboto-MediumItalic.ttf',
  ROBOTO_BOLD = '/fonts/Roboto/Roboto-Bold.ttf',
  ROBOTO_BOLD_ITALIC = '/fonts/Roboto/Roboto-BoldItalic.ttf',
  ROBOTO_BLACK = '/fonts/Roboto/Roboto-Black.ttf',
  ROBOTO_BLACK_ITALIC = '/fonts/Roboto/Roboto-BlackItalic.ttf',

  /* ROBOTO MONO */
  ROBOTO_MONO_THIN = '/fonts/Roboto_Mono/RobotoMono-Thin.ttf',
  ROBOTO_MONO_THIN_ITALIC = '/fonts/Roboto_Mono/RobotoMono-ThinItalic.ttf',
  ROBOTO_MONO_LIGHT = '/fonts/Roboto_Mono/RobotoMono-Light.ttf',
  ROBOTO_MONO_LIGHT_ITALIC = '/fonts/Roboto_Mono/RobotoMono-LightItalic.ttf',
  ROBOTO_MONO_REGULAR = '/fonts/Roboto_Mono/RobotoMono-Regular.ttf',
  ROBOTO_MONO_REGULAR_ITALIC = '/fonts/Roboto_Mono/RobotoMono-Italic.ttf',
  ROBOTO_MONO_MEDIUM = '/fonts/Roboto_Mono/RobotoMono-Medium.ttf',
  ROBOTO_MONO_MEDIUM_ITALIC = '/fonts/Roboto_Mono/RobotoMono-MediumItalic.ttf',
  ROBOTO_MONO_BOLD = '/fonts/Roboto_Mono/RobotoMono-Bold.ttf',
  ROBOTO_MONO_BOLD_ITALIC = '/fonts/Roboto_Mono/RobotoMono-BoldItalic.ttf',
  ROBOTO_MONO_BLACK = '/fonts/Roboto_Mono/RobotoMono-Black.ttf',
  ROBOTO_MONO_BLACK_ITALIC = '/fonts/Roboto_Mono/RobotoMono-BlackItalic.ttf',
}

export class FontLoader {
  private loadedFonts = new Map<SketchFont, Font | null>();

  constructor(fonts: SketchFont[]) {
    fonts.forEach((font) => this.loadedFonts.set(font, null));
  }

  public loadFonts(loadFunc: (font: SketchFont) => Font): void {
    this.loadedFonts.forEach((_, font) => {
      const loaded = loadFunc(font);
      this.loadedFonts.set(font, loaded);
    });
  }

  public get(font: SketchFont): Font {
    const loaded = this.loadedFonts.get(font);
    if (loaded === undefined) {
      throw new Error(`Unable to use font "${font}" because it was not added as a sketch font.`);
    }
    if (loaded === null) {
      throw new Error(`Unable to use font "${font}" because it was not loaded yet.`);
    }
    return loaded;
  }
}
