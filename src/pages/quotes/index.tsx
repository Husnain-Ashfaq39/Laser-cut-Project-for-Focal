import FooterAdmin from "@/components/footer/fouter-admin"
import NavbarAdmin from "@/components/nav/navbar-admin"
import { Outlet } from "react-router-dom"

const QuotesPage = () => {
  return (
    <div className="w-full bg-slate-100">
        <NavbarAdmin />
        <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
          <Outlet />
        </main>
        <FooterAdmin />
      </div>
  )
}

export default QuotesPage
