import { browser } from 'webextension-polyfill-ts';

interface ConfigItems {
  customPorts: number[];
  debugMode: boolean;
}

class Config {
  private readonly defaults: Partial<ConfigItems> = {
    customPorts: [],
    debugMode: false,
  };

  public async get<T extends keyof ConfigItems>(key: T): Promise<ConfigItems[T]> {
    const data = await browser.storage.local.get(key);
    return data[key] || this.defaults[key];
  }

  public set<T extends keyof ConfigItems>(key: T, value: ConfigItems[T]): Promise<void> {
    return browser.storage.local.set({ [key]: value });
  }
}

export const config = new Config();
