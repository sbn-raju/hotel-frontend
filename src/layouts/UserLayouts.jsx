import React from 'react';
import LuxuryHeroHeaderUser from '../components/headers/UserHeader';

const UserLayouts = ({ children }) => {
  return (
    <>
      {/* Fixed header */}
      <LuxuryHeroHeaderUser />

      {/* Spacer to offset the fixed header */}
      <div className="pt-[80px] md:pt-[80px]">
        {children}
      </div>
    </>
  );
};

export default UserLayouts;
