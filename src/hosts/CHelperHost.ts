import { Host } from './Host';

export class CHelperHost implements Host {
  public send(data: string): Promise<void> {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:4243/', true);

      xhr.timeout = 500;

      xhr.onload = () => resolve();
      xhr.ontimeout = () => resolve();
      xhr.onabort = () => resolve();
      xhr.onerror = () => resolve();

      try {
        xhr.send('json\n' + data);
        xhr.send();
      } catch (err) {
        //
      }
    });
  }
}
