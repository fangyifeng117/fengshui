import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { MerchantIdentity } from "@/components/MerchantIdentity";
import { ZH_EXACT_DISCLAIMER } from "@/lib/disclaimer";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const active = asLocale(locale);
  return pageMetadata({
    title: active === "zh" ? "隐私" : "Privacy",
    description:
      active === "zh"
        ? "商家隐私草稿。支付仍关闭。客户服务与隐私使用同一邮箱。"
        : "Merchant privacy draft. Payment is off. Customer service and privacy use the same email.",
    path: "/legal/privacy",
    locale,
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  if (locale === "zh") {
    return (
      <article className="page prose-page">
        <p className="kicker">商家草稿</p>
        <h1>隐私</h1>
        <p>这是商家草稿，不是律师审定稿。销售地区是全球，不限于美国。</p>
        <MerchantIdentity locale="zh" />
        <p>支付仍关闭。本站不开放账户，不收款，不收集银行卡号。请不要提交宗教祈愿文字、身份证件或支付卡信息。</p>
        <p>
          供灯代办一旦可以预约，我们可能会收集供灯人姓名，以及安排这次代办、并协助写入登记册所必需的其他信息。这些信息只用于完成该请求，不出售。预约和支付仍未开放，所以本页现在不收集这些信息。
        </p>
        <p>
          如果以后保存订单，记录可以包括订单号、商品、金额和支付状态。不保存卡号。付款通知只在去掉付款人敏感字段之后保存。目前没有实时扣款。
        </p>
        <p>没有另行指定数据保护官。隐私问题使用上面的客户服务邮箱。</p>
        <ExactDisclaimer translation={ZH_EXACT_DISCLAIMER} />
      </article>
    );
  }
  return (
    <article className="page prose-page">
      <p className="kicker">Merchant draft</p>
      <h1>Privacy</h1>
      <p>This is a merchant draft, not a lawyer&apos;s sign-off. The sales region is worldwide, not limited to the United States.</p>
      <MerchantIdentity locale="en" />
      <p>
        Payment is off. This site does not open accounts, does not take a charge, and does not collect card numbers. Do
        not submit a religious wish, an identity document, or a payment card.
      </p>
      <p>
        When the lamp errand can be booked, we may collect the offerer&apos;s name and other details strictly necessary
        to arrange the errand and help record them in the registry. That use is limited to fulfilling the request. We
        do not sell this data. Booking and payment are still closed, so this page does not collect it yet.
      </p>
      <p>
        If an order record is stored later, it can hold an order id, the lines, the amount, and the payment status. Card
        numbers are not stored. A payment notice is stored only after sensitive payer fields are removed. No live charge
        is created now.
      </p>
      <p>No separate data-protection officer is named. Privacy questions use the customer-service email above.</p>
      <ExactDisclaimer />
    </article>
  );
}
