import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/_ui/dialog";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";

import DialogImage from "@/assets/dialogs-img.png";
import FocalLogo from "@/assets/focal-logo-2.png";
import { Textarea } from "../_ui/textarea";

export function ContactUsDialog({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div>{children}</div>
        </DialogTrigger>
        <DialogContent className="m-0 h-[100vh] overflow-y-auto p-0 lg:max-h-[80vh]">
          <div className="flex w-full flex-col items-center sm:flex-row">
            <div className="bg-red relative hidden h-full w-full flex-shrink-0 sm:w-1/2 md:block">
              <img
                src={DialogImage}
                className="h-full w-full overflow-hidden rounded-l-3xl object-cover brightness-75"
                alt="Dialog"
              />
              <div className="absolute inset-0 flex flex-col pl-8 pt-6">
                <img
                  src={FocalLogo}
                  className="left-0 top-0 m-5 w-[100px] rounded-lg"
                />
                <p className="font-cinzel text-4xl font-bold text-white sm:text-7xl">
                  Craft
                  <br />
                  <br />
                  From
                  <br />
                  <br />
                  Heart
                </p>
              </div>
            </div>
            <div className="m-auto flex w-full flex-col p-4 py-12 sm:p-8 md:w-1/2">
              <DialogHeader>
                <DialogTitle className="pb-6 text-center font-cinzel text-2xl font-bold">
                  CONTACT US
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Full Name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here."
                    className="h-32"
                  />
                </div>
              </div>
              <div className="flex justify-center py-6">
                <DialogClose>
                  <button
                    type="submit"
                    className="w-full min-w-[200px] transform rounded-full bg-black px-6 py-3 font-secondary text-lg font-extralight text-white transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-[60%]"
                  >
                    Submit
                  </button>
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
