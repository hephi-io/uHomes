import { Button } from '@uhomes/ui-kit';
import { useState } from 'react';

export default function FAQs() {
  return (
    <div className="border-x border-x-[#C4C4C4] px-4 py-14 md:px-8 md:py-28 lg:px-33">
      <h1 className="font-semibold text-[34px] leading-[120%] -tracking-[1.5px] text-center text-[#282828] md:text-[44px] md:leading-[63px] lg:text-[54px]">
        Frequently Asked Questions
      </h1>
      <p className="text-sm leading-7.5 tracking-normal text-center text-[#5F6980] md:text-base lg:text-lg mt-6">
        Everything you need to know about booking, payments, safety, and using U-Homes
      </p>
      <div className="lg:w-[67.48%] lg:mx-auto">
        <Accordion question={'Are the hostels on U-Homes verified?'} className={'mt-10'} />
        <Accordion question={'How do I book a viewing?'} className={'mt-3'} />
        <Accordion question={'Do I need to pay to use U-Homes?'} className={'mt-3'} />
        <Accordion question={'How secure is my payment?'} className={'mt-3'} />
        <Accordion question={'What if the hostel I paid for is unavailable?'} className={'mt-3'} />
        <div className="rounded-[12px] border border-[#EAEAEA] md:flex md:justify-between md:items-center px-6 py-5.5 mt-12.5 md:mt-25">
          <div>
            <h2 className="font-medium text-base leading-[120%] -tracking-[0.3px] slashed-zero text-black">
              Still have a question in mind?
            </h2>
            <p className="text-sm leading-[120%] -tracking-[0.2px] align-middle slashed-zero text-[#5E5E5E] mt-2">
              Contact us if you have any other questions.
            </p>
          </div>
          <Button className="rounded-lg bg-[#0F60FF] shadow-[0px_-1.5px_0px_0px_#FFFFFF52_inset_0px_0.5px_0px_0px_#FFFFFF52_inset] hover:cursor-pointer px-7 py-2 mt-2 md:mt-0">
            <span className="font-semibold text-sm leading-7 -tracking-[0.2px] text-center text-white">
              Contact Us
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Accordion({ question, className }: { question: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-[12px] bg-[#FAFAFA] px-6 py-5.5 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-base leading-[150%] -tracking-[0.3px] slashed-zero text-black">
          {question}
        </span>
        <div
          className="relative size-[15.63px] hover:cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div
            style={{ left: 'calc(50% - 0.5px)' }}
            className={`absolute h-[15.63px] border border-[#7C7C7C] transition-all duration-300 ease-in-out ${expanded ? 'rotate-90 opacity-0' : ''}`}
          />
          <div
            style={{ bottom: 'calc(50% - 0.5px)' }}
            className="absolute w-[15.63px] border border-[#7C7C7C]"
          />
        </div>
      </div>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <p className="text-sm leading-[130%] -tracking-[0.2px] slashed-zero text-[#5E5E5E] overflow-hidden md:text-base">
          Yes. Every hostel listed on U-Homes is inspected, verified, and approved before going
          live. No scams, no hidden conditions.
        </p>
      </div>
    </div>
  );
}
