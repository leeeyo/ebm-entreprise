import Script from "next/script";
import { isMetaTrackingDisabled } from "@/lib/meta-pixel";

function isServerMetaTrackingDisabled() {
  const value = process.env.META_TRACKING_DISABLED?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function MetaPixelBootstrap() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (!pixelId || isServerMetaTrackingDisabled() || isMetaTrackingDisabled()) return null;

  return (
    <>
      <Script id="meta-pixel-bootstrap" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq.disablePushState = true;
fbq('set', 'autoConfig', false, ${JSON.stringify(pixelId)});
fbq('init', ${JSON.stringify(pixelId)});
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
