import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const FAQ = () => {
  return (
    <div className="m-auto flex w-[80%] flex-col items-center pt-16">
      <Navbar />
      <div className="container mx-auto mt-16 px-4 py-8">
        <h1 className="font-cinzel mb-4 text-center text-6xl">
          Frequently Asked <br />
          <span className="font-secondary font-normal">Questions</span>
        </h1>
        <div className="space-y-4 font-secondary font-normal text-gray-600">
          <Accordion.Root type="single" collapsible className="space-y-2">
            <Accordion.Item
              value="item-1"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>Where are you based?</span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                Our workshop is based at{" "}
                <a
                  href="https://www.google.com/maps/place/Focal/@-45.0058129,168.7520359,13z/data=!4m6!3m5!1s0xa9d51ff51b498e23:0xf248634d62560d0e!8m2!3d-45.0058273!4d168.7518396!16s%2Fg%2F11rv376fwx?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  19 Margaret Place
                </a>{" "}
                in beautiful Queenstown, New Zealand.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value="item-2"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>Do you do work outside of Queenstown?</span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                We are more than happy to organise freight throughout New
                Zealand or worldwide for products that we manufacture and
                project dependent we can also install these.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value="item-3"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>
                    I don’t know exactly what I want. Can you still help?
                  </span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                Of course! We have an in-house design team that are trained on
                professional grade CAD software. We can work with you to create
                multiple iterations of your idea until all parties are happy to
                move forward.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value="item-4"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>
                    My project is made from brass. I have heard that this is
                    difficult to work with. Do you have the skills to complete
                    it?
                  </span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                We employ skilled tradesman who are masters at their craft. We
                have created processes that allow us to consistently achieve
                great results using hard to work with materials.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value="item-5"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>How long will it take to receive a quote?</span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                This is completely job dependent. We will keep you informed
                along the way. We try to have quotes back to customers back
                within one week of contact however, this is not always possible
                when there are design elements needed to be completed first.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value="item-6"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>I have accepted a quote. Now what?</span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                Once we have confirmation of quote acceptance, A 30% deposit
                invoice will be sent through. As soon as this is paid, we will
                put the job into our production schedule.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value="item-7"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>
                    How long will it take for my product to be made or
                    installed?
                  </span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                Again, this is job dependent. We have an accurate scheduling
                program that has all of our current jobs entered. We will keep
                you informed with timeframes. We keep an agile schedule that we
                constantly adapt to ensure that we deliver just-in-time as
                construction projects require.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value="item-8"
              className="overflow-hidden rounded-lg border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full justify-between bg-gray-100 px-4 py-2 text-left text-lg font-semibold hover:bg-gray-200">
                  <span>
                    My project will take longer than a calendar month. How is
                    this billed?
                  </span>
                  <ChevronDownIcon className="group-radix-state-open:rotate-180 h-5 w-5 text-gray-500 transition-transform" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="border-t bg-white px-4 py-2">
                We will bill a progress invoice at the end of every month that
                will be due on the 20th of the following month. This is to
                ensure consistent cashflow for us a small business and is
                non-negotiable.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
