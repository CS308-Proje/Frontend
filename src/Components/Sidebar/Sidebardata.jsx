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
        title:"Admin Page",
        icon: <AdminPanelSettingsIcon></AdminPanelSettingsIcon>,
        link:"/adminpage"
    }
    
]