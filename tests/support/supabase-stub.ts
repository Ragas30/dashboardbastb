import type { SupabaseClient } from '@supabase/supabase-js'

export type QueryOperation = { method: string; args: unknown[] }

export type QueryDescriptor = {
  table: string
  action: 'select' | 'insert' | 'update' | 'delete'
  single: 'single' | 'maybeSingle' | null
  payload?: unknown
  operations: QueryOperation[]
}

export type QueryResult = { data?: unknown; count?: number | null; error?: unknown }

export function createSupabaseStub(handler: (descriptor: QueryDescriptor) => QueryResult) {
  function createBuilder(table: string) {
    let action: QueryDescriptor['action'] = 'select'
    let single: QueryDescriptor['single'] = null
    let payload: unknown
    const operations: QueryOperation[] = []

    const builder = {
      select(...args: unknown[]) {
        operations.push({ method: 'select', args })
        return builder
      },
      eq(...args: unknown[]) {
        operations.push({ method: 'eq', args })
        return builder
      },
      gte(...args: unknown[]) {
        operations.push({ method: 'gte', args })
        return builder
      },
      lte(...args: unknown[]) {
        operations.push({ method: 'lte', args })
        return builder
      },
      ilike(...args: unknown[]) {
        operations.push({ method: 'ilike', args })
        return builder
      },
      or(...args: unknown[]) {
        operations.push({ method: 'or', args })
        return builder
      },
      order(...args: unknown[]) {
        operations.push({ method: 'order', args })
        return builder
      },
      limit(...args: unknown[]) {
        operations.push({ method: 'limit', args })
        return builder
      },
      range(...args: unknown[]) {
        operations.push({ method: 'range', args })
        return builder
      },
      insert(value: unknown) {
        action = 'insert'
        payload = value
        return builder
      },
      update(value: unknown) {
        action = 'update'
        payload = value
        return builder
      },
      delete(...args: unknown[]) {
        action = 'delete'
        operations.push({ method: 'delete', args })
        return builder
      },
      single() {
        single = 'single'
        return Promise.resolve(handler({ table, action, single, payload, operations }))
      },
      maybeSingle() {
        single = 'maybeSingle'
        return Promise.resolve(handler({ table, action, single, payload, operations }))
      },
      then<TResult1 = QueryResult, TResult2 = never>(
        onFulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
        onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
      ) {
        return Promise.resolve(handler({ table, action, single, payload, operations })).then(onFulfilled, onRejected)
      },
    }

    return builder
  }

  return { from: (table: string) => createBuilder(table) } as unknown as SupabaseClient
}

export function findOperation(descriptor: QueryDescriptor, method: string) {
  return descriptor.operations.find((operation) => operation.method === method)
}
