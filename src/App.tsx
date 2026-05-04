import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { applyTheme } from './theme/theme';

function App() {
  // Initialize theme on load
  useEffect(() => {
    applyTheme('dark'); // Default to dark mode
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
