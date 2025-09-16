
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
// Create a theme instance.
const theme = extendTheme({
  appCustom: {
    appBar: {
      backgroundColor: '#FE5E7E',
      height: '76px',
    },
    boardBar: {
      backgroundColor: '#cfacb467',
      minHeight: '100vh', // ít nhất cao bằng 1 màn hình
      height: 'auto', // hoặc bỏ hẳn height
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main : '#fff'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main : '#fff'
        }
      } 
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({theme}) => {
          return {
            // color:'#fff'
          }
        },
      },
    },  
  },
});

export default theme;