"use client";
import React, { ReactNode } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

type Props = {
  data: Array<{
    category: string;
    title: string;
    src: string;
    content: ReactNode;
  }>;
  title: string;
}

const CardCarousel = ({ data, title }: Props) => {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} layout={true} />
    ));
     
    return (
        <div className="w-full h-full py-20">
          <h2 className="max-w-7xl pl-4 mx-auto text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
            {title}
          </h2>
          <Carousel items={cards} />
        </div>
    );
}

export default CardCarousel