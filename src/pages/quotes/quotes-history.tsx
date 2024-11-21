/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/quotes/quote-history/create-quote-button";
import DataList from "@/components/quotes/quote-history/DataList";
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { clearparts } from "@/redux/slices/quote-parts-slice";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "@/services/auth";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { clearUser } from "@/redux/slices/auth-slice";
import PreLoader from "@/components/pre-loader";  // Import your PreLoader component

const QuoteHistory = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const auth = getAuth();

  // Local state for loading
  const [loading, setLoading] = useState(true);

  // Run clearparts when the component is mounted
  useEffect(() => {
    dispatch(clearparts());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (!user.emailVerified) {
          dispatch(clearUser());
          setLoading(false);
          return;
        }
        await fetchUserData(user, dispatch);
        setLoading(false);
      } else {
        dispatch(clearUser());
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, [auth, dispatch]);
  
  // Second useEffect for navigation based on currentUser
  useEffect(() => {
    if (!loading && currentUser) {
      if (currentUser.contactID === "") {
        navigate('/set-company');
      }
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return <PreLoader />;  // Show PreLoader while loading
  }

  return (
    <>
      <div className="w-full bg-slate-100">
        <NavbarAdmin />
        <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
          <div className="flex w-full justify-between">
            <h1 className="font-primary text-3xl">History</h1>
            <Button />
          </div>
          <DataList Columns="history" />
        </main>
        <FooterAdmin />
      </div>
    </>
  );
};

export default QuoteHistory;
