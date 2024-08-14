import FooterAdmin from "@/components/footer/fouter-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";

import { Button } from "@/components/_ui/button";
import { useNavigate } from "react-router-dom";
import CreateNewQuoteSteper from "@/components/quotes/create-quote/steper";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/_ui/select";
import { Input } from "@/components/_ui/input";
import { DatePickerDemo } from "@/components/_ui/datepicker";

function AddDetails() {
    const navigate = useNavigate();
    return (
        <div className="w-full bg-slate-100 font-body">
            <NavbarAdmin />
            <main className="m-auto flex min-h-screen flex-col px-[5%] py-5 items-center">
                <h1 className="text-center font-primary text-3xl">
                    Create a new quote
                </h1>
                <CreateNewQuoteSteper currentStep={1} admin={true} />

                <div className="mt-6 w-full space-y-5 rounded-lg border-[0.2px] border-[#585858] bg-[#fafbff] p-8 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div>
                            <h2 className="font-normal mb-2">Select Customer</h2>
                            <Select>
                                <SelectTrigger className="w-full font-medium">
                                    <SelectValue placeholder="Select a Customer" />
                                </SelectTrigger>
                                <SelectContent className="font-secondary font-medium">
                                    <SelectGroup>
                                        <SelectLabel>A</SelectLabel>
                                        <SelectLabel>B</SelectLabel>
                                        <SelectLabel>C</SelectLabel>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <h2 className="font-normal mb-2">Select Contract</h2>
                            <Select>
                                <SelectTrigger className="w-full font-medium">
                                    <SelectValue placeholder="Select Contract" />
                                </SelectTrigger>
                                <SelectContent className="font-secondary font-medium">
                                    <SelectGroup>
                                        <SelectLabel>A</SelectLabel>
                                        <SelectLabel>B</SelectLabel>
                                        <SelectLabel>C</SelectLabel>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="font-normal mb-2 block">Quote</label>
                            <Input type="text" className="font-body font-medium w-full" />
                        </div>

                        <div>
                            <label className="font-normal mb-2 block">RFQ</label>
                            <Input type="text" className="font-body font-medium w-full" />
                        </div>

                        <div>
                            <label className="font-normal mb-2 block">Quote Expiry Date</label>
                            <DatePickerDemo />
                        </div>

                        <div>
                            <label className="font-normal mb-2 block">Shipping Option</label>
                            <Input type="text" className="font-body font-medium w-full" />
                        </div>

                        <div>
                            <h2 className="font-normal mb-2">Select Tax Rate</h2>
                            <Select>
                                <SelectTrigger className="w-full font-medium">
                                    <SelectValue placeholder="Select Tax Rate" />
                                </SelectTrigger>
                                <SelectContent className="font-secondary font-medium">
                                    <SelectGroup>
                                        <SelectLabel>A</SelectLabel>
                                        <SelectLabel>B</SelectLabel>
                                        <SelectLabel>C</SelectLabel>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="font-normal mb-2 block">Required Expiry Date</label>
                            <DatePickerDemo />
                        </div>
                    </div>
                </div>

                <div className="my-6 w-full flex justify-start font-secondary">
                    <div className="flex space-x-4">
                        <Button
                            variant="outline"
                            className="rounded-full"
                            onClick={() => navigate("/quotes/new-quote")}
                        >
                            Cancel
                        </Button>
                        <Button variant="default" className="rounded-full">
                            Next
                        </Button>
                    </div>
                </div>
            </main>
            <FooterAdmin />
        </div>
    );
}

export default AddDetails;
