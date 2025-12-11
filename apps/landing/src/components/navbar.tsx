import { Button } from '@uhomes/ui-kit';
import { SVGs } from '../../../web/src/assets/svgs/Index';
import FindHostelButton from './shared/find-hostel-button';

export default function Navbar() {
  const navLinks = [
    { id: 1, text: 'Home', link: '' },
    { id: 2, text: 'Business', link: '' },
    { id: 3, text: 'About', link: '' },
    { id: 4, text: 'How It Works', link: '' },
    { id: 5, text: 'FAQs', link: '' },
    { id: 6, text: 'Contact', link: '' },
  ];

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-x-2 items-center">
        <SVGs.UHome />
        <span className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
          U - HOMES
        </span>
      </div>
      <div className="hidden lg:flex lg:gap-x-10 lg:items-center">
        {navLinks.map((navLink) => (
          <a
            key={navLink.id}
            className="font-semibold leading-6 tracking-normal text-[#282828] hover:cursor-pointer"
          >
            {navLink.text}
          </a>
        ))}
      </div>
      <div className="hidden lg:flex lg:gap-x-5 lg:items-center">
        <a className="font-semibold text-sm leading-6 tracking-normal text-[#282828] hover:cursor-pointer">
          Login
        </a>
        <FindHostelButton />
      </div>
      <Button
        variant="secondary"
        className="flex justify-center items-center size-10 rounded-lg bg-[#F8F8F8] hover:cursor-pointer lg:hidden"
      >
        <div className="w-4 h-3.5">
          <SVGs.MenuIcon />
        </div>
      </Button>
    </div>
  );
}
