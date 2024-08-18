import React from "react";
import { Menu } from "lucide-react";
import home from '@/assets/icons/home.svg'
import account from '@/assets/icons/account.svg'
import cutting from '@/assets/icons/cutting.svg'
import material from '@/assets/icons/material.svg'
import customers from '@/assets/icons/customers.svg'
import qoute from '@/assets/icons/qoute.svg'
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      id="hs-offcanvas-example"
      className={`fixed font-body top-0 left-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto transition-all duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      role="dialog"
      aria-label="Sidebar"
    >
      <div className="px-6 flex justify-between font-primary">
        <a
          className="font-semibold text-2xl text-black focus:outline-none focus:opacity-80"
          href="#"
          aria-label="Brand"
        >
          Focal
        </a>
        <Menu size={30} className="cursor-pointer" onClick={toggleSidebar} />
      </div>

      <nav className="p-6 w-full flex flex-col">
        <ul className="space-y-1.5">
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <img src={home} alt="" />
              Dashboard
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <img src={qoute} alt="" />
              Quotes
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <img src={cutting} alt="" />
              Cutting Technologies
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <img src={material} alt="" />
              Materials
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <img src={customers} alt="" />
              Customers
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <img src={account} alt="" />
              Account
            </a>
          </li>
          
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
