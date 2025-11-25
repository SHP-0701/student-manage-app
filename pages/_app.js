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
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}
