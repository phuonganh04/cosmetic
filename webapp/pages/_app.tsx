import { AppProps } from "next/app";
import { CartProvider } from "react-use-cart";
import { AuthProvider } from '../components/authentication/context';
import '../styles/globals.css';
import '../styles/variables.less';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: Roboto Slab;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </CartProvider>
  )
}

export default MyApp
