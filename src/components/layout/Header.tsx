'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { logoutUser, SafeUser } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import HeaderSearchBar from '@/components/layout/HeaderSearchBar';

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-purple-500 py-2">
      <div className="container mx-auto flex justify-center items-center px-8">
        <span className="text-center text-sm font-medium tracking-wide text-white">
          FREE SHIPPING ON ORDERS OVER $15.00 • FREE RETURNS
        </span>
      </div>
    </div>
  );
};

type HeaderProps = {
  user: SafeUser | null;
  categorySelector: React.ReactNode;
};

// We have to pass <HeaderCategorySelector /> as a prop instead of importing it since it's an async functional component
// (what we need is a sync component), we cannot import it directly in 'use client' context.
const Header = ({ user, categorySelector }: HeaderProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const prevScrollYRef = useRef<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollUp = prevScrollYRef.current > currentScrollY;
      if (scrollUp) {
        setIsOpen(true);
      } else if (currentScrollY > 100) {
        setIsOpen(false);
      }

      // setPrevScrollY(currentScrollY);
      prevScrollYRef.current = currentScrollY;
    };

    // setPrevScrollY(window.scrollY)

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={'w-full sticky top-0 z-50'}>
      <div
        className={`w-full transform transition-transform duration-300 ease-in-out 
                ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <AnnouncementBar />
        <div
          className={
            'w-full flex justify-between items-center py-3 sm:py-4 bg-white/80 shadow-sm border-b border-gray-100 backdrop-blur-sm'
          }
        >
          <div
            className={
              'flex justify-between items-center container mx-auto px-8'
            }
          >
            <div
              className={
                'flex flex-1 justify-start items-center gap-4 sm:gap-6'
              }
            >
              <button className={'text-gray-700 hover:text-gray-900 md:hidden'}>
                <svg
                  xmlns={'http://www.w3.org/2000/svg'}
                  className={'h-5 w-5 sm:h-6 sm:w-6'}
                  fill={'none'}
                  viewBox={'0 0 24 24'}
                  stroke={'currentColor'}
                >
                  <path
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    strokeWidth={2}
                    d={'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
              <nav
                className={'hidden md:flex gap-4 lg:gap-6 text-sm font-medium'}
              >
                {/*<Link href={'#'}>Shop</Link>*/}
                {/*<Link href={'#'}>New Arrivals</Link>*/}
                {/*<Link href={'#'}>Sale</Link>*/}
                {/* DO NOT use <HeaderCategorySelector />, use the prop instead */}
                {categorySelector}
              </nav>
            </div>
            <Link href={'#'} className={'absolute left-1/2 -translate-x-1/2'}>
              <span
                className={'text-xl sm:text-2xl font-bold tracking-tighter'}
              >
                DEAL
              </span>
            </Link>
            <div
              className={'flex flex-1 justify-end items-center gap-2 sm:gap-4'}
            >
              <HeaderSearchBar />
              {user ? (
                <div className={'flex items-center gap-2 sm:gap-4'}>
                  <span className={'text-sm text-gray-700 hidden md:block'}>
                    {user.email}
                  </span>
                  <Link
                    href={'#'}
                    className={
                      'text-xs sm:text-sm font-medium ' +
                      'text-gray-700  hover:text-gray-900'
                    }
                    onClick={async (e) => {
                      e.preventDefault();
                      await logoutUser(user.id);
                      router.refresh();
                    }}
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <React.Fragment>
                  <Link
                    href={'/auth/sign-in'}
                    className={
                      'text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900'
                    }
                  >
                    Sign In
                  </Link>
                  <Link
                    href={'/auth/sign-up'}
                    className={
                      'text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900'
                    }
                  >
                    Sign Up
                  </Link>
                </React.Fragment>
              )}
              <button
                className={
                  'text-gray-700 hover:text-gray-900 sm:block relative'
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span
                  className="absolute -top-1 -right-1 bg-black text-white text-[10px]
                                    sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center"
                >
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
