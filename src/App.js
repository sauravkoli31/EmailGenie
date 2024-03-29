import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import Customheaders from './components/Customheaders';
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
