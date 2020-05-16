export default class RemoteResource<Data> {
  private state:
    | { type: 'pending' }
    | { type: 'done', data: Data }
    | { type: 'error', error: any };
  private inner: Promise<void>;

  constructor(fn: () => Promise<Data>) {
    this.inner = fn().then(
      data => {
        this.state = {
          type: 'done',
          data,
        };
      },
      error => {
        this.state = {
          type: 'error',
          error,
        };
      },
    );
    this.state = { type: 'pending' };
  }

  get(): Data {
    if (this.state.type === 'pending') {
      throw this.inner;
    }
    if (this.state.type === 'done') {
      return this.state.data;
    }
    if (this.state.type === 'error') {
      throw this.state.error;
    }
  }
}
