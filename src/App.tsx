import Home from './pages/Home';
import { CommentProvider } from './contexts/CommentContext';
import GlobalCommentModal from './components/GlobalCommentModal';

function App() {
  return (
    <CommentProvider>
      <div className="App">
        <Home />
        <GlobalCommentModal />
      </div>
    </CommentProvider>
  );
}

export default App;
