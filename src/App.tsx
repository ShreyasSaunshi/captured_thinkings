import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PoemProvider } from './context/PoemContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import PoemPage from './pages/public/PoemPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/admin/LoginPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import UploadPoemPage from './pages/admin/UploadPoemPage';
import EditPoemPage from './pages/admin/EditPoemPage';
import ManagePoemsPage from './pages/admin/ManagePoemsPage';

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <PoemProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="poem/:id" element={<PoemPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              
              {/* Authentication Route */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin Routes (Protected) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="upload" element={<UploadPoemPage />} />
                <Route path="edit/:id" element={<EditPoemPage />} />
                <Route path="manage" element={<ManagePoemsPage />} />
              </Route>
              
              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PoemProvider>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;