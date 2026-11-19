import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CabinetPage, HomePage, NotFoundPage, ServicesPage, SiteLayout, TeamPage } from './Site';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/soins" element={<ServicesPage />} />
          <Route path="/equipe" element={<TeamPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
