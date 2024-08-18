import FooterAdmin from '@/components/footer/fouter-admin'
import NavbarAdmin from '@/components/nav/navbar-admin'
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/_ui/select";
import { Search } from '@/components/_ui/search';
import { Button } from '@/components/_ui/button';

function Material() {
    return (
        <div className="w-full bg-slate-100 font-body">
            <NavbarAdmin />
            <main className="m-auto flex min-h-screen flex-col px-[5%] py-5 items-center">
                <h1 className="text-center font-primary text-3xl mb-5">
                    Materials
                </h1>
                <div className="mt-6 w-full space-y-5 rounded-lg border-[0.2px] border-[#585858] bg-[#fafbff] p-8  flex justify-start items-center space-x-5">
                    <div className='w-56'>
                        <h2 className="font-normal ">Cutting Technology</h2>
                        <Select>
                            <SelectTrigger className="w-full font-medium">
                                <SelectValue placeholder="Cutting Technology" />
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



                    <Search
                        type="text"
                        className="font-body font-medium w-56 rounded-lg h-10"
                        placeholder='Search Material'
                        value={null}

                    />


                    <Button
                        variant="default"
                        className="rounded-full font-secondary"
                        onClick={null}
                    >
                        +Add new Material
                    </Button>

                </div>
                {/* Materials */}
                <div className='my-16 w-full flex space-x-10'>
                    <div className=' bg-[#EEEFF2] rounded-lg border-[0.2px] border-[#c4c4c4] flex flex-col p-8 w-[33%]'>
                        <h1 className="font-body text-xl">
                            New Material
                        </h1>
                        <div className="mx-2 mt-6 text-[#535353]">
                            <div className="mt-4 flex justify-between">
                                <div className="text-black">Maximum sheet width (mm)</div>
                                <div>2</div>
                            </div>
                            {/* Other attributes */}
                        </div>
                    </div>
                    <div className=' bg-[#EEEFF2] rounded-lg border-[0.2px] border-[#c4c4c4] flex flex-col p-8 w-[33%]'>
                        <h1 className="font-body text-xl">
                            New Material
                        </h1>
                        <div className="mx-2 mt-6 text-[#535353]">
                            <div className="mt-4 flex justify-between">
                                <div className="text-black">Maximum sheet width (mm)</div>
                                <div>2</div>
                            </div>
                            {/* Other attributes */}
                        </div>
                    </div>
                    <div className=' bg-[#EEEFF2] rounded-lg border-[0.2px] border-[#c4c4c4] flex flex-col p-8 w-[33%]'>
                        <h1 className="font-body text-xl">
                            New Material
                        </h1>
                        <div className="mx-2 mt-6 text-[#535353]">
                            <div className="mt-4 flex justify-between">
                                <div className="text-black">Maximum sheet width (mm)</div>
                                <div>2</div>
                            </div>
                            {/* Other attributes */}
                        </div>
                    </div>
                    

                </div>

            </main>
            <FooterAdmin />

        </div>
    )
}

export default Material