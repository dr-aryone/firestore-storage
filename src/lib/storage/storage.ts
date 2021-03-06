import {interfaces} from 'inversify';

export interface IStorageDriver {

	findById(collection: string, id: string): Promise<any>;

	find<T>(collection: string, query: (qb: QueryBuilder<T>) => QueryBuilder<T>): Promise<any>;

	save(collection: string, data): Promise<any>;

	query<T>(collection: string, query: (qb: QueryBuilder<T>) => QueryBuilder<T>): Promise<any>;

	batchGet(collection: string, ids: string[]): Promise<any>;

	delete(collection: string, id: string): Promise<void>;

	clear(collection: string): Promise<any>;

	listen<T>(collection: string, cb: (qb: QueryBuilder<T>) => QueryBuilder<T>,
		   onNext: (snapshot: any) => void, onError?: (error: Error) => void): () => void;
}

export interface QueryBuilder<T> {

	where(field: string, operator: Operator, value: any): QueryBuilder<T>

	limit(limit: number): QueryBuilder<T>;

	offset(offset: number): QueryBuilder<T>;

	orderBy(property: string, direction?: OrderDirection): QueryBuilder<T>;

	get(): Promise<any>;

	onSnapshot(onNext: (snapshot: any) => void, onError?: (error: Error) => void) : () => void;

}

export type OrderDirection = 'desc' | 'asc';
export type Operator = '==' | '<' | '<=' | '>' | '>=';

export const Storage = Symbol('Storage');
export const FirestoreInstance = Symbol('FirestoreInstance');
export const ErrorFactory = Symbol('ErrorFactory');

export interface SaveOptions {
	avoidMerge?: boolean;
}

export type IErrorFactory = (message: string) => Error;



