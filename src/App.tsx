import { useState, createContext } from 'react'
import { useAppSelector, useAppDispatch } from './Redux/hooks'
import './App.css'
import { Routes } from './Components/Routing/Routes'
import { Route } from './Components/Routing/Route'
import Downloads from './Components/Pages/Downloads/Downloads'
import Playlists from './Components/Pages/Playlists/Playlists'
import Search from './Components/Pages/Search/Search'
import MusicPlayer from './Components/MusicPlaying/MusicPlayer'
import Navbar from './Components/Navbar/Navbar'
import { Toaster } from "@/Components/ui/toaster"
import useToastError from './Hooks/useToastError'
import CurrentSongThumbnail from '@/Components/Navbar/CurrentSongThumbnail'

const App = () => {
  useToastError()

  return (
    <div className='app-container'>
        <Routes className='page-component'>
          <Route path='Search' component={<Search/>}/>
          <Route path='Downloads' component={<Downloads/>}/>
          <Route path='Playlists' component={<Playlists/>}/>
        </Routes>
        <CurrentSongThumbnail className='thumbnail-component'/>
        <Navbar className='navbar-component'/>
        <MusicPlayer className='music-player-component'/>
        <Toaster />  
    </div>
  )
}

export default App
