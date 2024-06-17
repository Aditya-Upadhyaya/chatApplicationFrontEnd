
import { useState } from 'react';
import PageWrapper from './components/PageWrapper';


function App() {

  const [page, setPage] = useState(0);

  const handleButtonClick = (num) => {
    // Update the state in response to the button click event
    setPage(num);
    console.log("button Clicked",page);
  };


  return (<>
    
    <PageWrapper page={page} handleButtonClick={handleButtonClick}></PageWrapper>
    </>
  );
}

export default App;
