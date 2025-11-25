import '@/styles/globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker-custom.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />;
      <Toaster
        position='bottom-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2d2d2d',
            color: '#fff',
            borderRadius: '8px',
            padding: '14px 20px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
          success: {
            style: {
              background: '#1e3a5f',
            },
            iconTheme: {
              primary: '#60a5fa',
              secondary: '#1e3a5f',
            },
          },
          error: {
            style: {
              background: '#4a1e1e',
            },
            iconTheme: {
              primary: '#f87171',
              secondary: '#4a1e1e',
            },
          },
        }}
      />
    </>
  );
}
