import './App.css';
import Customheaders from './components/Customheaders';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenieLayout from './layout/GenieLayout';


function App() {
  return (
    <div className="App">
      <Customheaders />
      <div className="container-md" style={{maxWidth:"80%"}}>
      <div className="row m-4" >
        <GenieLayout/>

      </div>
      </div>
    </div>
  );
}

export default App;
