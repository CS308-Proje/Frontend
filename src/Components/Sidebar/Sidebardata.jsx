import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import ArtistIcon from '@mui/icons-material/SpatialAudioOff';
import AlbumIcon from '@mui/icons-material/LibraryMusic';
import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import DownloadIcon from '@mui/icons-material/Download';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export const Sidebardata = [
    {
        title:"Home",
        icon:<HomeIcon></HomeIcon>,
        link:"/dashboard"
    }
    ,
    {
        title:"Add Songs",
        icon:<AddIcon></AddIcon>,
        link:"/addsongs"
    }
    ,
    {
        title:"My Songs",
        icon:<FavoriteIcon></FavoriteIcon>,
        link:"/songs"
    }
    ,
    {
        title:"My Albums",
        icon:<AlbumIcon></AlbumIcon>,
        link:"/albums"
    }
    ,
    {
        title:"My Artists",
        icon:<ArtistIcon></ArtistIcon>,
        link:"/artists"
    }
    ,
    {
        title:"Recommendations",
        icon:<PlaylistAddCircleIcon></PlaylistAddCircleIcon>,
        link:"/recommendations"
    }
    ,
    {
        title:"Analysis",
        icon:<InsertChartIcon></InsertChartIcon>,
        link:"/analysis"
    }
    ,
    {
        title:"Export Songs",
        icon:<DownloadIcon></DownloadIcon>,
        link:"/export"
    }
    ,
    {
        title:"Admin User Page",
        icon: <AdminPanelSettingsIcon></AdminPanelSettingsIcon>,
        link:"/adminpage",
        adminOnly: true 
    }
    ,
    {
        title:"Admin Song Page",
        icon: <MusicNoteIcon></MusicNoteIcon>,
        link:"/adminsongpage",
        adminOnly: true
    }
]