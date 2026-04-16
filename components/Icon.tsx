"use client";

import React from "react";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  weight?: number;
}

export function Icon({ name, className = "", filled = false, weight }: IconProps) {
  const style: React.CSSProperties = {};
  
  if (filled) {
    style.fontVariationSettings = "'FILL' 1";
  }
  
  if (weight !== undefined) {
    const existingSettings = style.fontVariationSettings || "";
    style.fontVariationSettings = `${existingSettings ? existingSettings + ", " : ""}'wght' ${weight}`;
  }

  return (
    <span 
      className={`material-symbols-outlined ${className}`}
      style={style}
    >
      {name}
    </span>
  );
}

// Navigation icons
export const DashboardIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  <Icon name="dashboard" className={className} filled={filled} />
);

export const CarIcon = ({ className }: { className?: string }) => (
  <Icon name="directions_car" className={className} />
);

export const PaymentsIcon = ({ className }: { className?: string }) => (
  <Icon name="payments" className={className} />
);

export const CalendarIcon = ({ className }: { className?: string }) => (
  <Icon name="calendar_today" className={className} />
);

export const SettingsIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  <Icon name="settings" className={className} filled={filled} />
);

// Action icons
export const PlusIcon = ({ className }: { className?: string }) => (
  <Icon name="add" className={className} />
);

export const ArrowBackIcon = ({ className }: { className?: string }) => (
  <Icon name="arrow_back" className={className} />
);

export const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <Icon name="arrow_back" className={className} />
);

export const EditIcon = ({ className }: { className?: string }) => (
  <Icon name="edit" className={className} />
);

export const DeleteIcon = ({ className }: { className?: string }) => (
  <Icon name="delete" className={className} />
);

export const TrashIcon = ({ className }: { className?: string }) => (
  <Icon name="delete" className={className} />
);

export const SaveIcon = ({ className }: { className?: string }) => (
  <Icon name="save" className={className} />
);

export const CloseIcon = ({ className }: { className?: string }) => (
  <Icon name="close" className={className} />
);

// Status icons
export const WarningIcon = ({ className }: { className?: string }) => (
  <Icon name="warning" className={className} />
);

export const ErrorIcon = ({ className }: { className?: string }) => (
  <Icon name="error" className={className} />
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <Icon name="check_circle" className={className} />
);

export const InfoIcon = ({ className }: { className?: string }) => (
  <Icon name="info" className={className} />
);

export const BuildIcon = ({ className }: { className?: string }) => (
  <Icon name="build" className={className} />
);

export const WrenchIcon = ({ className }: { className?: string }) => (
  <Icon name="build" className={className} />
);

// Vehicle icons
export const SpeedIcon = ({ className }: { className?: string }) => (
  <Icon name="speed" className={className} />
);

export const GaugeIcon = ({ className }: { className?: string }) => (
  <Icon name="speed" className={className} />
);

export const ShieldIcon = ({ className }: { className?: string }) => (
  <Icon name="shield" className={className} />
);

export const EventIcon = ({ className }: { className?: string }) => (
  <Icon name="event" className={className} />
);

// Part icons
export const InventoryIcon = ({ className }: { className?: string }) => (
  <Icon name="inventory_2" className={className} />
);

export const PackageIcon = ({ className }: { className?: string }) => (
  <Icon name="inventory_2" className={className} />
);

// Analysis icons
export const ActivityIcon = ({ className }: { className?: string }) => (
  <Icon name="trending_up" className={className} />
);

export const LocalShippingIcon = ({ className }: { className?: string }) => (
  <Icon name="local_shipping" className={className} />
);

// Globe icon
export const GlobeIcon = ({ className }: { className?: string }) => (
  <Icon name="public" className={className} />
);
