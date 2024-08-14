import { useState } from "react";
import { Menu, MenuItem } from "./navbar-menu";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import focalLogoI from "@/assets/focal-logo.png";
import focalLogoII from "@/assets/logo/FOCAL_Brand_Mark_Stone_Transperant.jpg";

import { ContactUsDialog } from "../dialogs/contact-us-dialog";
import { LoginDialog } from "../dialogs/login-dialog";
import { SignUpDialog } from "../dialogs/sign-up-dialog";
import { useIsScrolled } from "@/hooks/useIsScrolled";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { isHome } from "@/utils/helpers";
import { clearUser } from "@/redux/slices/auth-slice";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "../_ui/button";

const Navbar = ({ className }: { className?: string }) => {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const auth = getAuth();

  const [active, setActive] = useState<string | null>(null);
  const isScrolled = useIsScrolled();

  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const toggleSignUpDialog = (isOpen: boolean) => {
    setIsSignUpDialogOpen(isOpen);
    if (isOpen) setIsLoginDialogOpen(false);
  };

  const toggleLoginDialog = (isOpen: boolean) => {
    setIsLoginDialogOpen(isOpen);
    if (isOpen) setIsSignUpDialogOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
  };

  const truncateName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return `${name.slice(0, maxLength)}...`;
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-10 z-50 mx-auto hidden lg:block",
        isScrolled ? "max-w-[100%]" : "max-w-[90%]",
        className,
      )}
    >
      <Menu setActive={setActive}>
        <div className="flex items-center justify-between space-x-6">
          <img
            className={`rounded-md object-contain transition-all duration-500 ${!isScrolled ? "h-[50px] w-[50px]" : "h-[30px] w-[30px]"}`}
            {...(isHome() || isScrolled
              ? { src: focalLogoI }
              : { src: focalLogoII })}
          />
          <div className="flex space-x-6 pl-10">
            <NavLink to="/">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Home"
              ></MenuItem>
            </NavLink>
            <NavLink to="/services">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Services"
              ></MenuItem>
            </NavLink>
            <NavLink to="/portfolio">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Portfolio"
              ></MenuItem>
            </NavLink>

            <NavLink to="/blogs">
              <MenuItem
                setActive={setActive}
                active={active}
                item="Blogs"
              ></MenuItem>
            </NavLink>

            <NavLink to="/about">
              <MenuItem
                setActive={setActive}
                active={active}
                item="About"
              ></MenuItem>
            </NavLink>

            <NavLink to="/faq">
              <MenuItem
                setActive={setActive}
                active={active}
                item="FAQs"
              ></MenuItem>
            </NavLink>

            <NavLink to="/start-quoting">
              <MenuItem
                setActive={setActive}
                active={active}
                item={isScrolled ? "Quoting" : "Start Quoting"}
              ></MenuItem>
            </NavLink>

            <ContactUsDialog>
              <MenuItem
                setActive={setActive}
                active={active}
                item="Contact"
              ></MenuItem>
            </ContactUsDialog>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-6">
          {user.email ? (
            <div className="flex items-center space-x-3">
              <span
                className={`font-secondary font-normal ${
                  !isHome() && !isScrolled
                    ? "font-semibold text-black"
                    : "text-white"
                }`}
              >
                Hi, {truncateName(user.firstName, 10)}{" "}
                {truncateName(user.lastName, 10)}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-1 text-white shadow-2xl"
              >
                <span className="relative font-secondary font-light">
                  Log Out
                </span>
              </button>
            </div>
          ) : (
            <>
              <LoginDialog
                isDialogOpen={isLoginDialogOpen}
                toggleSignUpDialog={toggleSignUpDialog}
                toggleDialog={toggleLoginDialog}
              >
                <Button
                  variant="secondary"
                  className="rounded-full bg-transparent"
                >
                  <h1
                    className={`font-secondary font-normal ${
                      !isHome() && !isScrolled
                        ? "font-semibold text-black"
                        : "text-white"
                    }`}
                  >
                    Login
                  </h1>
                </Button>
              </LoginDialog>

              <SignUpDialog
                isDialogOpen={isSignUpDialogOpen}
                toggleLoginDialog={toggleLoginDialog}
                toggleDialog={toggleSignUpDialog}
              >
                <button
                  className={`relative rounded-full border border-slate-600 px-8 py-2 text-sm transition duration-200 hover:shadow-2xl hover:shadow-white/[0.1] ${
                    !isHome() && !isScrolled
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-2xl" />
                  <span className="relative z-20 font-secondary font-light">
                    Sign Up
                  </span>
                </button>
              </SignUpDialog>
            </>
          )}
        </div>
      </Menu>
    </div>
  );
};

export default Navbar;
