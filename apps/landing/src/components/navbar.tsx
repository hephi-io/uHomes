import { Button } from '@uhomes/ui-kit';
import { SVGs } from '../../../../packages/ui-kit/src/assets/svgs/Index';
import FindHostelButton from './shared/find-hostel-button';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { id: 1, text: 'Home', link: '' },
    { id: 2, text: 'Business', link: '' },
    { id: 3, text: 'About', link: '' },
    { id: 4, text: 'How It Works', link: '' },
    { id: 5, text: 'FAQs', link: '' },
    { id: 6, text: 'Contact', link: '' },
  ];

  const close = () => {
    setOpen(false);
  };

  return (
    <>
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
          onClick={() => setOpen(true)}
        >
          <div className="w-4 h-3.5">
            <SVGs.MenuIcon />
          </div>
        </Button>
      </div>
      <MenuDropdown open={open} close={close} />
    </>
  );
}

function MenuDropdown({ open, close }: { open: boolean; close: () => void }) {
  const buttons = [
    { id: 1, icon: SVGs.Home, text: 'Home', link: '' },
    { id: 2, icon: SVGs.InformationCircle, text: 'About', link: '' },
    { id: 3, icon: SVGs.WorkflowCircle, text: 'How It Works', link: '' },
    { id: 4, icon: SVGs.UserQuestion, text: 'FAQs', link: '' },
    { id: 5, icon: SVGs.ContactBook, text: 'Contact', link: '' },
  ];

  return (
    <div
      className={`fixed left-0 right-0 top-0 bottom-0 bg-[#000000BF] ${open ? 'block' : 'hidden'}`}
      onClick={() => close()}
    >
      <div className="w-[340px] bg-white pb-18">
        <div className="flex justify-between items-center px-[33px] py-4">
          <div className="flex gap-x-2 items-center">
            <SVGs.UHome />
            <span className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
              U - HOMES
            </span>
          </div>
          <SVGs.Cancel className="text-[#26203B] hover:cursor-pointer" onClick={() => close()} />
        </div>
        <div className="border-t border-t-[#E4E7EC]" />
        <div className="px-[33px] py-6">
          {buttons.map((button) => (
            <Button
              key={button.id}
              variant="ghost"
              className={`flex gap-x-4 hover:cursor-pointer p-0 ${button.id === 1 ? '' : 'mt-6'}`}
            >
              <div className="size-11 flex justify-center items-center rounded-full border border-[#DDDDDD] bg-[#F9F9F9]">
                <button.icon className="text-[#71717A]" />
              </div>
              <span className="font-semibold text-sm leading-[110%] tracking-normal align-middle text-[#26203B]">
                {button.text}
              </span>
            </Button>
          ))}
        </div>
        <div className="px-4">
          <div className="rounded-[7px] border border-[#E5E4DE] bg-[#F9F9F9] p-2">
            <h3 className="text-[13px] leading-4.5 -tracking-[0.25px] text-[#2D2D2D] p-3">
              Business
            </h3>
            <Button className="w-full flex justify-between items-center rounded-[6px] border-[0.5px] border-[#9E9E9E] bg-[#F9F9F9] p-3 mt-2">
              <span className="text-[13px] leading-4.5 -tracking-[0.25px] text-[#2D2D2D]">
                Login
              </span>
              <SVGs.ArrowForward className="text-[#2D2D2D]" />
            </Button>
            <Button className="w-full flex justify-between items-center rounded-[4.54px] border-[0.32px] border-[#0000000A] bg-[#0F60FF] p-3 mt-2">
              <span className="font-semibold text-sm leading-7 -tracking-[0.2px] text-white">
                Find a Hostel
              </span>
              <SVGs.ArrowForward className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
