import { createRoot } from 'react-dom/client';
import Main from "./Main";
import "./index.css";
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript


root.render(<Main />);