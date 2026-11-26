import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { MerchantIdentity } from "@/components/MerchantIdentity";
import { ZH_EXACT_DISCLAIMER } from "@/lib/disclaimer";
import { merchantIdentity } from "@/lib/merchant";
import type { Locale } from "@/lib/locale";

export function ShippingPolicy({ locale }: { locale: Locale }) {
  if (locale === "zh") {
    return (
      <article className="page prose-page">
        <p className="kicker">商家草稿</p>
        <h1>配送与退货</h1>
        <p>这是商家草稿，不是律师审定稿。支付仍关闭，所以这个页面不能下单，也不能发起退货。</p>
        <MerchantIdentity locale="zh" />
        <h2>八宝琉璃手串</h2>
        <p>
          下面的配送只适用于八宝琉璃手串。从{merchantIdentity.dispatchZh}发出。面向顾客的全球配送包邮，并提供物流追踪。其他样品列表不发货。
        </p>
        <p>接受订单之后，计划在 1–3 个工作日内从杭州发出。</p>
        <p>发货后，主要地区预计 7–15 个工作日送达。偏远地区可能更久。这是估计，不是保证。</p>
        <p>进口关税和税费由收件人承担。本站不代收这些费用。</p>
        <h2>退货</h2>
        <p>退货寄回上面的注册地址。未使用的手串可以退。除非商品有缺陷或与描述不符，退货运费由买方承担。</p>
        <p>法律规定的权利仍然保留。支付关闭期间，本站不发起退款。</p>
        <ExactDisclaimer translation={ZH_EXACT_DISCLAIMER} />
      </article>
    );
  }
  return (
    <article className="page prose-page">
      <p className="kicker">Merchant draft</p>
      <h1>Shipping and returns</h1>
      <p>This is a merchant draft, not a lawyer&apos;s sign-off. Payment is off, so this page does not start an order or a return.</p>
      <MerchantIdentity locale="en" />
      <h2>Babao Liuli Bracelet</h2>
      <p>
        This shipping note covers the Babao Liuli Bracelet only. It ships from {merchantIdentity.dispatchEn}. Tracked
        shipping to customers worldwide is free. Other listings are samples and are not shipped.
      </p>
      <p>After an order is accepted, dispatch from Hangzhou is planned in 1–3 business days.</p>
      <p>
        After dispatch, delivery to major regions is estimated at 7–15 business days. Remote regions can take longer.
        These are estimates, not a guarantee.
      </p>
      <p>The recipient pays import duties and taxes. This shop does not collect those charges.</p>
      <h2>Returns</h2>
      <p>
        Returns go to the registered address above. An unused bracelet may be returned. Unless the bracelet is defective
        or not as described, the buyer pays the return shipping.
      </p>
      <p>Statutory rights stay in place. This site does not send a refund while payment is off.</p>
      <ExactDisclaimer />
    </article>
  );
}
