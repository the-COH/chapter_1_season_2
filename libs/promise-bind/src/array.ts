import './promise';

declare global {
	interface Array<T> {
		reduceSequential<U extends readonly unknown[] | []>(
			this: U
		): Promise<{ -readonly [P in keyof U]: U[P] extends () => unknown ? Awaited<ReturnType<U[P]>> : never }>;
		reduceParallel<U extends readonly unknown[] | []>(
			this: U
		): Promise<{ -readonly [P in keyof U]: U[P] extends () => unknown ? Awaited<ReturnType<U[P]>> : never }>;
	}
	// interface ArrayConstructor {}
}

Array.prototype.reduceSequential = function <U extends readonly unknown[] | []>(this: U) {
	return Promise.sequential(this as (() => unknown)[]) as unknown as Promise<{
		-readonly [P in keyof U]: U[P] extends () => unknown ? Awaited<ReturnType<U[P]>> : never;
	}>;
};

Array.prototype.reduceParallel = function <U extends readonly unknown[] | []>(this: U) {
	return Promise.parallel(this as (() => unknown)[]) as unknown as Promise<{
		-readonly [P in keyof U]: U[P] extends () => unknown ? Awaited<ReturnType<U[P]>> : never;
	}>;
};

export default Array;
