// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ModuleList from './ModuleList';
import ModuleCalendar from './ModuleCalendar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModuleList />} />
        <Route path="/modules/:id" element={<ModuleCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}