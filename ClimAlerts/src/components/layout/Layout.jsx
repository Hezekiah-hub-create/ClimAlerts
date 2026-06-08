import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  const { pathname } = useLocation();
  const isMapPage = pathname.startsWith('/risk-map');

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className={isMapPage ? 'content-scroll--map' : 'content-scroll'}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
