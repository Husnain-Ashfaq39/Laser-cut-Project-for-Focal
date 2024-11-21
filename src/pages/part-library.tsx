import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import DataList from "@/components/quotes/quote-history/DataList";

function PartLibrary() {
  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
        <h1 className="text-center font-primary text-3xl">Part Library</h1>
        <DataList Columns="part" />
      </main>
      <FooterAdmin />
    </div>
  );
}

export default PartLibrary;
