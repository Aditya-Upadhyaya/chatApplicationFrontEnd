
import { useState } from 'react';
import PageWrapper from './components/PageWrapper';


function App() {

  const [page, setPage] = useState(10);

  const handleButtonClick = (num) => {
    // Update the state in response to the button click event
    setPage(num);
  };


  return (
    <div id='pageWrapper' style={{
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor:'aliceblue',
      height: '100vh',
      width:'100vw'
    }}>
      <PageWrapper page={page} handleButtonClick={handleButtonClick}></PageWrapper>
    </div>
  );
}

export default App;
