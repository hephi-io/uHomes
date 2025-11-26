export default function Badge({ Icon, text }: { Icon: any; text: string }) {
  return (
    <div className="flex gap-x-1 items-center rounded-full bg-[#F4F4F5] px-2 py-1">
      <Icon />
      <span className="text-[11px] leading-[150%] tracking-[0%] text-[#3D3D3D]">{text}</span>
    </div>
  );
}

export const StatusBadge = ({ status }: { status: string }) => {
  const base = 'px-6 py-2 rounded-full text-sm leading-5 font-medium inline-block font-Bricolage';

  const styles: Record<string, string> = {
    Pending: 'bg-[#FFD00014] text-[#C18700] border border-[#EAD67B]',
    Accepted: 'bg-[#2BCB0014] text-[#176F00] border border-[#A8DD9A]',
    Cancelled: 'bg-[#ED2A2A14] text-[#B10000] border border-[#FF9E9E]',
  };

  return <span className={`${base} ${styles[status]}`}>{status}</span>;
};

export const TStatusBadge = ({ status }: { status: string }) => {
  const base = 'px-6 py-2 rounded-full text-sm leading-5 font-medium inline-block font-Bricolage';

  const styles: Record<string, string> = {
    'Escrow Held': 'bg-[#FFD00014] text-[#C18700] border border-[#EAD67B]',
    Successful: 'bg-[#2BCB0014] text-[#176F00] border border-[#A8DD9A]',
    Refunded: 'bg-[#ED2A2A14] text-[#B10000] border border-[#FF9E9E]',
  };

  return <span className={`${base} ${styles[status] ?? ''}`}>{status}</span>;
};
