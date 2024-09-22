"use client";
import { useState } from 'react';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { Drawer, Button, Menu, message, Modal } from 'antd';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Import Supabase client

const Navbar = ({ title = "Tableau de bord" }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Déconnexion',
      content: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      onOk: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          message.error('Erreur lors de la déconnexion');
        } else {
          message.success('Déconnexion réussie');
          // Optionally, redirect to login page or perform other actions
          window.location.href = '/admin/auth/login';
        }
      },
      onCancel() {
        // Optionally handle cancellation
      },
    });
  };

  return (
    <nav className="bg-primary-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">{ title }</div>
      <Button className="lg:hidden" icon={<MenuOutlined />} onClick={showDrawer}>
        Menu
      </Button>
      <Drawer title="Menu" placement="right" onClose={onClose} visible={visible}>
        <Menu mode="vertical">
          <Menu.Item key="1">
            <Link href="/admin/candidats">Candidats</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/admin/steps">Étapes</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/admin/reservations">Reservations</Link>
          </Menu.Item>
          <Menu.Item key="3" onClick={handleLogout}>
            Déconnexion
          </Menu.Item>
        </Menu>
      </Drawer>
      <div className="hidden items-center lg:flex space-x-4">
        <Link href="/admin/candidats" className="text-white">
          Candidats
        </Link>
        <Link href="/admin/steps" className="text-white">
          Étapes
        </Link>
        <Link href="/admin/reservations" className="text-white">
          Reservations
        </Link>
        <Button type='text' icon={<LogoutOutlined />} onClick={handleLogout} className="text-white">
          Déconnexion
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
