import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export const Sidebardata = [
    {
        title:"Home",
        icon:<HomeIcon></HomeIcon>,
        link:"/dashboard"
    }
    ,
    {
        title:"Liked Songs",
        icon:<FavoriteIcon></FavoriteIcon>,
        link:"/dashboard"
    }
    ,
    {
        title:"Add Songs",
        icon:<AddIcon></AddIcon>,
        link:"/dashboard"
    }
    ,
    {
        title:"Remove Songs",
        icon:<RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>,
        link:"/login"
    }
    
]