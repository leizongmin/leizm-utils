import utils = require(".");

utils.md5("hello, world");
utils.md5(Buffer.from("ok"));

function test() {
  return utils.argumentsToArray(arguments);
}

const MyError = utils.customError("MyError");
new MyError().stack;

const MyError2 = utils.customError("MyError", { code: "TEST" });
const err = new MyError2("hello", { ok: false });

utils.createPromiseCallback<string>().promise.then((ret) => ret.slice());

utils.bugfree();
