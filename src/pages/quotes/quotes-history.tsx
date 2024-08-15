import Button from "@/components/quotes/quote-history/create-quote-button";
import DataList from "@/components/quotes/quote-history/DataList";
import FooterAdmin from "@/components/footer/fouter-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";

const QuoteHistory = () => {
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
