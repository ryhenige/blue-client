import { createGlobalStyle } from "styled-components";
import { COLORS } from "../ui/colors";

const GlobalStyle = createGlobalStyle`
    a {
        cursor: pointer;
        text-decoration: none;
        color: ${COLORS.link.primary};
        transition: color 0.3s ease;
        
        &:hover {
            color: ${COLORS.link.hover};
            text-decoration: underline;
        }
        
        &:visited {
            color: ${COLORS.link.visited};
        }
    }
    
`;

export default GlobalStyle;