'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { businessConfig } from '@/config/business';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  budgetRange: string;
  timeframe: string;
  referralSource: string;
  description: string;
}

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '', phone: '', email: '', address: '', serviceType: '',
    budgetRange: '', timeframe: '', referralSource: '', description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto redirect after 5 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => router.push('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone))
      newErrors.phone = 'Valid phone required';
    if (!formData.email
