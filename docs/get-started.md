# Get Started

Albi最开始的时候，是基于以前使用的express的项目，虽然express更加成熟，现成的middleware也更加多，但是我还是选择慢慢迁移到koa上面，前段时间koa开始2.x版本，也就直接把albi的代码重新整理，将公共的模块提取，添加测试，接入*travis-ci*，慢慢完善基于koa 2.x的版本。

注：对于使用Babel支持async functions的方式，我并没有采用，对我而言，编译之后的代码我并不太难接受，而且promoise已经足够。

要使用Albi，首先要了解koa，koa的middleware概念也很简单，获取到HTTP请求，会顺序调用middleware，每个middleware决定是否继续把请求往后传递，最终处理函数生成响应数据，再从原路返回。想像一下，你去一家企业面试（下面每一个流程可以当成middleware）：

- *门卫*查了你的资料，给了你一个工牌，告诉你去人事部，并且面试完需要回来这个交还工牌。

- *人事部*看了你的资料，说要先盖个章，但是主管刚刚出去了，她打个电话问问先，你先等等（这就是异步）。过了一会，主管回来了，帮你盖单之后告诉你要去前台，让她带你去面试，并且面试完需要回来填一下表。

- *前台MM*带了你去面试，并且告诉你，如果你面试完了，你不用再过来找你，直接去人事部就可以了(return next();的形式)。

- *面试官*和你聊了30分钟，在你的简历上打了评价，告诉你面试完成了。此时你就按着原来的流程回到人事部，再到门卫，最面完成面试。


```
'use strict';
const Koa = require('koa');
const app = new Koa();
// step1->step2->step3->step4->step5->response
// first middleware
app.use((ctx, next) => {
	console.info('step1');
	return next().then(() => {
		console.info('step5');
	});
});
// second middleware
app.use((ctx, next) => {
	console.info('step2');
	return next().then(() => {
		console.info('step4');
	});
});
// set response data
app.use(ctx => {
	console.info('step3');
	ctx.body = 'OK';
});
app.listen(3000);
```

koa中的middleware的执行顺序可以简单的这样理解，app.use中函数的执行顺序按添加的顺序，如上面的代码就是step1->step2->step3，而then的回调则是相反，后面添加的先执行，所以顺序对应的是stpe4->step5。其实你可以很想像成为为一个我们平时的排队，app.use就是队伍多增加了一个人。当有请求来到的时候，排在第一位的人先获取到这个请求，这个人可以优先决定是不是需要做点什么处理，做完处理了，如果他想交给下一位，则调用next()。请示就到了下一个人处理，后续的逻辑同上。当最后的一个人处理完(也有可能是某一个人决定不再交给下一位，不调用next())，则请求往回传递，对应then的回调方法。


再来看下面的例子：

```
'use strict';
const Koa = require('koa');
const app = new Koa();
// first middleware
app.use((ctx, next) => {
	// 当url是/first时，直接设置返回的数据，不传递给下一个middleware
	if (ctx.url === '/first') {
		ctx.body = 'first';
	} else {
		// 没有.then表示当下一个处理完成返回给此middleware时，并不需要做任何的处理，直接再往上传递
		return next();
	}
});
// second middleware
app.use(ctx => {
	ctx.body = 'second';
});
app.listen(3000);
```

如果请求 http://localhost:3000/first，则第一个middleware会处理请求，且不会再往下面传递，请求的数据返回first。如果是其它的url请求，则会传递到第二个middleware。

上面两个例子的处理都是同步的代码，那么如果是异步的呢，又怎么处理呢？

```
'use strict';
const Koa = require('koa');
const app = new Koa();
// delay middleware
app.use((ctx, next) => {
	console.info(Date.now());
	const delay = new Promise((resovle, reject) => {
		setTimeout(resovle, 3000);
	});
	return delay.then(next);
});
// request will be dalay 3000ms
app.use(ctx => {
	console.info(Date.now());
	ctx.body = 'OK';
});
```


# Installation

```
$ git clone https://github.com/vicanso/albi.git
$ cd albi
$ npm install
$ node app
```

通过上面的方式，可以获取到最新的albi代码，如果是在生产环境使用，npm请指定*--production*，减少安装非development环境下的*node_modules*，启动时也指定*NODE_ENV=production*。如果正式使用albi，建议使用*Releases*中的版本，不要直接clone当前分支。

- - -


