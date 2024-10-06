import { create } from 'zustand';
import { TUserBase } from '@/types/users';

export interface Notification {
  id: number;
  type: 'invitation' | 'message' | 'like';
  content: string;
  from: TUserBase;
  onAction?: (id: number, action: 'accept' | 'reject') => void;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () =>
    set(() => ({
      notifications: [],
    })),
}));

export default useNotificationStore;
