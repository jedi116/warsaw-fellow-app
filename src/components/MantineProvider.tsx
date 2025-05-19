'use client';

import { 
  MantineProvider as BaseMantineProvider, 
  createTheme, 
  ColorSchemeScript,
  ColorScheme
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { getCookie, setCookie, hasCookie, deleteCookie } from 'cookies-next';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

// Create the theme
const theme = createTheme({
  primaryColor: 'indigo',
  colors: {
    indigo: [
      '#EDF2FF', // 0
      '#DBE4FF', // 1
      '#BAC8FF', // 2
      '#91A7FF', // 3
      '#748FFC', // 4
      '#5C7CFA', // 5
      '#4C6EF5', // 6
      '#4263EB', // 7
      '#3B5BDB', // 8
      '#364FC7', // 9
    ],
    dark: [
      '#C1C2C5', // 0: text
      '#A6A7AB', // 1: dimmed text
      '#909296', // 2: more dimmed
      '#5C5F66', // 3: icons
      '#373A40', // 4: borders
      '#2C2E33', // 5: buttons/ui backgrounds
      '#25262B', // 6: input backgrounds
      '#1A1B1E', // 7: page background
      '#141517', // 8: darker elements
      '#101113', // 9: darkest elements
    ],
    gray: [
      '#F8F9FA', // 0
      '#F1F3F5', // 1
      '#E9ECEF', // 2
      '#DEE2E6', // 3
      '#CED4DA', // 4
      '#ADB5BD', // 5
      '#868E96', // 6
      '#495057', // 7
      '#343A40', // 8
      '#212529', // 9
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      }
    },
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
      },
    },
    Container: {
      defaultProps: {
        size: 'lg',
      },
    },
  },
  other: {
    transition: {
      default: 'all 200ms ease',
      slow: 'all 500ms ease',
    },
  },
});

// Cookie consent state
interface CookieConsent {
  analytics: boolean;
  preferences: boolean;
}

// MantineProvider with client-side init to avoid hydration issues
export function MantineProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a state that matches what will be rendered on the server
  const [mounted, setMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [cookieConsentShown, setCookieConsentShown] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsent | null>(null);
  
  // Initial effect for syncronizing with cookies and setting document attribute
  useEffect(() => {
    // Set the initial theme on document immediately to avoid flashing
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mantine-color-scheme', colorScheme);
    }
    
    // Now check for cookies after initial render is complete
    const hasConsent = hasCookie('cookieConsent');
    if (hasConsent) {
      const consentData = getCookie('cookieConsent');
      try {
        const parsedConsent = JSON.parse(consentData as string) as CookieConsent;
        setCookieConsent(parsedConsent);
        
        // Only load theme from cookie if user consented to preferences cookies
        if (parsedConsent.preferences) {
          const savedTheme = getCookie('theme') as ColorScheme | undefined;
          if (savedTheme) {
            setColorScheme(savedTheme);
            if (typeof document !== 'undefined') {
              document.documentElement.setAttribute('data-mantine-color-scheme', savedTheme);
            }
          }
        }
      } catch (e) {
        console.error('Error parsing cookie consent data', e);
      }
    } else {
      // Show consent modal if not shown before
      setCookieConsentShown(true);
    }
    
    // Mark as mounted after everything is set up
    setMounted(true);
  }, []);

  // Function to handle theme toggle
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newColorScheme);
    
    // Apply the theme change directly to document attributes for immediate visual update
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mantine-color-scheme', newColorScheme);
    }
    
    // Save theme in cookies if user has consented to preferences cookies
    if (cookieConsent?.preferences) {
      setCookie('theme', newColorScheme, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    }
    
    // No need for debug logging in production
  };

  // Function to handle cookie consent
  const handleCookieConsent = (consent: CookieConsent) => {
    setCookieConsent(consent);
    setCookie('cookieConsent', JSON.stringify(consent), { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    setCookieConsentShown(false);
    
    // If user consented to preferences cookies, save current theme
    if (consent.preferences) {
      setCookie('theme', colorScheme, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    } else {
      // If user did not consent to preferences cookies, delete theme cookie
      deleteCookie('theme');
    }
  };

  // Set initial color scheme attribute on document
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mantine-color-scheme', colorScheme);
    }
  }, [mounted, colorScheme]);

  return (
    <BaseMantineProvider
      theme={{
        ...theme,
        colorScheme
      }}
      defaultColorScheme="light"
    >
      <ModalsProvider>
        <Notifications />
        {mounted && cookieConsentShown && (
          <CookieConsentBanner onConsent={handleCookieConsent} />
        )}
        <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
          {children}
        </ColorSchemeContext.Provider>
      </ModalsProvider>
    </BaseMantineProvider>
  );
}

// Create a separate component for the color scheme script
export function MantineColorSchemeScript() {
  return <ColorSchemeScript defaultColorScheme="light" />;
}

// Create a context for color scheme management
interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: (value?: ColorScheme) => void;
}

import React from 'react';

export const ColorSchemeContext = React.createContext<ColorSchemeContextType>({
  colorScheme: 'dark',
  toggleColorScheme: () => {},
});

// Hook to use color scheme
export const useColorScheme = () => React.useContext(ColorSchemeContext);

// Cookie consent banner component
interface CookieConsentBannerProps {
  onConsent: (consent: CookieConsent) => void;
}

function CookieConsentBanner({ onConsent }: CookieConsentBannerProps) {
  const [showDetails, setShowDetails] = useState(false);
  // Get current color scheme to style the banner accordingly
  const { colorScheme } = useColorScheme();
  
  // Define colors based on the current theme
  const colors = {
    background: colorScheme === 'dark' ? 'rgba(26, 27, 30, 0.95)' : 'rgba(248, 249, 250, 0.95)',
    text: colorScheme === 'dark' ? '#C1C2C5' : '#343a40',
    border: colorScheme === 'dark' ? '#373A40' : '#ced4da',
    buttonBorder: colorScheme === 'dark' ? '#5C5F66' : '#ced4da',
    dimmedText: colorScheme === 'dark' ? '#A6A7AB' : '#6c757d'
  };
  
  const handleAcceptAll = () => {
    onConsent({
      analytics: true,
      preferences: true
    });
  };
  
  const handleRejectAll = () => {
    onConsent({
      analytics: false,
      preferences: false
    });
  };
  
  const handleCustomize = () => {
    setShowDetails(true);
  };
  
  const handleSavePreferences = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onConsent({
      analytics: formData.get('analytics') === 'on',
      preferences: formData.get('preferences') === 'on'
    });
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '1rem',
      backgroundColor: colors.background,
      boxShadow: colorScheme === 'dark' ? '0 -4px 12px rgba(0, 0, 0, 0.15)' : '0 -4px 12px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
      borderTop: `1px solid ${colors.border}`,
      color: colors.text
    }}>
      {!showDetails ? (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>Cookie Consent</h3>
            <p>
              We use cookies to enhance your browsing experience, personalize content, and analyze our traffic. 
              This includes cookies for site preferences and analytics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              onClick={handleRejectAll}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: `1px solid ${colors.buttonBorder}`,
                borderRadius: '4px',
                cursor: 'pointer',
                color: colors.text
              }}
            >
              Reject All
            </button>
            <button
              onClick={handleCustomize}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: `1px solid ${colors.buttonBorder}`,
                borderRadius: '4px',
                cursor: 'pointer',
                color: colors.text
              }}
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              style={{
                padding: '0.5rem 1rem',
                background: '#4C6EF5',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSavePreferences}>
          <h3 style={{ marginTop: 0 }}>Cookie Preferences</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="preferences" 
                name="preferences" 
                defaultChecked 
                style={{ marginRight: '0.5rem', marginTop: '0.25rem' }} 
              />
              <div>
                <label htmlFor="preferences" style={{ fontWeight: 'bold', display: 'block' }}>Preferences</label>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: colors.dimmedText }}>
                  Allows the site to remember your theme preference and other settings.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <input 
                type="checkbox" 
                id="analytics" 
                name="analytics" 
                defaultChecked 
                style={{ marginRight: '0.5rem', marginTop: '0.25rem' }} 
              />
              <div>
                <label htmlFor="analytics" style={{ fontWeight: 'bold', display: 'block' }}>Analytics</label>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: colors.dimmedText }}>
                  Helps us understand how visitors interact with our website.
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowDetails(false)}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: `1px solid ${colors.buttonBorder}`,
                borderRadius: '4px',
                cursor: 'pointer',
                color: colors.text
              }}
            >
              Back
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                background: '#4C6EF5',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Save Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
}