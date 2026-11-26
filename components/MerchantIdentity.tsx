import { SupportEmail } from "@/components/SupportEmail";
import { merchantIdentity } from "@/lib/merchant";
import { publicConfig } from "@/lib/public-config";
import type { Locale } from "@/lib/locale";

export function MerchantIdentity({ locale }: { locale: Locale }) {
  return (
    <address className="merchant-identity">
      <p>{locale === "zh" ? "经营者" : "Seller"}</p>
      <p>{merchantIdentity.legalName}</p>
      <p>{merchantIdentity.address}</p>
      <p>{locale === "zh" ? merchantIdentity.countryZh : merchantIdentity.countryEn}</p>
      <p>{publicConfig.baseUrl}</p>
      <p>
        {locale === "zh" ? "客户服务与隐私联系：" : "Customer service and privacy: "}
        <SupportEmail />
      </p>
    </address>
  );
}
