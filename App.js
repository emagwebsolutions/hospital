import { Provider } from 'react-redux';
import store from './components/store';
import Main from './components/Main';

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
