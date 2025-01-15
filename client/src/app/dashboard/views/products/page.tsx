import Hero from '@/app/home/components/Hero';
import React from 'react'
import AppHeader from '../../components/Header/app-header';


const ProductsPage = () => {
  return (
    <>
    <AppHeader breadcrumbLink='/dashboard' breadcrumbLinkText='Dashboard' breadcrumbPage='Products' />
    <Hero />
    </>
  )
}

export default ProductsPage;