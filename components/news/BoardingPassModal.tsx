'use client';

import { X } from 'lucide-react';

interface BoardingPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsTitle?: string;
  economicIndex?: string;
}

export default function BoardingPassModal({
  isOpen,
  onClose,
  newsTitle = "Global Market Rally",
  economicIndex = "NASDAQ 100"
}: BoardingPassModalProps) {
  if (!isOpen) return null;

  // Generate random seat
  const generateRandomSeat = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    return `${number}${letter}`;
  };

  const seat = generateRandomSeat();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl drop-shadow-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Header Strip */}
        <div className="w-full bg-sky-200 px-6 py-3 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-800">NEWS AIR</div>
          <div className="text-sm font-semibold text-gray-600 tracking-wider">PRESTIGE</div>
        </div>

        {/* Main Ticket Content */}
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left Section (70%) */}
          <div className="flex-1 p-8 space-y-6">
            {/* Passenger Name */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PASSENGER NAME</div>
              <div className="text-2xl font-bold font-mono text-gray-900">PREMIUM MEMBER</div>
            </div>

            {/* From/To */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">FROM</div>
                <div className="text-xl font-bold font-mono text-gray-900">SEOUL / ICN</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TO</div>
                <div className="text-xl font-bold font-mono text-gray-900 truncate" title={newsTitle}>
                  {newsTitle}
                </div>
              </div>
            </div>

            {/* Flight & Date */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">FLIGHT</div>
                <div className="text-3xl font-bold font-space-mono text-gray-900 border-2 border-black rounded-full px-4 py-2 inline-block">
                  {economicIndex}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DATE</div>
                <div className="text-xl font-bold font-mono text-gray-900">{today}</div>
              </div>
            </div>

            {/* Gate & Seat */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GATE</div>
                <div className="text-2xl font-bold font-space-mono text-gray-900 border-2 border-black rounded-full px-4 py-2 inline-block">
                  A12
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEAT</div>
                <div className="text-2xl font-bold font-space-mono text-gray-900 border-2 border-black rounded-full px-4 py-2 inline-block">
                  {seat}
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Separator (Dashed Line with Cutouts) */}
          <div className="hidden md:flex flex-col items-center justify-center relative">
            <div className="w-px bg-gray-300 h-full border-dashed border-l-2 border-gray-400"></div>
            {/* Top Cutout */}
            <div className="absolute top-0 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
            {/* Bottom Cutout */}
            <div className="absolute bottom-0 translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
          </div>

          {/* Right Section (30%) - Stub */}
          <div className="md:w-1/3 p-6 flex flex-col justify-between items-center bg-gray-50 min-h-[300px]">
            {/* Barcode Placeholder */}
            <div className="flex-1 flex items-center justify-center w-full">
              <div className="w-32 h-20 bg-black flex flex-col justify-between p-1">
                {/* Simple barcode pattern */}
                <div className="flex justify-between h-full">
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                  <div className="w-0.5 bg-white"></div>
                  <div className="w-1 bg-white"></div>
                </div>
              </div>
            </div>

            {/* Flight Number at bottom */}
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">FLIGHT</div>
              <div className="text-lg font-bold font-mono text-gray-900">{economicIndex}</div>
            </div>
          </div>
        </div>

        {/* Mobile Separator (when stacked) */}
        <div className="md:hidden w-full h-px bg-gray-300 border-dashed border-t-2 border-gray-400 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
        </div>

        {/* Footer Note */}
        <div className="px-8 py-4 bg-gray-100 text-center">
          <div className="text-xs text-gray-600">
            This boarding pass is valid for News In Flight premium access
          </div>
        </div>
      </div>
    </div>
  );
}