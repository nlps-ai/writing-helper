"use client";

import React from 'react';
import Link from 'next/link';
import ArticlePolisher from '../components/ArticlePolisher';

export default function PolishPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI 文章润色</h1>
          <p className="text-gray-600">提升文章质量，修正表达，使文章更专业流畅</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <ArticlePolisher />
          </div>
        </div>

        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>
            <Link href="/" className="text-blue-600 hover:underline">返回写作助手</Link> • 
            文章润色 • 
            <a href="/grok" className="text-blue-600 hover:underline">API 测试页面</a> • 
            使用先进的大型语言模型
          </p>
          
          <div className="mt-4 flex justify-center space-x-6">
            <a href="https://github.com/GeekyWizKid" target="_blank" rel="noopener noreferrer" 
              className="text-gray-700 hover:text-black transform hover:scale-110 transition-all duration-300 group">
              <div className="relative p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium">GitHub</span>
              </div>
            </a>
            <a href="https://x.com/named_Das" target="_blank" rel="noopener noreferrer" 
              className="text-gray-700 hover:text-[#1DA1F2] transform hover:scale-110 transition-all duration-300 group">
              <div className="relative p-2 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                </svg>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium">Twitter</span>
              </div>
            </a>
            <a href="mailto:dasvenxx@gmail.com" 
              className="text-gray-700 hover:text-[#EA4335] transform hover:scale-110 transition-all duration-300 group">
              <div className="relative p-2 rounded-full bg-gray-100 group-hover:bg-red-50 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                </svg>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-medium">Email</span>
              </div>
            </a>
          </div>
          
          <p className="mt-2 text-xs text-gray-500">© {new Date().getFullYear()} 写作助手 - 由 Cursor 强力驱动</p>
        </div>
      </div>
    </div>
  );
} 