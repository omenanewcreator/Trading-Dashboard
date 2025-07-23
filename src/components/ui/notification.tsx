import React from 'react';
import { ScrollArea } from './scroll-area';

const NotificationList = () => {
  return (
    <ScrollArea className="max-h-[calc(100vh-4rem)] p-4 space-y-3 text-sm sm:text-base leading-relaxed">
      {/* Notification items here with smaller font and spacing */}
    </ScrollArea>
  );
};

export default NotificationList;