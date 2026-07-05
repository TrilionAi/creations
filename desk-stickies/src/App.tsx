import { useEffect, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import PostItView from './components/PostIt';
import ManagerView from './components/Manager';
import HubView from './components/HubView';
import './styles/glass.css';
import './styles/editor.css';

function App() {
  const [windowLabel, setWindowLabel] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentWindow = getCurrentWebviewWindow();
      setWindowLabel(currentWindow.label);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return null;

  if (windowLabel === 'manager') {
    return <ManagerView />;
  }

  if (windowLabel === 'hub') {
    return <HubView />;
  }

  // Extract post-it ID from label "postit-{id}"
  const postitId = windowLabel.replace('postit-', '');
  return <PostItView id={postitId} />;
}

export default App;
