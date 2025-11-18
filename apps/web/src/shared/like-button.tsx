import { Button } from '@uhomes/ui-kit';
import { SVGs } from '@/assets/svgs/Index';

export default function LikeButton() {
  return (
    <Button variant="outline" className="w-7 h-7 rounded-md border border-[#CECECE] bg-white p-0">
      <SVGs.Favorite />
    </Button>
  );
}
