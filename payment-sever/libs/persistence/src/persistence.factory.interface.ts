export abstract class PersistenceFactory<T> {
  async create(_dbName: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
