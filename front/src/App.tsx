import './App.css';
import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-dark">
      <div className="w-full max-w-md p-6">
        <RegistrationForm />
      </div>
    </div>
  );
}

export default App;
