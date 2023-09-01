import { useState, createContext } from 'react'
import './App.css'
import { Routes } from './Components/Routing/Routes'
import { Route } from './Components/Routing/Route'
import { Navbar } from './Components/Routing/Navbar'
import { Downloads } from './Components/Pages/Downloads'
import { Playlists } from './Components/Pages/Playlists'
import { SearchSongs } from './Components/Pages/SearchSongs'
import { MusicPlayer } from './Components/MusicPlaying/MusicPlayer'
import { MusicCtxt } from './Context/MusicProvider'
import { RouterCtxt } from './Context/RouterContext'

const routePaths = ['SearchSongs', 'Playlists', 'Downloads']

export const RouterContext = createContext<RouterCtxt>({
  currentRoute: '',
  setCurrentRoute: (route: string) => {}
})

export const MusicContext = createContext<MusicCtxt>({
  songs: [],
  setSongs: (route: string[]) => {}
})

const App = () => {
  const [currentRoute,setCurrentRoute] = useState<string>(routePaths[0])
  const [songs,setSongs] = useState<string[]>([])

  return (
    <div className='app-container'>
      <MusicContext.Provider value={{songs,setSongs}}>
        <RouterContext.Provider value={{currentRoute,setCurrentRoute}}>
          <Routes className='page-component'>
            <Route path={routePaths[0]} component={<SearchSongs/>}/>
            <Route path={routePaths[1]} component={<Playlists/>}/>
            <Route path={routePaths[2]} component={<Downloads/>}/>
          </Routes>
          <Navbar className='navbar-component'/>
          <MusicPlayer className='music-player-component'/>  
        </RouterContext.Provider>
      </MusicContext.Provider>
    </div>
  )
}

export default App
