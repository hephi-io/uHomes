export default function Badge({ Icon, text }: { Icon: any; text: string }) {
  return (
    <div className="flex gap-x-1 items-center rounded-full bg-[#F4F4F5] px-2 py-1">
      <Icon />
      <span className="text-[11px] leading-[150%] tracking-[0%] text-[#3D3D3D]">{text}</span>
    </div>
  );
}
