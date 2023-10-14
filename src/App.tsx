import { useState, createContext } from 'react'
import './App.css'
import { Routes } from './Components/Routing/Routes'
import { Route } from './Components/Routing/Route'
import Downloads from './Components/Pages/Downloads/Downloads'
import Playlists from './Components/Pages/Playlists/Playlists'
import Search from './Components/Pages/Search/Search'
import { MusicCtxt } from './Context/MusicContext'
import { RouterCtxt } from './Context/RouterContext'
import MusicPlayer from './Components/MusicPlaying/MusicPlayer'
import Navbar from './Components/Navbar/Navbar'

export const RouterContext = createContext<RouterCtxt>({
  currentRoute: '',
  setCurrentRoute: (route: string) => {},
})

export const MusicContext = createContext<MusicCtxt>({
  songs: [],
  setSongs: (routes: string[]) => {},
  currentSong: '',
  setCurrentSong: (currentSong: string) => {},
})

const paths = [
  'Search', 
  'Playlists', 
  'Downloads'
]

const App = () => {
  const [currentRoute,setCurrentRoute] = useState<string>(paths[0])
  const [songs,setSongs] = useState<string[]>([])
  const [currentSong,setCurrentSong] = useState<string>('')

  return (
    <div className='app-container'>
      <MusicContext.Provider value={{songs,setSongs,currentSong,setCurrentSong}}>
        <RouterContext.Provider value={{currentRoute,setCurrentRoute}}>
          <Routes className='page-component overflow-auto'>
            <Route path={paths[0]} component={<Search/>}/>
            <Route path={paths[1]} component={<Playlists/>}/>
            <Route path={paths[2]} component={<Downloads/>}/>
          </Routes>
          <Navbar className='navbar-component'/>
          <MusicPlayer className='music-player-component'/>  
        </RouterContext.Provider>
      </MusicContext.Provider>
    </div>
  )
}

export default App
