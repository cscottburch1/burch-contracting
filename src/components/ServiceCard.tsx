import React from 'react';
import { Card } from './ui/Card';
import { Icon, IconName } from './ui/Icon';
import { Button } from './ui/Button';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: IconName;
  tasks?: string[];
  href?: string;
  compact?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, tasks, href, compact = false }) => {
  return (
    <Card hover={!!href} className="h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name={icon} className="text-blue-600" size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      {href && (
        <Button variant="outline" size="sm" href={href} className="mt-auto">
          Learn More
          <Icon name="ArrowRight" size={16} />
        </Button>
      )}
    </Card>
  );
};
