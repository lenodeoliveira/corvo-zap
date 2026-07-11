import { StubbedInstance as BaseStubbedInstance } from '@suites/types.doubles';
import { MockInstance } from 'vitest';

declare global {
  type MockedUnit<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => infer R 
      ? MockInstance<(...args: any[]) => R> & BaseStubbedInstance<T>[K]
      : BaseStubbedInstance<T>[K];
  } & BaseStubbedInstance<T>;
}