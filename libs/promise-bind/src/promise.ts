declare global {
	interface Promise<T> {
		chain<U>(f: (t: T) => U | PromiseLike<U>): Promise<U>;
		chainFirst<U>(f: (t: T) => U | PromiseLike<U>): Promise<T>;
		useContext<N extends string, U>(
			name: N, f: (t: T) => U | Promise<U>
		): Promise<{ readonly [K in keyof Record<string, unknown> | N]: U }>;
		bind<N extends string, T, U>(
			this: Promise<T>,
			name: Exclude<N, keyof T>, f: (t: T) => U | Promise<U>
		): Promise<{ readonly [K in keyof T | N]: K extends keyof T ? T[K] : U }>;

		bindAll<T, O>(
			this: Promise<T>,
			f: (t: T) => O | Promise<O>
		): Promise<
			{ readonly [K in keyof T]: T[K] } & { readonly [N in keyof O]: O[N] }
		>

		// bindAll<O extends Record<string, unknown>, N extends keyof O, T>(
		// 	this: Promise<T>,
		// 	f: (t: T) => O | PromiseLike<O>
		// ): Promise<{ readonly [K in keyof T | N]: K extends keyof T ? T[K] : O[N] }>;
		// bindAll<O extends Object, N extends keyof O, T>(
		// 	this: Promise<T>,
		// 	f: (t: T) => O | PromiseLike<O>
		// ): Promise<{ readonly [K in keyof T | N]: K extends keyof T ? T[K] : O[N] }>;
		// bindAll<O, N extends keyof O, T>(
		// 	this: Promise<T>,
		// 	f: (t: T) => O | PromiseLike<O>
		// ): Promise<{ readonly [K in keyof T | N]: K extends keyof T ? T[K] : O[N] }>;
	}

	interface PromiseConstructor {
		of<T>(t: T): Promise<T>;
		do<T = unknown>(): Promise<T>;
		reject<T = unknown>(reason?: unknown): Promise<T>;
		parallel<T extends readonly (() => unknown)[] | []>(
			values: T
		): Promise<{ -readonly [P in keyof T]: T[P] extends () => unknown ? Awaited<ReturnType<T[P]>> : never }>;
		sequential<T extends readonly (() => unknown)[] | []>(
			values: T
		): Promise<{ -readonly [P in keyof T]: T[P] extends () => unknown ? Awaited<ReturnType<T[P]>> : never }>;
	}
}

Promise.of = function <T>(t: T): Promise<T> {
	return new Promise((resolve, reject) => {
		resolve(t);
	});
};

Promise.do = function <T>(): Promise<T> {
	return Promise.resolve<T>(null);
};

Promise.reject = function <T = unknown>(t: T = null): Promise<T> {
	return new Promise((resolve, reject) => {
		reject(t);
	});
};

Promise.parallel = function <T extends readonly (() => unknown)[] | []>(
	values: T
): Promise<{ -readonly [P in keyof T]: T[P] extends () => unknown ? Awaited<ReturnType<T[P]>> : never }> {
	return Promise.all((values as (() => unknown)[]).map((getValue) => Promise.resolve(getValue()))) as Promise<{
		-readonly [P in keyof T];
	}>;
};

Promise.sequential = function <T extends readonly (() => unknown)[] | []>(
	values: T
): Promise<{ -readonly [P in keyof T]: T[P] extends () => unknown ? Awaited<ReturnType<T[P]>> : never }> {
	return (values as (() => unknown)[]).reduce(
		(acc, getValue) => acc.then((result) => Promise.resolve(getValue()).then(Array.prototype.concat.bind(result))),
		Promise.resolve([]) as Promise<{ -readonly [P in keyof T] }>
	);
};

Promise.prototype.chain = function <T, U>(this: Promise<T>, f: (t: T) => U | PromiseLike<U>): Promise<U> {
	return this.then((t) => f(t));
};

Promise.prototype.chainFirst = function <T, U>(this: Promise<T>, f: (t: T) => U | PromiseLike<U>): Promise<T> {
	return Promise.all([this, this.then((t) => f(t))]).then(([t, u]) => t);
};

Promise.prototype.useContext = function <N extends string, T, U>(
	this: Promise<T>,
	name: N,
	f: (t: T) => U | PromiseLike<U>
): Promise<{ readonly [K in keyof Record<string, unknown> | N]: U }> {
	return Promise.all([this, this.then((t) => f(t))]).then(
		([t, u]) => ({ [name]: u } as any)
	);
};

Promise.prototype.bind = function <N extends string, T, U>(
	this: Promise<T>,
	name: Exclude<N, keyof T>,
	f: (t: T) => U | PromiseLike<U>
): Promise<{ readonly [K in keyof T | N]: K extends keyof T ? T[K] : U }> {
	return Promise.all([this, this.then((t) => f(t))]).then(
		([t, u]) => ({ ...t, [name]: u }) as any
	);
};

Promise.prototype.bindAll = function <T, O>(
	this: Promise<T>,
	f: (t: T) => O | Promise<O>
): Promise<
	{ readonly [K in keyof T]: T[K] } & { readonly [N in keyof O]: O[N] }
> {
	return Promise.all([this, this.then((t) => f(t))]).then(
		([t, o]) => ({ ...t, ...o }) as any
	);
};

export default Promise;
