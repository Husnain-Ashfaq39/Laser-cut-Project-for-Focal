import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import FocalLogo from "@/assets/focal-logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Sidebar from "@/components/sidebar";
import NotificationIcon from "@/components/notification_icon";

const NavbarAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cachedProfileImage, setCachedProfileImage] = useState("");
  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    setCachedProfileImage(
      user.profileImage || "/profile.jpg",
    );
  }, [user.profileImage]);

  return (
    <div>
      <div className="m-auto flex h-14 w-full flex-row items-center justify-between bg-white px-[5%] py-2">
        <div className="flex flex-row items-center space-x-5">
          <Menu size={30} className="cursor-pointer" onClick={toggleSidebar} />
          <img
            src={FocalLogo}
            onClick={() => navigate("/")}
            className="h-8 w-8 cursor-pointer object-fill"
          />
        </div>
        <div className="flex flex-row items-center space-x-5">
          <NotificationIcon />
          <img
            src={cachedProfileImage}
            alt="User profile"
            className="h-10 w-10 cursor-pointer rounded-full"
            onClick={() => navigate("/profile-details")}
          />
        </div>
      </div>

      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default NavbarAdmin;
