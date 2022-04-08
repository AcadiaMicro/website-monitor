import "../styles/globals.css";
import Head from "next/head";
import Honeybadger from "@honeybadger-io/js";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const HONEYBADGER_API_KEY = process.env.HONEYBADGER_API_KEY;
const HONEYBADGER_ENV = process.env.HONEYBADGER_ENV;
const HONEYBADGER_REVISION = process.env.HONEYBADGER_REVISION;

if (HONEYBADGER_API_KEY) {
  Honeybadger.configure({
    apiKey: HONEYBADGER_API_KEY,
    environment: HONEYBADGER_ENV,
    revision: HONEYBADGER_REVISION,
    projectRoot: "webpack://_N_E/./",
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Ampion Monitor</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
