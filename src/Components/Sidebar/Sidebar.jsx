import React from 'react';

import {Sidebardata} from "./Sidebardata"

function Sidebar({ isOpen }) {
  return (
    <div className={`Sidebar ${isOpen ? "open" : ""}`}>
      <ul className='SidebarList'>
      {Sidebardata.map((val,key)=>{
        return(
          <li className='row' onClick={()=> {window.location.pathname = val.link}}>
            <div>{val.icon}</div>
            <div>{val.title}</div>
          </li>
        )
      })}
      </ul>
    </div>
  );
}

export default Sidebar;
