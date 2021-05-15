import { Text } from "@chakra-ui/react";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import ContactForm from "../components/contact/contact-form";
import Layout from "../components/layout";

const Index = () => (
  <Layout title="Makrdown Gaming お問い合わせページ">
    <Hero title="お問い合わせページ" />
    <Main>
      <ContactForm />
    </Main>

    <DarkModeSwitch />
    <Footer>
      <Text>&copy; 2021 imaicu. Released unser MIT License</Text>
    </Footer>
    <CTA />
  </Layout>
);

export default Index;
