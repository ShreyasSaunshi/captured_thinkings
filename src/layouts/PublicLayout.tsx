import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Navigation/Header';
import Footer from '../components/Navigation/Footer';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;