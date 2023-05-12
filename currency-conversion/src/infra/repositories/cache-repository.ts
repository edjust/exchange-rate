export abstract class CacheRepository {
  abstract save(key: string, value: any): Promise<void>;
  abstract recover<T>(key: string): Promise<T | null>;
  abstract invalidate(key: string): Promise<void>;
  abstract invalidatePrefix(prefix: string): Promise<void>;
}
