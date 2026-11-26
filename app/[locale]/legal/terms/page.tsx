import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { MerchantIdentity } from "@/components/MerchantIdentity";
import { ServiceDisclaimer } from "@/components/ServiceDisclaimer";
import { ZH_EXACT_DISCLAIMER, ZH_SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const active = asLocale(locale);
  return pageMetadata({
    title: active === "zh" ? "条款" : "Terms",
    description:
      active === "zh"
        ? "商家条款草稿。支付仍关闭。销售地区是全球。"
        : "Merchant terms draft. Payment is off. Sales are worldwide.",
    path: "/legal/terms",
    locale,
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  if (locale === "zh") {
    return (
      <article className="page prose-page">
        <p className="kicker">商家草稿</p>
        <h1>条款</h1>
        <p>这是商家草稿，不是律师审定的合同。销售地区是全球，不限于美国。没有公布电话。</p>
        <MerchantIdentity locale="zh" />
        <p>支付仍关闭，所以本站今天不接受订单。八宝琉璃手串标价 USD 188，库存 10。其他列表是样品，不是出售要约。</p>
        <p>
          祈福供灯是商家代办的展示：按顾客选择，在杭州的天下第一财神庙或灵隐寺中的一处代为申请供灯并记录到访。这不是寺院官方服务，不是合作，也不是开光。不保证灵性、健康或财务结果。预约和支付未开放，本页不收集宗教祈愿文字。
        </p>
        <p>代办已经完成的那一次不退。商家没有完成代办的，退还该次费用。法定权利仍然保留。这项服务现在不能购买。</p>
        <p>
          八宝琉璃手串从杭州发出，全球包邮并提供追踪。接受订单后计划 1–3 个工作日发出。发货后主要地区预计 7–15
          个工作日，偏远地区可能更久，这是估计不是保证。进口关税和税费由收件人承担。未使用的手串可以退回注册地址；除非有缺陷或与描述不符，退货运费由买方承担。
        </p>
        <ExactDisclaimer translation={ZH_EXACT_DISCLAIMER} />
        <ServiceDisclaimer translation={ZH_SERVICE_DRAFT_DISCLAIMER} />
      </article>
    );
  }
  return (
    <article className="page prose-page">
      <p className="kicker">Merchant draft</p>
      <h1>Terms</h1>
      <p>
        This is a merchant draft, not a contract a lawyer has signed. The sales region is worldwide, not limited to the
        United States. No phone number is published.
      </p>
      <MerchantIdentity locale="en" />
      <p>
        Payment is off, so this site does not accept an order today. The Babao Liuli Bracelet is listed at USD 188, with
        10 on hand. Other listings are samples and are not offers to sell.
      </p>
      <p>
        Offering lamps are a merchant errand on display. The merchant helps the customer request a lamp offering at one
        Hangzhou venue the customer chooses, either 天下第一财神庙 or 灵隐寺, and documents the visit. It is not an
        official temple-operated service, not a partnership, and not consecration. No spiritual, health, or financial
        result is guaranteed. Booking and payment are not open. This site does not collect religious wish text.
      </p>
      <p>
        After that errand has been performed, that occasion is not refunded. If the merchant fails to perform it, that
        occasion is refunded. Statutory rights stay in place. The service is not available for purchase.
      </p>
      <p>
        The Babao Liuli Bracelet ships from Hangzhou with free tracked shipping worldwide. After an order is accepted,
        dispatch is planned in 1–3 business days. Delivery to major regions is estimated at 7–15 business days after
        dispatch, and longer for remote regions. That timing is an estimate, not a guarantee. The recipient pays import
        duties and taxes. An unused bracelet may be returned to the registered address. Unless it is defective or not as
        described, the buyer pays the return shipping.
      </p>
      <ExactDisclaimer />
      <ServiceDisclaimer />
    </article>
  );
}
