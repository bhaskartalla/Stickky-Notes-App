import NotesPage from './pages/NotesPage'
import Saving from './components/Saving'
import NotesProvider from './context/NotesProvider'
// import AuthenticationPage from './pages/AuthenticationPage'

function App() {
  return (
    <NotesProvider>
      <div id='header'>
        <Saving />
      </div>
      <NotesPage />
      {/* <AuthenticationPage /> */}
    </NotesProvider>
  )
}

export default App
