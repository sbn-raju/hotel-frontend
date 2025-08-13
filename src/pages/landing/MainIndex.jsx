import React, {useState, useEffect} from 'react'
import LuxuryHeroHeader from './Header'
import PropertiesSection from './Properties';
import GallerySection from './Gallery';
import TestimonialsSection from './Testimonials';
import FAQSection from './Faqs';
import FooterSection from './Footer';
import HeroSection from './Header';
import RoomsSection from './Properties';
import WhyChooseUsSection from './WhyUs';
import GuestReviewsSection from './Testimonials';
import StickyHeader from './StickyHeader';
import Gallery from './Gallery';
import NearbyAttractions from './NearByAttractions';
import FAQ from './Faqs';
import Contact from './Contact';
import Footer from './Footer';
import { 
  Wifi, 
  Snowflake, 
  Tv, 
  Coffee, 
  Car, 
  Utensils, 
  Bath, 
  Bed, 
  Users, 
  Star,
  ArrowRight
} from 'lucide-react';
import { BASE_URI } from '../../utils/BaseUrl.utils';

const MainIndex = () => {
  const [room, setRoom] = useState();
  

  //Getting the rooms data the page reloads.
  const fetchRooms = async()=>{
    try {
      const response = await fetch(`${BASE_URI}/room/fetch`, {
        method: "GET",
        headers:{
          'Content-Type' : 'application/json'
        }
      });
      if(response.ok){
        const data = await response.json();
        setRoom(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }


  //Useffect.
  useEffect(() => {
    fetchRooms();
  }, [])
  

  return (
    <>
       {/* <LuxuryHeroHeader/> */}
       <StickyHeader/>
       <HeroSection/>
       <RoomsSection rooms={room}/>
       <WhyChooseUsSection/>
       {/* <GallerySection/> */}
       <GuestReviewsSection/>
       <NearbyAttractions/>
       {/* <Gallery/> */}
       <FAQ/>
       {/* <Contact/> */}
       <Footer/>
    </>
  )
}

export default MainIndex