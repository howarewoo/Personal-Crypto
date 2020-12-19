import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import { RootNavigator } from './navigators/RootNavigator';
import { green } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: green[500],
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <RootNavigator />
      </div>
    </ThemeProvider>
  )
}

export default App;
