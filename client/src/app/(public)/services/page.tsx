import React from 'react'
import { AuroraBackgroundDemo } from './components/Hero'
import Services from '@/components/services/Services'
import { MarqueeDemo } from '@/components/marquee/Marquee'
import Faq from '@/components/faq/Faq'

const ServicesPage = () => {
  return (
      <div>
        <AuroraBackgroundDemo />
        <Services />
        <MarqueeDemo />
        <Faq />
      </div>
  )
}

export default ServicesPage