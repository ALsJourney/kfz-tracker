import { formatEuro } from "@/lib/formatEuro";

export function CostTile({
  label,
  amount,
  highlight = false,
}: {
  label: string;
  amount: number;
  highlight?: boolean;
}) {
  if (highlight) {
    return (
      <div className="bg-primary p-5 rounded-xl shadow-[0_10px_30px_-10px_rgba(26,86,219,0.5)] flex flex-col justify-between bg-gradient-to-br from-primary to-primary-container text-on-primary">
        <span className="label-md text-on-primary/80 mb-2 block">{label}</span>
        <span className="text-3xl font-bold font-geist tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatEuro(amount)}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl ring-1 ring-outline-variant/10 shadow-sm flex flex-col">
      <span className="label-md text-outline mb-2">{label}</span>
      <span className="text-2xl font-bold text-on-surface font-geist" style={{ fontVariantNumeric: "tabular-nums" }}>
        {formatEuro(amount)}
      </span>
    </div>
  );
}