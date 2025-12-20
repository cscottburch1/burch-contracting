import React from 'react';
import {
  Wrench, Home, Paintbrush, Square, TreePine, Hammer, Lightbulb,
  ShieldCheck, MessageSquare, Award, Clock, Phone, Mail, MapPin,
  Star, Facebook, Instagram, Twitter, Linkedin, Menu, X,
  ChevronDown, ChevronRight, Check, ArrowRight, ExternalLink,
  Calendar, User, ArrowLeft, FileText, DollarSign, Send,
  AlertCircle, LogOut, Eye, Trash2, Users, UserCheck, Receipt,
  Settings, Shield, Plus, LucideIcon
} from 'lucide-react';

const iconMap = {
  Wrench, Home, Paintbrush, Square, TreePine, Hammer, Lightbulb,
  ShieldCheck, MessageSquare, Award, Clock, Phone, Mail, MapPin,
  Star, Facebook, Instagram, Twitter, Linkedin, Menu, X,
  ChevronDown, ChevronRight, Check, ArrowRight, ExternalLink,
  Calendar, User, ArrowLeft, FileText, DollarSign, Send,
  AlertCircle, LogOut, Eye, Trash2, Users, UserCheck, Receipt,
  Settings, Shield, Plus
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 24 }) => {
  const IconComponent = iconMap[name] as LucideIcon;
  return <IconComponent size={size} className={className} />;
};
