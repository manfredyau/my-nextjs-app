"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SalesCampaignBanner = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-gradient-to-r from-purple-500 via-blue-600 to-green-500 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold animate-bounce">
              🔥
            </span>
          </div>
          <div className="text-sm sm:text-base font-bold">
            FLASH SALE ENDS IN:
          </div>
          <div className="bg-white/20 rounded px-2 py-1 font-bold font-mono">
            23:59:59
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold animate-pulse">⚡</span>
            <span className="text-white font-bold">UP TO 95% OFF</span>
          </div>
          <button
            className="bg-white text-red-500 px-4 py-1 rounded-full font-bold text-sm hover:bg-yellow-100 shadow-lg"
            onClick={() => {
              router.push("/");
            }}
          >
            SHOP NOW!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesCampaignBanner;
