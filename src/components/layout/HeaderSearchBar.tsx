import React from 'react';
import Form from 'next/form';

function HeaderSearchBar() {
  return (
    <Form action={'/search'}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w- h-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          className="w-32 pl-8 pr-2 py-1 text-sm border border-gray-200
                 rounded-md focus:ring-1 focus:ring-black focus:border-transparent transition-colors"
          type="text"
          placeholder="Search"
          name="query"
        />
      </div>
    </Form>
  );
}

export default HeaderSearchBar;
