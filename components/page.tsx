"use client";
import React from 'react';
import { Layout } from 'antd'; // Supprimé Menu, Button, Col
import { HeroSection } from "./HeroSection"; 
import { FeaturesSection } from "./Features";
import { OldSessions } from "./OldSections"; 
import { Footer } from "./Footer";
import Header from './Header';
import Cta from './Cta';
import { EligibilitySection } from "./WhoCanParticipate";
import { WhyParticipate } from "./WhyParticipate";

const { Content } = Layout;



const Page = () => (
  <Layout>
    <Header/> 

    <Content>
      <HeroSection />
      <FeaturesSection /> 
      <Cta /> 
      <EligibilitySection/> 
      <WhyParticipate/> 
      <OldSessions /> 
      <Footer/> 
    </Content>
  </Layout>
);

export default Page;
