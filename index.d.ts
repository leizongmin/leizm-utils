/**
 * lei-utils
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

/**
 * 普通回调函数
 */
export interface Callback<T> {
  (err: Error | null, ret?: T): void;
}

/**
 * 带 Promise 的回调函数
 */
export interface PromiseCallback<T> {
  (err: Error | null, ret?: T): void;
  promise: Promise<T>;
}

/**
 * Key-Value 键值对对象
 */
export interface KVObject {
  [key: string]: any;
}

/**
 * 返回“佛祖保佑，永无Bug” ASCII 图案
 */
export function bugfree(doNotOutput: true): string;
/**
 * 打印“佛祖保佑，永无Bug” ASCII 图案
 */
export function bugfree(doNotOutput: false): void;
/**
 * 打印“佛祖保佑，永无Bug” ASCII 图案
 */
export function bugfree(): void;

/**
 * 格式化字符串
 */
export function format(format: any, ...param: any[]): string;

/**
 * 32 位 MD5 值
 */
export function sha1(buf: string | Buffer): string;

/**
 * 32 位 MD5 值
 */
export function md5(buf: string | Buffer): string;

/**
 * 取文件内容的 SHA1
 */
export function fileSha1(filename: string, callback: Callback<string>): void;

/**
 * 取文件内容的 MD5
 */
export function fileMd5(filename: string, callback: Callback<string>): void;

/**
 * 取哈希值
 * @param method 方法，如 md5, sha1, sha256
 * @param text 数据
 */
export function hash(method: string, text: string | Buffer): string;

/**
 * 加密密码
 */
export function encryptPassword(password: string): string;

/**
 * 验证密码
 */
export function validatePassword(password: string, encrypted: string): boolean;

/**
 * 加密信息
 */
export function encryptData(data: any, secret: string): string;

/**
 * 解密信息
 */
export function decryptData(str: string, secret: string): string;

/**
 * 产生随机字符串
 */
export function randomString(size?: number, chars?: string): string;

/**
 * 产生随机数字字符串
 */
export function randomNumber(size?: number): string;

/**
 * 产生随机字母字符串
 */
export function randomLetter(size?: number): string;

/**
 * 格式化日期时间
 */
export function date(format: string, timestamp: string | number | Date): string;

/**
 * 空白回调函数
 */
export function noop(err?: Error | null | undefined): void;

/**
 * 判断是否为字符串
 */
export function isString(str: any): boolean;

/**
 * 判断是否为整数
 */
export function isInteger(str: any): boolean;

/**
 * 判断是否为数字
 */
export function isNumber(str: any): boolean;

/**
 * 复制对象
 */
export function cloneObject(obj: any): any;

/**
 * 合并对象
 */
export function merge(...list: any[]): KVObject;

/**
 * 返回安全的JSON字符串
 */
export function jsonStringify(data: any, space: string | number): string;

/**
 * 将arguments对象转换成数组
 */
export function argumentsToArray(args: IArguments): any[];

/**
 * 取数组的最后一个元素
 */
export function getArrayLastItem(arr: any[]): any;

/**
 * 异步函数节流
 */
export function throttleAsync(fn: Function, maxCount: number): Function;

/**
 * 继承EventEmitter
 */
export function inheritsEventEmitter(fn: FunctionConstructor): FunctionConstructor;

/**
 * 继承
 */
export function inherits(fn: FunctionConstructor, superConstructor: FunctionConstructor): FunctionConstructor;

/**
 * 扩展utils
 */
export function extend(obj: KVObject): KVObject;

export const array: {
  /**
   * 取数组最后一个元素
   */
  last(arr: any[]): any;

  /**
   * 取数组第一个元素
   */
  head(arr: any[]): any;

  /**
   * 取数组除第一个之外的元素
   */
  rest(arr: any[]): any[];

  /**
   * 复制一个数组
   */
  copy(arr: any[]): any[];

  /**
   * 组合一组数组
   */
  concat(...arr: any[][]): any[];
};

/**
 * 生成自定义Error类型
 */
export function customError(name: string, info?: KVObject): ErrorConstructor;

/**
 * 判断是否为Promise对象
 */
export function isPromise(p: any): boolean;

export const promise: {
  /**
   * 调用异步函数（传参时不包含末尾的callback），返回一个Promise对象
   */
  call<T>(fn: Function): Promise<T>;

  /**
   * 等待所有Promise执行完毕
   */
  all<T>(args: PromiseLike<T>[]): Promise<T[]>;
}

/**
 * 将IP地址转换为long值
 */
export function ipToInt(ip: string): number;

/**
 * 将字符串转换为 Buffer
 */
export function toBuffer(data: string | Buffer): Buffer;

/**
 * 使用指定方法加密数据
 */
export function encrypt(algorithm: string, key: string | Buffer, data: Buffer): Buffer;

/**
 * 使用指定方法加密数据流
 */
export function encryptStream(algorithm: string, key: string | Buffer, inStream: NodeJS.ReadableStream): NodeJS.ReadableStream;

/**
 * 使用指定方法解密数据
 */
export function decrypt(algorithm: string, key: string | Buffer, data: Buffer): Buffer;

/**
 * 使用指定方法解密数据流
 */
export function decryptStream(algorithm: string, key: string | Buffer, inStream: NodeJS.ReadableStream): NodeJS.ReadableStream;

/**
 * 创建 hash 的转换流
 */
export function hashTransform(method: string, callback: Callback<Buffer>): NodeJS.ReadWriteStream;

/**
 * 创建一个带 promise 的回调函数
 */
export function createPromiseCallback<T>(): PromiseCallback<T>;
