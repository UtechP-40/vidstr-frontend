import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/theme.context'
import { Provider } from 'react-redux'
import store from './redux/store';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
)
