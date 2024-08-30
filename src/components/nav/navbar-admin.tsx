import React, { useState, useEffect } from "react";
import { Menu} from "lucide-react";
import FocalLogo from "@/assets/focal-logo.png";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import Sidebar from '@/components/sidebar';

const NavbarAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cachedProfileImage, setCachedProfileImage] = useState("");
  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (user.profileImage) {
      setCachedProfileImage(user.profileImage);
    } else {
      setCachedProfileImage("https://via.placeholder.com/150");
    }
  }, [user.profileImage]);

  return (
    <div>
      <div className="flex h-14 w-full flex-row items-center justify-between bg-white py-2 m-auto px-[5%]">
        <div className="flex flex-row items-center space-x-5">
          <Menu size={30} className="cursor-pointer" onClick={toggleSidebar} />
          <img src={FocalLogo} onClick={() => { navigate("/") }} className="h-8 w-8 object-fill cursor-pointer" />
        </div>
        <div className="flex flex-row items-center space-x-5">
         
          <img
            src={cachedProfileImage}
            alt="User profile"
            className="cursor-pointer w-10 h-10 rounded-full"
            onClick={() => {
              navigate("/profile-details");
            }}
          />
        </div>
      </div>

      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default NavbarAdmin;
