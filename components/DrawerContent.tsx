import React from 'react';
import { useSelector } from 'react-redux';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import MenuPage from '../pages/MenuPage';
import { RootState } from '../store/store';

const DrawerContent: React.FC<DrawerContentComponentProps> = React.memo((props) => {
  const { profile } = useSelector((state: RootState) => state.user);

  return (
    <MenuPage 
      {...props} 
      userName={profile?.userDetail?.name?.trim() || 'User'}
      userEmail={profile?.email?.trim() || 'user@example.com'}
      profileImage={profile?.userDetail?.profile}
    />
  );
});

export default DrawerContent;