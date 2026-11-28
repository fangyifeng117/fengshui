# bilingual-i18n

> 这是 2026-11-23 根据本仓库已经执行的约束整理的说明，不是技能原件。来源是父侧转述的既有技能规则，以及 `AGENTS.md`、`TEMPLE-STORE-SPEC.md` 里标为既有技能约束的部分。不要把它当成用户原话。整理这份说明不打开支付，也不开放索引。

## 路由

- 英文是默认语言，路径不带前缀。
- 中文使用 `/zh`。
- `next-intl` 的 `localePrefix` 为 `as-needed`，`localeDetection` 为 `false`，避免 `Accept-Language` 把英文地址改写成别的语言。
- 语言切换留在对应路由，不总是回到首页。`/en` 若出现，回到无前缀英文地址。

## 元数据

- 每组对应页面有自指 canonical。canonical 和页面里的 `hreflang` 主机是 `https://furuiqifu.com`。英文无前缀，中文 `/zh`。中间件不再按访问主机另发一套 alternate link。
- `hreflang` 同时给出 `en`、`zh` 和 `x-default`。`x-default` 指向英文页。
- 不编造不存在的语言地址。
- `html lang` 跟随当前语言。
- `hreflang` 不是开放收录的许可。页面保持 `noindex`，`robots.txt` 保持 `Disallow: /`。
- 本地化时不提交 sitemap，不启用分析，不发信。

## 文案

- 固定英文法律和免责原文原样保留。中文页在旁边附加译文，不替换、不削弱英文。
- 两套固定英文声明并存：商品页的长免责声明，以及“Sold as a cultural craft...”那一句。不能用一套替换另一套。
- 普通界面和 DEMO 商品名可以翻译。页头可见品牌是「东方福瑞」，两种语言都用这四个汉字，不另译成英文品牌。品牌口号「护佑一生」只出现在页头，不写进商品功效。文档标题、Open Graph 和 Twitter 使用「东方福瑞，护佑一生」和 “Dongfang Furui — Blessings for a Lifetime”，不要改回 Demo。
- 中英文 FAQ 的题意保持一致。
- 不因为语言切换而推断货币，也不编造价格。
