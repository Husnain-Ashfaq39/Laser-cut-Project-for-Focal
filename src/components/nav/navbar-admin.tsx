import { Menu, ShoppingCart, Bell, BellDot } from "lucide-react";
import UserLogo from "@/assets/user-nav-img.png";
import FocalLogo from "@/assets/focal-logo.png";

const NavbarAdmin = () => {
  return (
    <div className="flex h-14 w-full flex-row items-center justify-between bg-white py-2 m-auto px-[5%]">
      <div className="flex flex-row items-center space-x-5">
        <Menu size={30} />
        <img src={FocalLogo} className="h-8 w-8 object-fill"/>
      </div>
      <div className="flex flex-row items-center space-x-5">
        <Bell size={24} />
        <ShoppingCart size={24} />
        <img src={UserLogo} />
      </div>
    </div>
  );
};

export default NavbarAdmin;
