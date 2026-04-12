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
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
        <div className="text-xs text-blue-600 mb-1">{label}</div>
        <div className="font-bold text-blue-700 text-lg">{formatEuro(amount)}</div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-bold text-gray-900">{formatEuro(amount)}</div>
    </div>
  );
}
