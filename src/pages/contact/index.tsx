import { Heading } from '@chakra-ui/react';

import ContactForm from '@/components/contact/contact-form';
import Layout from '@/components/layout';

const ContactPage = () => {
  const title = 'お問い合わせ';
  return (
    <Layout meta={{ title: title, desc: 'お問い合わせです' }}>
      <Heading as="h1">{title}</Heading>

      <ContactForm />
    </Layout>
  );
};

export default ContactPage;
