import Nav from './components/Nav';
import Main from './components/main';
import Signup from './components/signup';

function App() {
  return (
    <>
      <Nav />
      <Main>
        <Signup />
      </Main>
    </>
  );
}

export default App;
