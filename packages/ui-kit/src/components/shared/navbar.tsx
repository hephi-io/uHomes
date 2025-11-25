import { NavLink } from 'react-router-dom';
import { SVGs } from '../../../../../apps/web/src/assets/svgs/Index';
interface navBtn {
    id: number,
    label: string
    link: string
}
interface Inavbar {
    userName: string,
    navButtons: navBtn[],
    img?: string
}

interface NavLinkActiveState {
    isActive: boolean;
}

const Navbar = ({ userName, navButtons }: Inavbar) => {

    const navLinkStyles = ({ isActive }: NavLinkActiveState ) => {
        return {
            fontWeight: isActive ? 'bold' : '600',
            color: isActive ? 'Zinc/950 ' : '#71717A'
        };
    };

    return (
        <div className="flex justify-between items-center rounded-lg border border-[#E4E9EE] bg-white md:rounded-xl md:border-[#F2F2F2] lg:rounded-none lg:border-x-0 lg:border-[#E4E4E4] p-3 md:p-4 lg:px-8 lg:py-4">
            <div className="md:flex md:gap-x-6 md:items-center lg:gap-x-38">
                <div className="hidden w-10 h-10 justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:flex lg:hidden">
                    <SVGs.MenuIcon />
                </div>
                <div className="flex gap-x-2 items-center">
                    <SVGs.UHome />
                    <h1 className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
                        HOMES
                    </h1>
                </div>
                <div className="hidden lg:flex lg:gap-x-12 lg:items-center">
                    {navButtons.map((navButton) => (
                        <NavLink
                            to={navButton.link}
                            style={navLinkStyles}
                            key={navButton.id}
                            className="text-sm leading-[100%] tracking-[0%]  hover:cursor-pointer"
                        >
                            {navButton.label}
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className="w-10 h-10 flex justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:hidden">
                <SVGs.MenuIcon />
            </div>
            <div className="hidden md:block lg:flex lg:gap-x-8 lg:items-center">
                <div className="hidden w-10 h-10 justify-center items-center rounded-full border border-[#00000033] bg-[#F8F8F8] lg:flex">
                    <SVGs.Notification />
                </div>
                <div className="hidden md:flex md:gap-x-3 md:items-center hover:cursor-pointer">
                    <SVGs.ProfilePicSmall />
                    <span className="font-medium text-sm leading-[150%] tracking-[0%] text-center text-[#000000]">
                        {userName} .
                    </span>
                    <SVGs.CaretDown />
                </div>
            </div>
        </div>
    )
}

export default Navbar