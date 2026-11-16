import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Coins, QrCode, Wallet, AlertTriangle } from "lucide-react";
import { SUPPORT } from "@/config/support";

const card =
  "rounded-2xl border border-frost/10 bg-frost/5 p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-sky/40 flex flex-col items-center text-center gap-4";

export function SupportSection() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT.usdtTrc20Address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <section aria-labelledby="support-title" className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16">
      <h2 id="support-title" className="text-center text-2xl font-bold text-frost">Support My Work 💙</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-mist">
        If you find my projects useful, you can support my work and help me build more free tools for everyone.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className={card}>
          <Coins className="h-6 w-6 text-sky" aria-hidden />
          <h3 className="font-semibold text-frost">Support with Crypto</h3>
          <span className="rounded-full bg-sky/15 px-3 py-1 font-mono text-xs text-sky">USDT – TRON (TRC20)</span>
          <div className="rounded-lg bg-frost p-3">
            <QRCodeSVG value={SUPPORT.usdtTrc20Address} size={160} aria-label="USDT TRC20 wallet QR code" />
          </div>
          <code className="break-all font-mono text-xs text-frost">{SUPPORT.usdtTrc20Address}</code>
          <button onClick={copy} className="inline-flex items-center gap-2 rounded-md bg-sky px-4 py-2 text-sm font-medium text-navy transition hover:opacity-90">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Address copied!" : "Copy Address"}
          </button>
          <p role="status" className="flex items-start gap-1 text-xs text-err">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            Make sure you select the TRON (TRC20) network before sending USDT.
          </p>
        </div>
        <div className={card}>
          <QrCode className="h-6 w-6 text-sky" aria-hidden />
          <h3 className="font-semibold text-frost">Support with Paysera</h3>
          <img src={SUPPORT.payseraQrUrl} alt="Paysera QR code" className="w-48 rounded-lg bg-frost p-2" loading="lazy" />
          <p className="text-xs text-mist">Scan my personal Paysera QR code to send your support.</p>
        </div>
        <div className={card}>
          <Wallet className="h-6 w-6 text-sky" aria-hidden />
          <h3 className="font-semibold text-frost">Support with Oppi Wallet</h3>
          <img src={SUPPORT.oppiQrUrl} alt="Oppi Wallet QR code" className="w-48 rounded-lg bg-frost p-2" loading="lazy" />
          <p className="text-xs text-mist">Scan my Oppi Wallet QR code to send your support.</p>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-mist">
        Every contribution is voluntary and appreciated. Thank you for supporting independent projects!
      </p>
    </section>
  );
}
