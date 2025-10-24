import { Tabs, TabsContent, TabsList, TabsTrigger } from "@uhomes/ui-kit";
import UHome from "@/assets/svgs/u-home.svg?react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Blobs from "@/assets/pngs/Blobs Wrapper.png";

const Index = () => {
  return (
    <section
      className="md:flex md:min-h-screen md:justify-center md:items-center font-Bricolage
             sm:bg-none md:bg-cover md:bg-center md:bg-no-repeat"
      style={{
        backgroundImage: `url(${Blobs})`,
      }}
    >
      <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-10 rounded-none md:rounded-2xl">
        <div className=" w-full md:w-[350px]">
          <div className="flex justify-center items-center my-2">
            <div className="p-2 bg-[#EDEDED] rounded-xl">
              <UHome className="w-[46.4px] h-[45px]" />
            </div>
          </div>

          <div className="my-6 w-full">
            <Tabs defaultValue="Create Account" className="w-full">
              <TabsList className="flex w-full p-1 rounded-md bg-[#F4F4F5] h-10">
                <TabsTrigger
                  className="flex-1 rounded-sm px-3 py-2 text-sm font-medium text-[#0F172A] 
          data-[state=active]:bg-white data-[state=active]:shadow-[0px_3px_1px_0px_#0000000A,_0px_3px_8px_0px_#0000001F]"
                  value="Log In"
                >
                  Log In
                </TabsTrigger>

                <TabsTrigger
                  className="flex-1 rounded-sm px-3 py-2 text-sm font-medium text-[#09090B] 
          data-[state=active]:bg-white data-[state=active]:shadow-[0px_3px_1px_0px_#0000000A,_0px_3px_8px_0px_#0000001F]"
                  value="Create Account"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="Log In" className="pt-4">
                <Login />
              </TabsContent>

              <TabsContent value="Create Account" className="pt-4">
                <Signup />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Index;
