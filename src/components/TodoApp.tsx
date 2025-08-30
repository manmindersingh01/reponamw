import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from './theme-provider';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type FilterType = 'all' | 'active' | 'completed';

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') {
      toast({
        title: "Can't add empty todo",
        description: "Please enter some text for your todo.",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false
    };
    
    setTodos([...todos, newItem]);
    setNewTodo('');
    toast({
      title: "Todo added",
      description: "Your new task has been added.",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Todo deleted",
      description: "Your task has been removed.",
    });
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') {
      toast({
        title: "Can't save empty todo",
        description: "Please enter some text or delete the todo instead.",
        variant: "destructive"
      });
      return;
    }
    
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
    toast({
      title: "Todo updated",
      description: "Your task has been updated.",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    toast({
      title: "Completed todos cleared",
      description: "All completed tasks have been removed.",
    });
  };

  return (
    <div className="todo-container neumorphic-card">
      <div className="app-header">
        <h1 className="app-title">Simple Todo</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="settings-button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="settings-button">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={clearCompleted}>
                Clear completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="input-container">
        <Input
          type="text"
          className="todo-input"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <Button className="add-button" onClick={addTodo}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="filter-container">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'filter-button-active' : 'filter-button'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'}
          className={filter === 'active' ? 'filter-button-active' : 'filter-button'}
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'}
          className={filter === 'completed' ? 'filter-button-active' : 'filter-button'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {filter === 'all' ? 'No todos yet. Add one above!' : 
             filter === 'active' ? 'No active todos!' : 'No completed todos!'}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="todo-item group">
              <Checkbox 
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              
              {editingId === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                </div>
              ) : (
                <label 
                  htmlFor={`todo-${todo.id}`}
                  className={`todo-text ${todo.completed ? 'todo-completed' : ''} cursor-pointer`}
                  onDoubleClick={() => !todo.completed && startEditing(todo)}
                >
                  {todo.text}
                </label>
              )}
              
              {editingId !== todo.id && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="delete-button opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="todo-stats">
        <p>{activeTodosCount} active, {completedTodosCount} completed</p>
      </div>
    </div>
  );
};

export default TodoApp;
