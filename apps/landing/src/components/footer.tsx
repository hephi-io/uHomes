import { SVGs } from '../../../../packages/ui-kit/src/assets/svgs/Index';

export default function Footer() {
  const headerAndLinks = [
    {
      id: 1,
      header: 'Product',
      links: [
        { id: 1, text: 'Features' },
        { id: 2, text: 'Pricing' },
        { id: 3, text: 'Changelog' },
        { id: 4, text: 'Support' },
      ],
    },
    {
      id: 2,
      header: 'Legal',
      links: [
        { id: 1, text: 'Terms of Privacy' },
        { id: 2, text: 'Privacy Policy' },
        { id: 3, text: 'Security' },
      ],
    },
    {
      id: 3,
      header: 'Company',
      links: [
        { id: 1, text: 'Blog' },
        { id: 2, text: 'Contact' },
      ],
    },
  ];

  return (
    <>
      <div className="md:flex md:flex-row-reverse md:justify-between">
        <SVGs.LogoSmall className="md:w-[142.68px] md:h-[138.37px] lg:w-[286px] lg:h-[277.37px]" />
        <div className="lg:w-[68.45%] lg:flex lg:gap-x-[156px]">
          <h1 className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E] mt-8 md:mt-0">
            U - HOMES
          </h1>
          <div className="md:grid md:grid-cols-3 md:gap-13 lg:grow lg:gap-[52px] md:mt-4.5 lg:mt-0">
            {headerAndLinks.map((header) => (
              <div key={header.id} className={`${header.id === 1 ? 'mt-4.5' : 'mt-20'} md:mt-0`}>
                <h3 className="font-semibold text-sm leading-6 tracking-normal text-[#282828]">
                  {header.header}
                </h3>
                {header.links.map((link) => (
                  <div key={link.id} className={link.id === 1 ? 'mt-4' : 'mt-3'}>
                    <a className="text-sm leading-5.5 tracking-normal text-[#5F6980]">
                      {link.text}
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="font-Bricolage text-sm leading-5.5 tracking-normal text-center text-[#5F6980] mt-8 lg:mt-2.5">
        All rights reserved.© 2025 Hephi Studios
      </div>
    </>
  );
}
