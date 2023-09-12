import { useState, createContext } from 'react'
import './App.css'
import { Routes } from './Components/Routing/Routes'
import { Route } from './Components/Routing/Route'
import { Navbar } from './Components/Navbar/Navbar'
import Downloads from './Components/Pages/Downloads/Downloads'
import Playlists from './Components/Pages/Playlists/Playlists'
import Search from './Components/Pages/Search/Search'
import { MusicPlayer } from './Components/MusicPlaying/MusicPlayer'
import { MusicCtxt } from './Context/MusicProvider'
import { RouterCtxt } from './Context/RouterContext'
import { useSongLibrary } from './Hooks/useSongLibrary'

export const RouterContext = createContext<RouterCtxt>({
  currentRoute: '',
  setCurrentRoute: (route: string) => {}
})

export const MusicContext = createContext<MusicCtxt>({
  songs: [],
  setSongs: (route: string[]) => {}
})

const paths = [
  'Search', 
  'Playlists', 
  'Downloads'
]

const App = () => {
  const [currentRoute,setCurrentRoute] = useState<string>(paths[0])
  const [songs,setSongs] = useState<string[]>([])

  return (
    <div className='app-container'>
      <MusicContext.Provider value={{songs,setSongs}}>
        <RouterContext.Provider value={{currentRoute,setCurrentRoute}}>
          <Routes className='page-component'>
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
