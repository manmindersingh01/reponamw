import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/theme-provider';
import TodoApp from './components/TodoApp';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="simple-todo-theme">
      <div className="min-h-screen bg-background">
        <TodoApp />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
