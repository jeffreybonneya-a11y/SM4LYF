import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { MusicPage } from './pages/MusicPage';
import { SongDetailPage } from './pages/SongDetailPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { TimelinePage } from './pages/TimelinePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { AboutPage } from './pages/AboutPage';
import { SearchPage } from './pages/SearchPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { getCurrentAdminUser, AdminUser } from './services/auth';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return getCurrentAdminUser();
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route navigation helper
  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSong = (slug: string) => {
    navigate(`/music/${slug}`);
  };

  const handleSelectAlbum = (slug: string) => {
    navigate(`/albums/${slug}`);
  };

  // Determine current page render
  const renderRoute = () => {
    // Song Detail: /music/:slug
    if (currentPath.startsWith('/music/') && currentPath.length > 7) {
      const slug = currentPath.replace('/music/', '');
      return (
        <SongDetailPage
          slug={slug}
          onBack={() => navigate('/music')}
          onSelectSong={handleSelectSong}
          onSelectAlbum={handleSelectAlbum}
        />
      );
    }

    // Album Detail: /albums/:slug
    if (currentPath.startsWith('/albums/') && currentPath.length > 8) {
      const slug = currentPath.replace('/albums/', '');
      return (
        <AlbumDetailPage
          slug={slug}
          onBack={() => navigate('/music')}
          onSelectSong={handleSelectSong}
        />
      );
    }

    switch (currentPath) {
      case '/':
        return (
          <HomePage
            onNavigate={navigate}
            onSelectSong={handleSelectSong}
            onSelectAlbum={handleSelectAlbum}
          />
        );

      case '/music':
        return (
          <MusicPage
            onSelectSong={handleSelectSong}
            onSelectAlbum={handleSelectAlbum}
          />
        );

      case '/timeline':
        return (
          <TimelinePage
            onSelectSong={handleSelectSong}
            onSelectAlbum={handleSelectAlbum}
          />
        );

      case '/achievements':
        return <AchievementsPage />;

      case '/about':
        return <AboutPage onNavigate={navigate} />;

      case '/search':
        return (
          <SearchPage
            onSelectSong={handleSelectSong}
            onSelectAlbum={handleSelectAlbum}
            onNavigate={navigate}
          />
        );

      case '/admin/login':
        return (
          <AdminLoginPage
            onLoginSuccess={(user) => {
              setAdminUser(user);
              navigate('/admin');
            }}
            onBack={() => navigate('/')}
          />
        );

      case '/admin':
        if (!adminUser) {
          return (
            <AdminLoginPage
              onLoginSuccess={(user) => {
                setAdminUser(user);
                navigate('/admin');
              }}
              onBack={() => navigate('/')}
            />
          );
        }
        return (
          <AdminDashboardPage
            adminUser={adminUser}
            onLogout={() => {
              setAdminUser(null);
              navigate('/');
            }}
            onNavigate={navigate}
          />
        );

      default:
        return (
          <HomePage
            onNavigate={navigate}
            onSelectSong={handleSelectSong}
            onSelectAlbum={handleSelectAlbum}
          />
        );
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0706] text-[#F5EFE6] selection:bg-[#D4820A] selection:text-black">
      {/* Navigation */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {renderRoute()}
      </main>

      {/* Persistent Legal Footer */}
      {!isAdminRoute && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}

export default App;
