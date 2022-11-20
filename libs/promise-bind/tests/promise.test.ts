import { describe, expect, test } from '@jest/globals';
import '../src/promise';

describe('Promise', () => {
	test('of', () => {
		Promise.of(Promise.resolve('test')).then((v) => expect(v).toBe('test'));
	});

	test('useContext', () => {
		Promise.resolve(null)
			.useContext('one', () => 1)
			.chain(({ one }) => expect(one).toBe(1))
			.useContext('two', () => 2)
			.chain(({ one }: any) => expect(one).toBeUndefined());
	});

	test('bind', () => {
		Promise.do()
			.bind('v', () => 'test value')
			.chainFirst(({ v }) => expect(v).toBe('test value'));
	});

	test('bindAll', () => {
		Promise.do()
			.bindAll(() => ({
				one: 1,
				two: 2,
			}))
			.chainFirst(({ one, two }) => {
				expect(one).toBe(1);
				expect(two).toBe(2);
			});
	});

	test('bind reject', () => {
		Promise.do()
			.bind('v', () => 'test value')
			.chainFirst(({ v }) => expect(v).toBe('test value'))
			.bind('err', () => Promise.reject(new Error('test error')))
			.chain(() => fail(new Error('should not be run')))
			.catch((error: Error) => expect(error.message).toBe('test error'));
	});

	test('reject', () => {
		Promise.reject(new Error('test error'))
			.bind('test', () => 'test value')
			.chain(() => fail(new Error('should not be run')))
			.catch((error: Error) => expect(error.message).toBe('test error'));
	});
});
