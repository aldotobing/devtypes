'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  // Default values for server-side rendering
  const translations = {
    allRightsReserved: 'All rights reserved',
    madeWith: 'Made with',
    by: 'by'
  };
  
  // Merge with translations if available
  const tMerged = { ...translations, ...(t || {}) };

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Copyright text - left-aligned on desktop, centered on mobile */}
          <p className="text-xs text-gray-500 text-center md:text-left">
            &copy; {currentYear} DevType • {tMerged.madeWith} ❤️ {tMerged.by} Aldo
          </p>
          
          {/* Social icons - right-aligned on desktop, centered on mobile */}
          <div className="flex items-center justify-center space-x-1">
            <a 
              href="https://github.com/aldotobing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/aldo_tobing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="Twitter"
              title="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
