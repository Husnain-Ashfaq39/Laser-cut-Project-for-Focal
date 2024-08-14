import FooterAdmin from "@/components/footer/fouter-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import clocksvg from "@/assets/clock.svg";
import dollarsvg from "@/assets/dollar.svg";
import { Button } from "@/components/_ui/button";
import { useNavigate } from "react-router-dom";
import CreateNewQuoteSteper from "@/components/quotes/create-quote/steper";

function QuoteSummary() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5 items-center">
        <h1 className="text-center font-primary text-3xl">
          Create a new quote
        </h1>
        <CreateNewQuoteSteper currentStep={2} />
        <h2 className="font-primary text-2xl">Summary of quote price</h2>
        <div className="mt-6 flex w-11/12 flex-col items-center justify-center space-y-5 rounded-lg border-[0.2px] border-[#585858] bg-[#fafbff] p-8 pb-24">
          <h2 className="font-primary text-2xl">
            Review Summary of Quote Price
          </h2>
          <div className="my-16 flex w-full max-w-4xl flex-col items-center justify-center lg:flex-row lg:space-x-6">
            {/* totalTime card */}
            <div className="mb-20 h-auto w-full lg:mb-0 lg:h-[520px] lg:w-1/2">
              <div className="h-full w-full rounded-lg border-[0.2px] border-[#585858] bg-[#fafafa] p-4">
                <h2 className="font-body text-2xl">Total Time</h2>
                <div className="mx-2 mt-6 text-[#535353]">
                  <div className="mt-4 flex justify-between">
                    <div className="text-black">Parts</div>
                    <div>2</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Number of unique parts</div>
                    <div>2</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Net Weight</div>
                    <div>2</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Largest long-dimension of a part</div>
                    <div>2</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Largest short-dimension of a part</div>
                    <div>2</div>
                  </div>
                  <div className="my-4 border-[0.05px] border-[#B0B0B0]"></div>
                  <h2 className="text-black">MISCELLANEOUS ITEMS</h2>
                  <div className="mt-4 flex justify-between">
                    <div>Number of items</div>
                    <div>2</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Total Weight</div>
                    <div>2</div>
                  </div>
                  <div className="my-4 border-[0.05px] border-[#B0B0B0]"></div>
                  <h2 className="text-black">TIMES</h2>
                  <div className="mt-4 flex justify-between">
                    <div>Total Cutting Time</div>
                    <div>2</div>
                  </div>
                </div>
              </div>
              {/* Bottom */}
              <div className="mt-[-5px] flex h-20 w-full items-center justify-between rounded-b-lg bg-black p-3 px-5 font-primary text-xl text-white">
                <div className="flex items-center">
                  <img src={clocksvg} width={25} height={25} alt="Clock Icon" />
                  <div className="ml-2">Total Time</div>
                </div>
                <div>2 Days</div>
              </div>
            </div>

            {/* TotalPrice card */}
            <div className="h-auto w-full lg:h-[520px] lg:w-1/2">
              <div className="h-full w-full rounded-lg border-[0.2px] border-[#585858] bg-[#ebf5ff] p-4">
                <h2 className="font-body text-2xl">Total Price</h2>
                <div className="mx-2 mt-6 text-[#535353]">
                  <div className="mt-4 flex justify-between">
                    <div className="text-black">Material</div>
                    <div>2</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Cutting</div>
                    <div>2</div>
                  </div>
                  <div className="my-4 border-[0.05px] border-[#B0B0B0]"></div>
                  <h2 className="text-black">MISCELLANEOUS ITEMS</h2>
                  <div className="mt-4 flex justify-between">
                    <div>Number of Items</div>
                    <div>2</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Total Weight</div>
                    <div>2</div>
                  </div>
                  <div className="my-4 border-[0.05px] border-[#B0B0B0]"></div>
                  <h2 className="text-black">Subtotal</h2>
                  <div className="mt-4 flex justify-between">
                    <div>Adjustments</div>
                    <div>2</div>
                  </div>
                  <div className="my-4 border-[0.05px] border-[#B0B0B0]"></div>
                  <h2 className="text-black">Subtotal</h2>
                  <div className="mt-4 flex justify-between">
                    <div>Tax</div>
                    <div>2</div>
                  </div>
                </div>
              </div>
              {/* Bottom */}
              <div className="mt-[-5px] flex h-20 w-full items-center justify-between rounded-b-lg bg-black p-3 px-5 font-primary text-xl text-white">
                <div className="flex items-center">
                  <img
                    src={dollarsvg}
                    width={25}
                    height={25}
                    alt="Clock Icon"
                  />
                  <div className="">Total Price</div>
                </div>
                <div>$1200</div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-6 flex w-11/12 justify-start font-secondary">
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate("/quotes/new-quote")}
            >
              Cancel
            </Button>
            <Button variant="default" className="rounded-full">
              Checkout
            </Button>
          </div>
        </div>
      </main>
        <FooterAdmin />
    </div>
  );
}

export default QuoteSummary;
