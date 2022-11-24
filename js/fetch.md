---
outline: deep
---

# 细说 Fetch API

:::warning
当接收到一个代表错误的 HTTP 状态码时，从 `fetch()` 返回的 Promise **不会被标记为 reject，** 即使响应的 HTTP 状态码是 404 或 500。相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 `ok` 属性设置为 false ），仅当网络故障时或请求被阻止时，才会标记为 reject。
:::

## 了解 Fetch

### 基本用法

一个基本的 fetch 请求设置起来很简单。这是他的基本用法

```js
fetch(url)
  .then(...)
  .catch(...)
```

```javascript
fetch("https://api.github.com/users/wibus-wee")
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((err) => console.log("Request Failed", err));
```

这里我们获取了 GitHub API 的数据（好吧其实这样子获取不到），之后将 json 打印至 console，如果出现问题依然是打印到 console

最简单的话就是直接给一个 URL 给`fetch()`，如果只有这样子的话，我们无法真实获得 JSON 内容，因为这样子只是一个 HTTP 响应，因为我们还要用`json()`来真正获取到这个数据；根据阮一峰的说法，`fetch()`接收到的`response`是一个 [Stream 对象](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)，`response.json()`是一个异步操作，取出所有内容，并将其转为 JSON 对象。

> 根据 MDN 的说法，`json()`方法在 [`Body`](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/API/Body) mixin 中定义，被 [`Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 和 [`Response`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 对象实现

#### Promise -> await 改进

当然，上面的例子`promise`可以使用`await`进行改写，啊对还要`async`

```js
async function fetchGetJson(url) {
  try {
    let response = await fetch(url); //得到Stream对象
    return await response.json(); //转化为json对象
  } catch (err) {
    console.log("Request Failed: " + err); //输出错误
  }
}
```

上面示例中，`await`语句必须放在`try...catch`里面，这样才能捕捉异步操作中可能发生的错误。

### Response 对象

上面有讲过，Response 是一个 Stream 对象，

### Response 对象的同步属性

- **Response.ok** 可以返回 true/false，表示请求是否成功，`true`对应 HTTP 请求的状态码 200 到 299，`false`对应其他的状态码。
- **Response.status** 属性返回一个数字，表示 HTTP 回应的状态码（例如 200，表示成功请求）可以对应与`.ok`使用
- **Response.statusText** 属性返回一个字符串，表示 HTTP 回应的状态信息（例如请求成功以后，服务器返回"OK"）。
- **Response.url** 属性返回请求的 URL。如果 URL 存在跳转，该属性返回的是最终 URL。
- **Response.type** 属性返回请求的类型。可能的值如下：
  - `basic`：普通请求，即同源请求。
  - `cors`：跨域请求。
  - `error`：网络错误，主要用于 Service Worker。
  - `opaque`：如果`fetch()`请求的`type`属性设为`no-cors`，就会返回这个值，详见请求部分。表示发出的是简单的跨域请求，类似`<form>`表单的那种跨域请求。
  - `opaqueredirect`：如果`fetch()`请求的`redirect`属性设为`manual`，就会返回这个值，详见请求部分。
- **Response.redirected** 属性返回一个布尔值，表示请求是否发生过跳转。

### Fetch 判断请求是否成功

通过上面的同步属性我们了解到两个东西：`.ok`, `.status`，fetch 会出现 error 是在出现无法连接的时候，因此如果需要判断是否真的请求成功了，我们还需要做一个 if 判断

```js
async function getJSON(url) {
  let response = await fetch(url);
  if (response.status >= 200 && response.status < 300) {
    return await response.json();
  } else {
    console.error(response.statusText);
  }
}
```

`response.status`属性只有等于 2xx （200~299），才能认定请求成功。这里不用考虑网址跳转（状态码为 3xx），因为`fetch()`会将跳转的状态码自动转为 200。

另一种方法是判断`response.ok`是否为`true`。

```js
async function getJSON(url) {
  let response = await fetch(url);
  if (response.ok) {
    return await response.json();
  } else {
    console.error(response.statusText);
  }
}
```

### Fetch Headers

Response 还具有一个属性：`.headers`，这将可以对应 HTTP 回应的所有标头（通过指向一个`Headers`对象）就像这样：

```js
const response = await fetch(url); //得到Streams对象
for (let [name, value] of response.headers) {
  console.log(`${name}:${value}`);
}
```

对于 Headers 对象，它具有以下的方法：

- `Headers.get()`：根据指定的键名，返回键值。
- `Headers.has()`： 返回一个布尔值，表示是否包含某个标头。
- `Headers.set()`：将指定的键名设置为新的键值，如果该键名不存在则会添加。
- `Headers.append()`：添加标头。
- `Headers.delete()`：删除标头。
- `Headers.keys()`：返回一个遍历器，可以依次遍历所有键名。
- `Headers.values()`：返回一个遍历器，可以依次遍历所有键值。
- `Headers.entries()`：返回一个遍历器，可以依次遍历所有键值对（`[key, value]`）。
- `Headers.forEach()`：依次遍历标头，每个标头都会执行一次参数函数。

可以看到有一些方法比如说：`.append()`可以用来添加标头，他们可以修改标头（因为从 Headers 接口继承而来的哈哈哈）

> 不过对于 HTTP 请求来说，没意思，毕竟浏览器不允许修改大部分返回的标头

这些方法中，最常用的是`response.headers.get()`，用于读取某个标头的值。

```javascript
let response = await fetch(url);
response.headers.get("Content-Type");
// return application/json; charset=utf-8
```

### Fetch 读取数据

`Response`提供了对应不同内容的读取方法

- `response.text()`：得到文本字符串。
- `response.json()`：得到 JSON 对象。
- `response.blob()`：得到二进制 Blob 对象。
- `response.formData()`：得到 FormData 表单对象。
- `response.arrayBuffer()`：得到二进制 ArrayBuffer 对象。

上面 5 个读取方法都是异步的，返回的都是 Promise 对象。必须等到异步操作结束，才能得到服务器返回的完整数据。

#### .text()

它可以读取返回的文本数据，譬如 HTML

```js
async function fetchGETText(url) {
  try {
    let response = await fetch(url);
    let text = await response.text();
    return text;
  } catch (e) {
    console.log("Request Failed: " + e);
  }
}
```

这样，就封了一个 function 来用，我们就可以这样子调用

```js
// 譬如说
let HTML = fetchGETText("/comment.html");
document.body.innerHTML = HTML;
```

是不是很拽，是不是很搞笑的写法（直接点不就好了。。）对自己无语了

#### .json()

其实前面已经说过了，不多说了

```js
async function fetchGetJson(url) {
  try {
    let response = await fetch(url); //得到Stream对象
    return await response.json(); //转化为json对象
  } catch (err) {
    console.log("Request Failed: " + err); //输出错误
  }
}
```

#### .formData()

它主要与 service workers 有关。如果用户提交表单并且 service workers 拦截请求，您可以调用 formData() 方法来获取键值映射，修改某些字段，然后将表单发送到服务器（或在本地使用）

它并没有参数，是这样子写的（示范）：

```js
const response = await fetch(url);
form_Data = await response.formData();
function formData(form_Data) {
  //做一些事情
}
```

Body mixin 的 formData() 方法采取 Response 流并读取完成。它返回一个以 FormData 对象解决的 promise。

#### .blob()

这个方法可以用来获取二进制文件，比如说：读取图片文件

```javascript
const response = await fetch("flower.jpg");
const myBlob = await response.blob();
const objectURL = URL.createObjectURL(myBlob);

const myImage = document.querySelector("img");
myImage.src = objectURL;
```

其实，这个例子，懂得都懂（又可以手撸 lazyload（？别埋坑吧）

#### arrayBuffer()

对于这个方法，其实我也不是很明白，这里引用一下大佬的

```js
const audioCtx = new window.AudioContext();
const source = audioCtx.createBufferSource();

const response = await fetch("song.ogg");
const buffer = await response.arrayBuffer();

const decodeData = await audioCtx.decodeAudioData(buffer);
source.buffer = buffer;
source.connect(audioCtx.destination);
source.loop = true;
```

上面示例是`response.arrayBuffer()`获取音频文件`song.ogg`，然后在线播放的例子。

### Fetch 读取后无法继续读取

没错，就是无法读取，你要不信你去试下

Stream 对象只能读一次，也就是说，读一次，他就没了；也就是说，前面的什么`.blob()`, `json()`，只能在一个对象里面用一次，没事，response 具有一个方法用来克隆对象：`response.clone()`

#### response.clone()

```js
let response1 = await fetch("1.jpg");
let response2 = response1.clone();

const Blob1 = await response1.blob();
const Blob2 = await response2.blob();

image1.src = URL.createObjectURL(Blob1);
image2.src = URL.createObjectURL(Blob2);
```

`response1.clone()`复制了一份 Response 对象，然后将同一张图片读取了两次

#### response.redirect()

好吧，也是一个和`Service Worker`有关的方法，它可以返回一个可以重定向到指定 URL 的`Response`，这里就简单讲讲吧，毕竟我不是很常用

```js
// 语法
let response = Response.redirect(url, status);
// 示例
responseObj.redirect("https://www.example.com", 302);
```

### Response.body

`Response.body`属性是 Response 对象暴露出的底层接口，返回一个 ReadableStream 对象，供用户操作。

它可以用来分块读取内容，应用之一就是显示下载的进度。

```javascript
const response = await fetch("flower.jpg");
const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`);
}
```

上面示例中，`response.body.getReader()`方法返回一个遍历器。这个遍历器的`read()`方法每次返回一个对象，表示本次读取的内容块。

这个对象的`done`属性是一个布尔值，用来判断有没有读完；`value`属性是一个 arrayBuffer 数组，表示内容块的内容，而`value.length`属性是当前块的大小。

![截屏2021-07-18 下午11.28.47](https://gitee.com/wibus/blog-assets-goo/raw/master/asset-pic/20210718232928.png)

## optionObj — 第二参数

我们第一节知道了 fetch()的第一个参数：`url`，这是用来设置他的请求地址的，那么 fetch 还能够接受第二个参数，就是我们熟知的自定义 HTTP 请求（POST/GET 这些的）![4197916C192CA0A331A534C739817C07](https://gitee.com/wibus/blog-assets-goo/raw/master/asset-pic/20210718235412.jpg)

HTTP 请求的方法、标头、数据体都在这个对象里面设置，比如说

#### POST 请求

```js
let response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-type": "application/json;charset=utf-8",
  },
  body: "foo=bar&lorem=ipsum",
});
let json = await response.json();
```

以上使用了三个属性：

- `method`：HTTP 请求的方法，`POST`、`DELETE`、`PUT`都在这个属性设置。
- `headers`：一个对象，用来定制 HTTP 请求的标头。
- `body`：POST 请求的数据体

> 有些标头不能通过`headers`属性设置，比如`Content-Length`、`Cookie`、`Host`等等。它们是由浏览器自动生成，无法修改。

#### POST 提交 JSON

```javascript
const user = { name: "John", surname: "Smith" };
const response = await fetch("/article/fetch/post/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  body: JSON.stringify(user),
});
```

#### POST 提交 form

```javascript
const form = document.querySelector("form");

const response = await fetch("/users", {
  method: "POST",
  body: new FormData(form),
});
```

#### POST 上传文件

如果表单里面有文件选择器，可以用前一个例子的写法，上传的文件包含在整个表单里面，一起提交。

另一种方法是用脚本添加文件，构造出一个表单，进行上传，请看下面的例子。

```js
const input = document.querySelector('input[type="file"]');

const data = new FormData();
data.append("file", input.files[0]);
data.append("user", "foo");

fetch("/avatars", {
  method: "POST",
  body: data,
});
```

上传二进制文件时，不用修改标头的`Content-Type`，浏览器会自动设置。

### optionObj 完整 API

```js
const response = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8",
  },
  body: undefined,
  referrer: "about:client",
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "cors",
  credentials: "same-origin",
  cache: "default",
  redirect: "follow",
  integrity: "",
  keepalive: false,
  signal: undefined,
});
```

`fetch()`请求的底层用的是 [Request() 对象](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)的接口，参数完全一样，因此上面的 API 也是`Request()`的 API。

> 至于每个属性的解释我就不多讲了，因为我怕错误地引导大家导致大家也错了

## 取消 Fetch 请求

Fetch 请求了，他也有一个对应的取消方式，那就是`AbortController`对象

```js
let controller = new AbortController()
let signal = controller.signal; //AbortController接受发送的信号
fetch(url{
      signal: controller.signal
})
signal.addEventListener('abort',
	() => console.log("Fetch Abort")
)
controller.abort();
```

我们要取消请求要做的几件事情：

- 新建一个 AbortController 实例
- 发送 fetch 请求
- 配置`signal`属性为实例发送的信号（`.signal`)
- `.abort()`发出取消信号，可以使用监听来检测是否取消了请求、

我们可以这样子来实现一个 1s 后就取消请求

```javascript
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch("/long-operation", {
    signal: controller.signal,
  });
} catch (err) {
  if (err.name == "AbortError") {
    console.log("Aborted!");
  } else {
    throw err;
  }
}
```

## 参考资料

- [Network requests: Fetch](https://javascript.info/fetch)
- [node-fetch](https://github.com/node-fetch/node-fetch)
- [Introduction to fetch()](https://developers.google.com/web/updates/2015/03/introduction-to-fetch)
- [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Javascript Fetch API: The XMLHttpRequest evolution](https://developerhowto.com/2019/09/14/javascript-fetch-api/)
- [阮一峰的博客](https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)
