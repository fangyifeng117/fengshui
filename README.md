# 文化饰品示范店

英文为主、中文为 `/zh` 的 Next.js 示范店。页头名称是 **神秘东方**。文档标题是「福瑞祈福，纳福一方」和 “Furui Qifu — Blessings for Your Place”。这不是商标注册结论。千愿 / QIANYUAN 没有写成当前品牌。本轮只加了双语骨架、五处名山的文化分类草稿，以及首页三张已许可的参考图。没有接入支付、数据库或追踪。商品页仍不展示样品图和价格。

这不是一家正在营业的商店。商品名称、材质、价格和图片都标明为 sample。结账不会真正收款。

## 仓库是怎么接上的

开始写代码时，GitHub 上的仓库体积显示为 0，但 `main` 已经有一次初始化提交 `8366da6`，文件只有一行 `# fengshui`。因为默认分支存在，这次改动放在工作分支里，用 Pull Request 提交。没有合并，也没有部署到线上。

## 本地运行

需要 Node.js 22。

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` 里的值保持空白即可。浏览器打开 `http://localhost:3000`。

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## 环境变量

`.env.example` 只有空占位，不要把真实密钥写进这个公开仓库。

| 变量 | 空白时的行为 |
| --- | --- |
| `NEXT_PUBLIC_BRAND_NAME` | 空白时页头显示「神秘东方」。文档标题不使用 Demo |
| `NEXT_PUBLIC_BASE_URL` | 空白时 canonical 使用 `https://furuiqifu.com` |
| `NEXT_PUBLIC_ANNOUNCEMENT` | 显示默认的示范公告 |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | 空白时使用已批准的临时公开客服邮箱 `fangyifeng117@gmail.com`。只用于店铺问题，不是隐私或 DPO 联系人 |
| `SITE_INDEXING_APPROVED` | 只有精确写成 `true` 才允许索引。默认 `noindex`，`robots.txt` 禁止抓取 |
| `PAYPAL_MODE` | `sandbox`。写成 `live` 时，只要 `NODE_ENV` 不是 `production` 就拒绝，不会向正式环境发请求 |
| `PAYPAL_CLIENT_ID` | 空白表示沙箱未连接 |
| `PAYPAL_CLIENT_SECRET` | 只留在服务器。空白时不会发起 OAuth |
| `PAYPAL_WEBHOOK_ID` | 空白时每条 webhook 都视为未核验，不会把订单标成已支付，也不会减库存 |
| `DATABASE_PATH` | `data/store.sqlite`。写成 `:memory:` 会被忽略，仍然使用文件 |

## 已实现

- 固定路由仍可用：`/`、`/products`、`/products/[slug]`、`/collections/[slug]`、`/cart`、`/checkout`、`/order/success`、`/order/cancel`、`/content/[slug]`、`/legal/disclaimer`、`/legal/privacy`、`/legal/terms`、`/api/webhooks/paypal`。英文不带前缀。中文是 `/zh` 下的同一路径
- M1 草稿页：`/temples`、`/temples/[slug]`、`/blessing`、`/blessing/[slug]`、`/videos`、`/stories`、`/account`、`/about`、`/faq`、`/shipping`，以及对应的 `/zh` 路径。五处名山只是文化分类，雪窦山地域标成待核实。相关样品写 inspired-by，不是真实来源。祈福供灯在 `/blessing/offering-lamps` 展示四档拟定价格（一天灯 USD 29、七天灯 USD 49、四十九天灯 USD 99、常年灯 USD 199），不是在售。顾客在天下第一财神庙和灵隐寺中选择一处。拍摄许可未核实，预约和支付未开放，没有收集表单。八宝琉璃手串在 `/products/babao-liuli-bracelet` 展示照片、USD 188 和库存 10，支付仍关闭。其余祈福草稿仍是 Coming soon，其余样品仍不展示图和价格
- 首页顺序：主视觉、精选样品、问题预告
- 商品页顺序：面包屑、图库、标题与价格及加入购物车 / View demo checkout、合规说明、信任备注、规格、日常使用与摆放、免责声明原文、问答、相关样品。桌面把图库和购买信息排在同一屏，模块顺序没有改
- 价格和库存以服务器上的商品目录为准。浏览器里自带的单价会被忽略
- 订单、捕获、webhook 事件写在 SQLite 文件里，不是进程内存
- PayPal Orders API v2 的创建和捕获都在服务器上，并用内部订单号加购物车版本组成 `PayPal-Request-Id`，同一版本的重试沿用同一个请求号
- `client_secret` 只出现在服务器代码路径里
- 这一轮预览里，`/api/checkout` 的 create、capture、mock 和 `/api/webhooks/paypal` 在进 PayPal 之前直接返回 `payments_closed`，`paid` 为 false。即使环境里误填了凭据，这些入口也不会向 PayPal 发请求，也不会把订单标成已支付
- 结账页写明 **Test preview. Payment is off.** 禁用按钮是 **Payment is off**。没有 MOCK 成功按钮
- 目录里的样品 `sample: true` 且 `captureAllowed: false`。订单库函数仍留在 `lib/commerce`，单元测试仍覆盖那些函数，但本轮不验收、不接入任何支付
- webhook 在有凭据和 webhook id 时，每次都请求 PayPal 的 `verify-webhook-signature`，并带上服务器保存的 webhook id。核验不是 `SUCCESS` 的事件不会履约
- 处理 `CHECKOUT.ORDER.APPROVED`、`PAYMENT.CAPTURE.COMPLETED`、`DENIED`、`PENDING`、`REFUNDED`
- 同一事件只处理一次。已支付标记和库存扣减放在同一个立即事务里，重复事件或并发投递只扣一次库存
- 金额、币种或 `custom_id` 对不上服务器订单时不履约
- 返回 URL 上的 `paid`、`status` 等参数不能当作付款证明
- `PENDING`、取消和 MOCK 都不会显示为已支付
- 不提供卡号表单，不自动退款，不打款，不发邮件
- sitemap、robots、canonical、hreflang、Open Graph。未批准收录时 robots 是 `Disallow: /`，页面是 noindex。结构化数据没有评分和评论
- 没有接入 Stripe、Prisma、PostgreSQL、对象存储、邮件、分析或订阅。支付入口继续关闭
- 法律页写有经营者、注册地址和隐私邮箱。电话仍不公布。支付仍然关闭
- 临时公开客服邮箱集中在 `publicConfig.supportEmail`，页脚、首页问题、指南、问答和条款里用 `mailto:` 链接。隐私页写明该地址尚未被指定为隐私联系人或 DPO

## 未验证

PayPal 账户已经开立，但 client id、secret、webhook id 和要使用的模式都还没有确认配置。因此：

- 没有对 PayPal sandbox 或 live 做过真实的 OAuth、下单、买家批准、capture 或 webhook 签名往返
- 单元测试里的 PayPal 响应是本地替身，用来检查我们自己的记账规则
- 不能把这些测试说成“PayPal 已经接通”或“已经成功收款”
- 这个分支没有部署，也没有使用线上域名或真实支付

## 数据库和部署假设

默认数据库是工作目录下的 `data/store.sqlite`，使用 WAL，并用 `BEGIN IMMEDIATE` 把“标记已支付”和“扣库存”放在同一个事务里。事件 id 和 capture id 有唯一约束。

购物车行存在浏览器的 httpOnly cookie `cjd_lines` 里，服务器仍用目录价格计算合计。这样在只读的 serverless 文件系统上，加购不会因为创建 `data/` 失败而把页面打成 500。订单库仍是 SQLite。默认路径 `data/store.sqlite` 写不了时，才改用临时目录里的 `fengshui-store.sqlite`。临时文件不跨实例共享，所以未付款订单不能当成持久记录。支付入口仍然关闭。

应用拒绝把数据库开成 `:memory:`。不要把 SQLite 文件提交进仓库。

生产环境如果要把 `PAYPAL_MODE` 设为 `live`，必须同时是 `NODE_ENV=production`，并单独确认商户、webhook 和金额。本仓库的默认值不会进入 live。

## 上线前还缺什么

这些都还没有，所以不能当作正式商店打开：

- 品牌名和主体信息未确认
- 没有真实 SKU
- 没有成本
- 标价只是演示用的整数美分，不是售价
- 库存数字只为了演示扣减，不是仓库库存
- 没有获得使用权的商品照片，页面上是原创 SVG，并标明 sample
- 八宝琉璃手串的配送草稿是杭州发出、全球包邮追踪；收件人承担关税。其他样品不发货
- 客服与隐私使用公开邮箱。法律主体和注册地址在法律页。电话仍未公布
- 隐私联系人和数据保护负责人尚未指定
- 商品照片和视频尚未替换；本仓库没有导入历史素材
- 广告未投放，也没有做广告测试或花费
- 内容发布授权还没有下来，这个仓库不会替你发帖
- 商户身份尚未核验
- PayPal API 凭据和 webhook 未配置
- 搜索引擎索引未批准，默认 noindex

## 测试覆盖

`npm test` 覆盖：服务器权威总价、样品 SKU 拒绝真实 capture、无效签名不履约、重复事件只扣一次库存、并发投递同一事件只扣一次、金额不符、pending 和取消不是已支付、live 模式在非 production 被拒绝、创建和捕获重试沿用同一个 `PayPal-Request-Id`、MOCK 不能被标成已支付、webhook 请求带上服务器的 webhook id。

## 免责声明

商品页、内容页和法律页使用下面这一段原文：

Disclaimer: Products and content on this site are offered for decorative, cultural, and entertainment purposes only. They are not medical, financial, legal, or professional advice, and they do not guarantee any specific outcome, result, or change in fortune, health, relationships, or wealth. Individual experiences vary. By purchasing or using these products, you acknowledge that you are solely responsible for how you interpret and use them. If you have medical, financial, or legal concerns, consult a licensed professional.

页脚短句：For decorative & cultural use only — no results guaranteed. Full disclaimer.
