import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Inter", "Satoshi", sans-serif', // Use Inter as fallback for POC
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 5 } } },
    MuiAvatar: { styleOverrides: { rounded: { borderRadius: 5 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});
