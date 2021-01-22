import './App.css'
import Header from './components/Header'
import Input from './components/Input'

function App() {
  return (
    <div className="App">
      <Header name='ARTIST' />
      <Input /> 
      <Header name='ALBUM' />
      <Input /> 
      <Header name='SONG' />
      <Input /> 
    </div>
  )
}

export default App
