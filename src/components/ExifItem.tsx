import React, { FC } from 'react';
import { Icon } from "@iconify/react";

interface ExifItemProps {
  icon: string;
  value: React.ReactNode;
  className?: string;
}

const ExifItem: FC<ExifItemProps> = ({ icon, value, className = '' }) => {
  return (
    <div className={`flex flex-row gap-1 align-middle ${className}`}>
      <Icon icon={icon} className='my-auto' />
      {value}
    </div>
  );
};

export default ExifItem;