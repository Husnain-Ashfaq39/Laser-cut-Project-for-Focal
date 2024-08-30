import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { Menu } from "lucide-react";
import home from '@/assets/icons/home.svg';
import account from '@/assets/icons/account.svg';
import cutting from '@/assets/icons/cutting.svg';
import material from '@/assets/icons/material.svg';
import customers from '@/assets/icons/customers.svg';
import qoute from '@/assets/icons/qoute.svg';
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { clearUser } from "@/redux/slices/auth-slice";
import { toast } from "./_ui/toast/use-toast";


interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const user = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth();

    const handleLogout = async () => {
        await signOut(auth);
        dispatch(clearUser());
        navigate("/");
        toast({
            variant: "destructive",
            title: "Sign out",
            description:
                "you have been logged out from your accoun",
            duration: 5000,
        });
    };
    return (
        <div
            id="hs-offcanvas-example"
            className={`fixed font-body top-0 left-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto transition-all duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } flex flex-col`} // Added flex and flex-col to the sidebar
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

            <div className="flex-grow"> {/* This makes the navigation grow and take the remaining space */}
                <nav className="p-6 w-full flex flex-col">
                    <ul className="space-y-3">
                        <li onClick={(e) => {
                                e.preventDefault(); 
                                navigate("/admin", { replace: true }); 
                            }}>
                            <a
                                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                                href="#"
                            >
                                <img src={home} alt="" />
                                Dashboard
                            </a>
                        </li>
                        <li  onClick={(e) => {
                                e.preventDefault(); 
                                navigate("/admin/quotes", { replace: true }); 
                            }}>
                            <a
                                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                                href="#"
                            >
                                <img src={qoute} alt="" />
                                Quotes
                            </a>
                        </li>
                        <li
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/admin/add-cutting-techs", { replace: true });
                            }}
                        >
                            <a
                                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                                href="#"
                                role="button"
                            >
                                <img src={cutting} alt="Cutting Technologies" />
                                Cutting Technologies
                            </a>
                        </li>

                        <li onClick={(e) => {
                                e.preventDefault(); 
                                navigate("/admin/material", { replace: true }); 
                            }}>
                            <a
                                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                                href="#"
                            >
                                <img src={material} alt="" />
                                Materials
                            </a>
                        </li>
                        <li onClick={(e) => {
                                e.preventDefault(); 
                                navigate("/admin/customer-list", { replace: true }); 
                            }}>
                            <a
                                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                                href="#"
                            >
                                <img src={customers} alt="" />
                                Customers
                            </a>
                        </li>
                        <li onClick={(e) => {
                                e.preventDefault(); 
                                navigate("/profile-details", { replace: true }); 
                            }}>
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

            {/* profile & logout div placed at the bottom */}
            <div className="flex justify-start space-x-6 items-center mx-8">
                <img
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    alt="User profile"
                    className="cursor-pointer w-10 h-10 rounded-full"
                    onClick={() => {
                        navigate("/profile-details");
                    }}
                />
                <h2 className="font-secondary cursor-pointer" onClick={handleLogout}>sign out</h2>

            </div>
        </div>
    );
};

export default Sidebar;