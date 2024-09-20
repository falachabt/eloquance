"use client";
import React from 'react';
import { Layout, Steps, Row, Typography } from 'antd'; // Supprimé Menu, Button, Col
import { motion } from 'framer-motion';
import { TeamOutlined, TrophyOutlined, SmileOutlined } from '@ant-design/icons';
import { HeroSection } from "./HeroSection"; 
import { FeaturesSection } from "./Features";
import { OldSessions } from "./OldSections"; 
import { Footer } from "./Footer";
import Header from './Header';
import Cta from './Cta';
import { EligibilitySection } from "./WhoCanParticipate";
import { WhyParticipate } from "./WhyParticipate";

const { Content } = Layout;
const { Title } = Typography; // Supprimé Paragraph

const steps = [
  { title: 'Inscription', description: 'Inscrivez-vous au concours et remplissez votre profil.', icon: <TeamOutlined /> },
  { title: 'Participation', description: 'Soumettez votre discours vidéo avant la date limite.', icon: <SmileOutlined /> },
  { title: 'Vote et Résultats', description: 'Attendez les votes et découvrez si vous êtes gagnant !', icon: <TrophyOutlined /> },
];

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
