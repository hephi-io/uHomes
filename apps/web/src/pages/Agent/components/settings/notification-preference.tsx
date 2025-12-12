import { Button, Switch } from "@uhomes/ui-kit"


const NotificationPreference = () => {
    return (
        <div className="space-y-9">
            <div className="space-y-4 w-[880px]">
                <h2 className="text-[#101828] font-medium text-sm leading-[150%]">Email Notifications</h2>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Payment notification</h3>
                    <Switch checked={true}  />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Booking notification</h3>
                    <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">System updates</h3>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Review Alert</h3>
                    <Switch />
                </div>
            </div>

            <div className="border border-[#D8D8D8] w-[880px]"></div>
            <div className="space-y-4 w-[880px]">
                <h2 className="text-[#101828] font-medium text-sm leading-[150%]">In-app Notifications</h2>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Payment notification</h3>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Booking notification</h3>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">System updates</h3>
                    <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Review Alert</h3>
                    <Switch checked={true} />
                </div>
            </div>

            <div className="border border-[#D8D8D8] w-[880px]"></div>
            <div className="space-y-4 w-[880px]">
                <h2 className="text-[#101828] font-medium text-sm leading-[150%]">SMS Alert Notifications</h2>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Payment notification</h3>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Booking notification</h3>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">System updates</h3>
                    <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[#475467] text-sm leading-[150%]">Review Alert</h3>
                    <Switch />
                </div>
            </div>

            <div className="flex items-center gap-9">
                <Button type="submit" variant="outline" className="bg-white cursor-pointer w-[188px] h-12 text-[#404D61] border px-4 py-2 leading-[100%] font-medium text-sm rounded-[5px]" >
                    <span>Restore default</span>
                </Button>
                <Button type="submit" variant="outline" className="bg-[#3E78FF] hover:bg-[#3E78FF] hover:text-white cursor-pointer w-[188px] h-12 text-white  border px-4 py-2 leading-[100%] font-medium text-sm rounded-[5px]" >
                    <span>Save Changes</span>
                </Button>
            </div>
        </div>
    )
}

export default NotificationPreference