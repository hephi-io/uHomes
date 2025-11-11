import profile from '@/assets/pngs/profile.png';

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@uhomes/ui-kit';
import Listing from './Listing';
import { SVGs } from '@/assets/svgs/Index';

const Dashboard = () => {
  return (
    <div className="">
      <div className="hidden md:block border-b border-[#E4E4E4] py-5 px-8">
        <h2 className="text-[#000000] font-semibold text-2xl leading-[120%] ">Dashboard</h2>
      </div>

      <div className=" mt-7  md:mt-0 lg:p-8 md:space-y-9 lg:space-y-4">
        <div className=" border-0 md:border-b  md:border-[#E4E4E4]  md:pt-8  lg:pt-3 lg:pb-8 ">
          <div className="flex items-center justify-between mb-6 md:mb-0">
            <div className="flex items-center  gap-4 ">
              <div className="">
                <img src={profile} alt="profile image " className="rounded-full size-12" />
              </div>

              <div className="space-y-0.5">
                <h2 className="font-semibold text-base text-[22px] leading-[120%]">
                  Hi, Brian <span>👋🏽</span>
                </h2>
                <p className="text-[#000000] font-normal text-[14px] sm:text-sm leading-[120%] max-w-[220px] sm:max-w-none">
                  Manage your properties and track your earnings
                </p>
              </div>
            </div>
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-[#F8F8F8] lg:hidden">
              <SVGs.Notification />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          <div className="rounded-lg p-6 border border-[#CBDBFC] flex flex-col  gap-8 bg-linear-to-b from-[#E1EAFD] to-[#FFFFFF]">
            <div className="flex flex-col-reverse  gap-2 md:gap-0 md:flex-row md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">
                Total Properties
              </h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2 size-[35px] md:size-auto ">
                <SVGs.House />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">20</h4>
              <p className="font-normal text-[#71717A] text-[13px]">Listed properties</p>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-[#FFE0D3] flex flex-col  gap-8 bg-linear-to-b from-[#FEECE0] to-[#FFFFFF]">
            <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0 md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">
                Available Rooms
              </h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2  size-[35px] md:size-auto">
                <SVGs.PropertyView />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">3</h4>
              <p className="font-normal text-[#71717A] text-[13px]">Total rooms</p>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-[#BFF0FC] flex flex-col  gap-8 bg-linear-to-b from-[#D8F6FF] to-[#FFFFFF]">
            <div className="flex gap-2 md:gap-0   flex-col md:flex-row md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">
                Pending Bookings
              </h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2 size-[35px] md:size-auto ">
                <SVGs.Note />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">4</h4>
              <p className="font-normal text-[#71717A] text-[13px]">Awaiting review</p>
            </div>
          </div>

          <div className="rounded-lg p-6 border border-[#BCF5D5] flex flex-col  gap-8 bg-linear-to-b from-[#C8FFDC] to-[#FFFFFF]">
            <div className="flex flex-col gap-2 md:flex-row md:gap-0 md:items-center justify-between">
              <h2 className="font-semibold text-sm leading-[150%] text-[#727272]">Total Revenue</h2>
              <div className="rounded-lg bg-[#FFFFFF] p-2 size-[35px] md:size-auto ">
                <SVGs.MoneyBag />
              </div>
            </div>
            <div>
              <h4 className="text-[#09090B] font-bold text-[32px] mb-4 leading-[100%]">₦2,000</h4>
              <p className="font-normal text-[#71717A] text-[13px]">Paid bookings</p>
            </div>
          </div>
        </div>

        {/* listing */}
        <div className="border border-[#E4E7EC] rounded-[12px]">
          <div className="border-b border-[#FFFFFF] border-8 md:px-4 py-3">
            <div className="">
              {/* ---------- Tabs ---------- */}
              <div className="">
                <div className=" flex items-center gap-[54px] mb-4 md:hidden">
                  <div className="flex items-center gap-1 lg:hidden ">
                    <Button
                      variant="outline"
                      className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                    >
                      <SVGs.Filter />
                      {/* <span className="font-medium text-sm text-[#404D61]">Sort By</span> */}
                    </Button>

                    <Button
                      variant="outline"
                      className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                    >
                      <SVGs.FunnelSimple />
                      <span className="font-medium text-sm text-[#404D61]">Filter</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1 md:hidden">
                    <div className="border-b-2 border-[#09090B] py-2 px-3 flex items-center gap-2 cursor-pointer">
                      <SVGs.ListIcon />
                      <span className="text-[#09090B] font-medium text-sm">List</span>
                    </div>

                    <div className="py-2 px-3 flex items-center gap-2 cursor-pointer">
                      <SVGs.GridView />
                      <span className="text-[#09090B] font-medium text-sm">Grid</span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="My Listings" className="w-full">
                  <div className="flex items-center md:gap-[117px] lg:gap-[100px]">
                    <TabsList className="flex  p-1 rounded-md bg-[#F4F4F5] w-[596px] h-10">
                      <TabsTrigger
                        className="flex-1 rounded-sm px-3 py-2 text-sm font-medium text-[#0F172A] 
              data-[state=active]:bg-white data-[state=active]:shadow-[0px_3px_1px_0px_#0000000A,0px_3px_8px_0px_#0000001F]"
                        value="My Listings"
                      >
                        My Listings
                      </TabsTrigger>

                      <TabsTrigger
                        className="flex-1 rounded-sm px-3 py-2 text-sm font-medium text-[#09090B] 
              data-[state=active]:bg-white"
                        value="Bookings"
                      >
                        Bookings
                      </TabsTrigger>

                      <TabsTrigger
                        className="flex-1 rounded-sm px-3 py-2 text-sm font-medium text-[#09090B] 
              data-[state=active]:bg-white"
                        value="Transactions"
                      >
                        Transactions
                      </TabsTrigger>
                    </TabsList>
                    <div className="hidden md:flex items-center gap-4 lg:hidden ">
                      <Button
                        variant="outline"
                        className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                      >
                        <SVGs.Filter />
                        <span className="font-medium text-sm text-[#404D61]">Sort By</span>
                      </Button>

                      <Button
                        variant="outline"
                        className=" lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                      >
                        <SVGs.FunnelSimple />
                        <span className="font-medium text-sm text-[#404D61]">Filter</span>
                      </Button>
                    </div>

                    {/* ---------- List / Grid Toggle ---------- */}
                    <div className="hidden lg:flex items-center gap-3 ">
                      <div className="border-b-2 border-[#09090B] py-2 px-3 flex items-center gap-2 cursor-pointer">
                        <SVGs.ListIcon />
                        <span className="text-[#09090B] font-medium text-sm">List</span>
                      </div>

                      <div className="py-2 px-3 flex items-center gap-2 cursor-pointer">
                        <SVGs.GridView />
                        <span className="text-[#09090B] font-medium text-sm">Grid</span>
                      </div>
                    </div>

                    {/* ---------- Sort / Filter / Add Property ---------- */}
                    <div className=" hidden lg:flex items-center gap-4 ">
                      <Button
                        variant="outline"
                        className="hidden lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                      >
                        <SVGs.Filter />
                        <span className="font-medium text-sm text-[#404D61]">Sort By</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="hidden lg:flex cursor-pointer gap-x-2 rounded border border-[#E4E4E4EE] bg-white px-3 py-2"
                      >
                        <SVGs.FunnelSimple />
                        <span className="font-medium text-sm text-[#404D61]">Filter</span>
                      </Button>

                      <div className="w-px h-[37px] bg-[#E4E4E4]" />

                      <Button
                        variant="outline"
                        className="hidden lg:flex gap-x-2 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
                      >
                        <SVGs.AddProperty />
                        <span className="font-medium text-sm text-white">Add Property</span>
                      </Button>
                    </div>
                  </div>

                  <div className=" hidden md:flex justify-between items-center mt-4 lg:hidden">
                    <div className="flex items-center gap-3">
                      <div className="border-b-2 border-[#09090B] py-2 px-3 flex items-center gap-2 cursor-pointer">
                        <SVGs.ListIcon />
                        <span className="text-[#09090B] font-medium text-sm">List</span>
                      </div>

                      <div className="py-2 px-3 flex items-center gap-2 cursor-pointer">
                        <SVGs.GridView />
                        <span className="text-[#09090B] font-medium text-sm">Grid</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 lg:hidden">
                      <Button
                        variant="outline"
                        className="flex gap-x-2 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
                      >
                        <SVGs.AddProperty />
                        <span className="font-medium text-sm text-white">Add Property</span>
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="My Listings" className="bg-[#FDFDFD]">
                    <Listing />
                  </TabsContent>
                  <TabsContent value="Bookings" className="">
                    {/* <Login /> */}
                  </TabsContent>
                  <TabsContent value="Transactions" className="">
                    {/* <Signup /> */}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
