import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, LogOut, Menu } from 'lucide-react';
import { applyTheme } from '../../theme/theme';

export const Navbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b border-[var(--color-border)] glass sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-xl relative gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* <div className="flex-1">
          <Input
            placeholder="Search hotels, owners..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery) setShowDropdown(true); }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />

          {showDropdown && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden glass z-50">
              {isSearching ? (
                <div className="p-4 text-sm text-[var(--color-text-muted)] text-center">Searching...</div>
              ) : (
                <>
                  {(searchResults.hotels?.length === 0 && searchResults.owners?.length === 0) ? (
                    <div className="p-4 text-sm text-[var(--color-text-muted)] text-center">No results found</div>
                  ) : (
                    <div className="max-h-[60vh] overflow-y-auto">
                      {searchResults.hotels && searchResults.hotels.length > 0 && (
                        <div className="p-2">
                          <h3 className="px-3 py-1 text-xs font-semibold uppercase text-[var(--color-text-muted)]">Hotels</h3>
                          {searchResults.hotels.map((hotel: any) => (
                            <Link key={`h-${hotel.id}`} to="/hotels" className="block px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-sm text-[var(--color-text)]">
                              {hotel.name} <span className="text-[var(--color-text-muted)] ml-2">{hotel.location}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.owners && searchResults.owners.length > 0 && (
                        <div className="p-2 border-t border-[var(--color-border)]">
                          <h3 className="px-3 py-1 text-xs font-semibold uppercase text-[var(--color-text-muted)]">Owners</h3>
                          {searchResults.owners.map((owner: any) => (
                            <Link key={`o-${owner.id}`} to="/owners" className="block px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-sm text-[var(--color-text)]">
                              {owner.name} <span className="text-[var(--color-text-muted)] ml-2">{owner.email}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div> */}
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {/* <button className="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors">
          <Bell className="w-5 h-5" />
        </button> */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 p-[2px] hidden md:block">
          <div className="h-full w-full rounded-full bg-[var(--color-card)] flex items-center justify-center">
            <User className="w-4 h-4 text-[var(--color-text)]" />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
