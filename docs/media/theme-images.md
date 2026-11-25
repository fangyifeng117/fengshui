# 首页三张主题图

2026-11-23 放入。三张都是 Wikimedia Commons 上的真实照片，许可记录来自当日 Commons API 的 `LicenseShortName` 与 `AttributionRequired`。没有购买，没有热链，没有生成图片。仓库里的文件是为 4:5 卡片裁切并压缩的 JPEG，没有加画面元素。

这三张只出现在首页原有的三格里。商品页图库、购物车和各 SKU 仍不展示样品图。CC0 不强制署名；卡片下仍写作者和许可，避免把照片说成自有拍摄。

## 屋檐风光

- 位置：首页第一格，链到 `/temples`（中文 `/zh/temples`）
- 文件页：https://commons.wikimedia.org/wiki/File:Chinese_green_glazed_roof_tiles_(17145904493).jpg
- 作者：Bernard Spragg. NZ
- 许可：CC0。`AttributionRequired` 为 false
- 画面：绿琉璃筒瓦和起翘屋檐，背景是树。没有佛像、没有可读的殿名、没有人物、没有他人标志
- 本地文件：`public/media/themes/roof.jpg`，`public/media/themes/roof-640.jpg`
- 前台说明：建筑屋檐的参考照片，不是合作场所

## 珠串手镯

- 位置：首页第二格，链到 `/products`（中文 `/zh/products`）
- 文件页：https://commons.wikimedia.org/wiki/File:Beaded_Bracelet_from_Baki%27s_Burial_MET_LC-35_3_63_EGDP025367.jpg
- 来源机构：The Metropolitan Museum of Art。Commons 记录该文件由博物馆开放访问项目捐出
- 许可：CC0。`LicenseUrl` 为 `http://creativecommons.org/publicdomain/zero/1.0/deed.en`。`AttributionRequired` 为 false。`Restrictions` 为空
- 文件说明：Bracelet or armlet。画面是一圈闭合的蓝绿色小珠，尺寸是手腕手镯，不是挂着的长念珠
- 已核对画面：没有佛像，没有可辨认的人，四角没有水印或馆藏编号条
- 前台标明风格示意，不是在售样品
- 上一张长念珠（`File:Tasbih_or_prayer_beads.jpg`）已撤下，不再用作手串
- 本地文件：`public/media/themes/bracelet.jpg`，`public/media/themes/bracelet-640.jpg`。在原图四周补了与背景相近的空白，使整圈手镯落在 4:5 卡片里，没有加其他画面元素

## 灯火

- 位置：首页第三格，链到 `/blessing`（中文 `/zh/blessing`）
- 文件页：https://commons.wikimedia.org/wiki/File:Govaayu,_Butter_Lamp_House_in_Bodh_Gaya.jpg
- 作者：govaayu
- 许可：CC0。`AttributionRequired` 为 false
- 画面：成排点着的小油灯。没有神像，没有人物，没有可读的祈愿文字
- 前台只称氛围参考。供灯页另行展示，预约和支付未开放。这张图不表示合作场所
- 未使用大都会艺术博物馆的一对灯，因为灯身有小型坐像
- 本地文件：`public/media/themes/lamps.jpg`，`public/media/themes/lamps-640.jpg`。两张都能打开，画面是灯火
- 手机整页截图里这一格曾是空白。文件没有损坏。图片当时用绝对定位，视口外的层在整页截图里可能不绘制。现改为在格子内铺满，并设置 `loading="eager"`
