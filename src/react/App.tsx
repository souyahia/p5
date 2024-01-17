import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Layout, SketchViewer } from './pages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/sketch/:id' element={<SketchViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
