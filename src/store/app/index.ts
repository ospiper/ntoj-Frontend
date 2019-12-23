import { createModule } from 'vuex-class-component';

const VuexModule = createModule({
  namespaced: 'app',
  strict: false,
});

export class AppStore extends VuexModule {
  /**
   * Version number
   * Made up of a 32-bit unsigned number.
   * 25 - 32 bits: Main version
   * 17 - 24 bits: Sub version
   * 9 - 16 bits: Feature version
   * 1 - 8 bits: Patch version
   */
  private v: number = 0x00000001;

  get version(): string {
    return (this.v >> 24 & 0xFF) + '.' +
      (this.v >> 16 & 0xFF) + '.' +
      (this.v >> 8 & 0xFF) + '.' +
      (this.v & 0xFF);
  }

  get appName(): string {
    return process.env.VUE_APP_NAME;
  }
}