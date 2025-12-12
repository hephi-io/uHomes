import { SVGs } from '../../../../../packages/ui-kit/src/assets/svgs/Index';
import { Button } from '@uhomes/ui-kit';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function Help() {
  const cards = [
    {
      id: 1,
      icon: SVGs.Phone,
      textOne: 'Phone Support',
      textTwo: 'Mon-Fri, 9am-6pm WAT',
      textThree: '09012345678',
      link: '',
    },
    {
      id: 2,
      icon: SVGs.Mail,
      textOne: 'Email Support',
      textTwo: 'Response within 24 hours',
      textThree: 'support.uhomes@email.com',
      link: '',
    },
    {
      id: 3,
      icon: SVGs.Chat,
      textOne: 'Live Chat',
      textTwo: 'Average wait: 2 minutes',
      textThree: 'Start Chat',
      link: '',
    },
  ];

  const faqButtons = [
    { id: 1, icon: SVGs.QuestionMark, text: 'All Topics', link: '' },
    { id: 2, icon: SVGs.DollarSign, text: 'Payouts & Payments', link: '' },
    { id: 3, icon: SVGs.People, text: 'Bookings & Clients', link: '' },
    { id: 4, icon: SVGs.UploadDoc, text: 'Documents & Verification', link: '' },
    { id: 5, icon: SVGs.Bell, text: 'Notifications & Settings', link: '' },
    { id: 6, icon: SVGs.Bandwidth, text: 'Performance & Analytics', link: '' },
    { id: 7, icon: SVGs.Settings, text: 'Account Settings', link: '' },
  ];

  const accordions = [
    { id: 1, item: 'item-1', label: 'How do I set up my payout method?' },
    { id: 2, item: 'item-2', label: 'When will I receive my payments?' },
    { id: 3, item: 'item-3', label: 'What if my payout is delayed?' },
  ];

  return (
    <>
      <h1 className="font-semibold text-2xl leading-[120%] tracking-[0%] text-black pl-8 py-5 md:pt-0">
        Help
      </h1>
      <div className="border-t border-t-[#E4E4E4]" />
      <div className="p-8 mt-9">
        <div className="size-16 flex justify-center items-center rounded-full bg-[#DBEAFE] md:mx-auto">
          <SVGs.QuestionMark className="text-[#3E78FF]" />
        </div>
        <h2 className="font-medium text-base leading-6 tracking-normal text-black md:text-center mt-4">
          Help & Support
        </h2>
        <p className="text-base leading-6 tracking-normal text-[#727272] md:text-center mt-4">
          Find answers to common questions or get in touch with our support team
        </p>
        <div className="border-t border-t-[#D8D8D8] mt-4"></div>
        <div className="md:grid md:grid-cols-[30.47%_30.47%_30.47%] md:justify-between md:mt-10.5">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`rounded-[10px] border-[0.8px] border-[#E5E7EB] p-[25px] md:mt-0 ${card.id === 1 ? 'mt-10.5' : 'mt-6'}`}
            >
              <div className="size-12 flex justify-center items-center rounded-full bg-[#EDF2FE] mx-auto">
                <card.icon />
              </div>
              <div className="font-Bricolage text-sm leading-6 tracking-normal text-center text-black mt-3">
                {card.textOne}
              </div>
              <div className="font-Bricolage text-sm leading-5 tracking-normal text-center text-[#727272] mt-3">
                {card.textTwo}
              </div>
              <div className="font-Bricolage text-sm leading-6 tracking-normal text-center text-[#3E78FF] mt-3">
                <a className="hover:cursor-pointer">{card.textThree}</a>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[10px] border-[0.8px] border-[#E5E7EB] p-6 mt-10.5">
          <h2 className="font-medium text-base leading-6 tracking-normal text-black text-center">
            Frequently Asked Questions
          </h2>
          <div className="md:flex md:flex-wrap md:gap-2 md:mt-6">
            {faqButtons.map((faqButton) => (
              <div
                key={faqButton.id}
                className={`md:w-fit md:mt-0 ${faqButton.id === 1 ? 'mt-6' : 'mt-2'}`}
              >
                <Button className="group w-fit gap-x-[7px] rounded-[6px] bg-[#F3F4F6] hover:bg-[#3E78FF] hover:cursor-pointer px-[15px] py-1.5">
                  <faqButton.icon className="text-black group-hover:text-white" />
                  <span className="text-sm leading-6 tracking-normal text-black group-hover:text-white">
                    {faqButton.text}
                  </span>
                </Button>
              </div>
            ))}
          </div>
          <Accordion
            type="single"
            className="gap-4 rounded-b-[10px] border-b border-b-[#E5E7EB] mt-6"
            collapsible
          >
            {accordions.map((accordion) => (
              <AccordionItem
                key={accordion.id}
                value={accordion.item}
                className={`rounded-[10px] border-[0.8px] border-[#E5E7EB] px-4 ${accordion.id === 1 ? '' : 'mt-4'}`}
              >
                <AccordionTrigger className="font-Bricolage text-sm leading-[120%] tracking-normal text-black md:leading-6">
                  {accordion.label}
                </AccordionTrigger>
                <AccordionContent className="font-Bricolage">
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
