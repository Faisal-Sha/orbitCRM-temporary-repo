import { useEffect, useRef } from 'react';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';

interface NavigationBlockerOptions {
  when: boolean;
  onBlock: (nextLocation: string) => void;
}

export const useNavigationBlocker = ({ when, onBlock }: NavigationBlockerOptions) => {
  const navigate = useNavigate();
  const location = useLocation();
  const originalNavigate = useRef<NavigateFunction>(navigate);
  const isBlocking = useRef(false);

  useEffect(() => {
    if (!when) return;

    // Store original navigate function
    originalNavigate.current = navigate;

    // Override history methods to catch programmatic navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(state, title, url) {
      if (when) {
        const targetPath = typeof url === 'string' ? url : url?.toString() || '';
        if (location.pathname === '/profile' && !targetPath.includes('/profile')) {
          onBlock(targetPath);
          return;
        }
      }
      originalPushState.call(this, state, title, url);
    };

    window.history.replaceState = function(state, title, url) {
      if (when) {
        const targetPath = typeof url === 'string' ? url : url?.toString() || '';
        if (location.pathname === '/profile' && !targetPath.includes('/profile')) {
          onBlock(targetPath);
          return;
        }
      }
      originalReplaceState.call(this, state, title, url);
    };

    // Handle back/forward button navigation
    const handlePopState = (e: PopStateEvent) => {
      if (when && location.pathname === '/profile') {
        e.preventDefault();
        window.history.pushState(null, '', location.pathname);
        onBlock(window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [when, location.pathname, navigate, onBlock]);

  const allowNavigation = (path: string) => {
    isBlocking.current = true;
    originalNavigate.current(path);
    setTimeout(() => {
      isBlocking.current = false;
    }, 100);
  };

  return { allowNavigation };
};