"use client"
import { ReactNode } from 'react';
import { Permission } from '@/lib/types/permissions';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGuardProps) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};