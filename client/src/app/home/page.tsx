import React from "react";
import Hero from "@/app/home/components/Hero";
import Navbar from "@/components/navbar/Navbar";
import DummyContent from "@/components/card-carousel/DummyContent";
import CardCarousel from "@/components/card-carousel/CardCarousel";
import Services from "./components/Services";

const carouselData = [
  {
    category: "Efficiency",
    title: "You can do more with Tatsulok.",
    src: "https://images.unsplash.com/photo-1664382950442-0748f82f2752?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Control",
    title: "Gain complete control over your inventory." ,
    src: "https://images.unsplash.com/photo-1518112390430-f4ab02e9c2c8?q=80&w=3281&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Visibility",
    title: "Get real-time visibility into your entire inventory.",
    src: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Growth",
    title: "Scale your business with a robust inventory system.",
    src: "https://images.unsplash.com/photo-1664382953403-fc1ac77073a0?q=80&w=3272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Profitability",
    title: "Increase profitability by optimizing your inventory." ,
    src: "https://images.unsplash.com/photo-1715635846531-9ce412920602?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Accuracy",
    title: "Eliminate inventory errors." ,
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <CardCarousel data={carouselData} title="Inventory made easy" />
      <Services />
    </>
  );
};

export default Home;
