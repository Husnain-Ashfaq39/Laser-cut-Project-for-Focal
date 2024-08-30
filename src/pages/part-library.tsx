
import FooterAdmin from '@/components/footer/fouter-admin'
import NavbarAdmin from '@/components/nav/navbar-admin'
import DataList from '@/components/quotes/quote-history/DataList'

import React from 'react'

function PartLibrary() {
  return (
    <div className="w-full bg-slate-100">
    <NavbarAdmin />
    <DataList Columns="part"/>
    <FooterAdmin />
  </div>
  )
}

export default PartLibrary