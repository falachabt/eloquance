"use client"
import React from 'react';
import { Layout, Menu, Button, Carousel, Steps, Card, Row, Col, Typography } from 'antd';
import { motion } from 'framer-motion';
import { TeamOutlined, TrophyOutlined, SmileOutlined } from '@ant-design/icons';
import { HeroSection } from "./HeroSection" 
import { FeaturesSection } from "./Features"
import { OurTeams } from "./OurTeams"
import { OldSessions  } from "./OldSections"
import { Footer } from "./Footer"
import Header from './Header';
import Cta from './Cta';

const {  Content } = Layout;
const { Title, Paragraph } = Typography;

const steps = [
  { title: 'Inscription', description: 'Inscrivez-vous au concours et remplissez votre profil.', icon: <TeamOutlined /> },
  { title: 'Participation', description: 'Soumettez votre discours vidéo avant la date limite.', icon: <SmileOutlined /> },
  { title: 'Vote et Résultats', description: 'Attendez les votes et découvrez si vous êtes gagnant !', icon: <TrophyOutlined /> },
];

const testimonials = [
  { quote: "Un concours incroyable qui m'a permis de m'exprimer librement !", author: "Marie" },
  { quote: "Une expérience inoubliable, avec des participants talentueux.", author: "Paul" },
  { quote: "J'ai développé ma confiance en moi grâce à ce concours.", author: "Alice" }
];


const ContestDetails = () => (
  <section id="contest-details" style={{ padding: '3rem 0', backgroundColor: '#f9f9f9' }}>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>Comment ça marche ?</Title>
      <Row justify="center">
        <Steps direction="vertical">
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }}>
              <Steps.Step title={step.title} description={step.description} icon={step.icon} />
            </motion.div>
          ))}
        </Steps>
      </Row>
    </motion.div>
  </section>
);

const Testimonials = () => (
  <section id="testimonials" style={{ padding: '3rem 0' }}>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>Ce que disent les participants</Title>
      <Carousel autoplay>
        {testimonials.map((testimonial, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Card>
              <p>{testimonial.quote}</p>
              <p><strong>{testimonial.author}</strong></p>
            </Card>
          </motion.div>
        ))}
      </Carousel>
    </motion.div>
  </section>
);

const Page = () => (
  <Layout>
    <Header/> 

    <Content >
      <HeroSection />
       <FeaturesSection /> 
        <Cta /> 

         <OldSessions /> 

          <Footer/> 


      {/* <ContestDetails />

      <Testimonials /> */}
    </Content>

  </Layout>
);

export default Page;
