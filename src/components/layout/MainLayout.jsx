import React from 'react';
import Sidebar from './Sidebar';
import SidebarLogin from './SidebarLogin';

import './MainLayout.css';

function MainLayout({children, showSidebar = true, showTabs = false, showSidebarLogin = false }) {
  return (
    <div className={"app-shell" + (showSidebar ? '' : ' no-sidebar')}>
      {showSidebarLogin ? <SidebarLogin /> : (showSidebar ? <Sidebar /> : <SidebarLogin />)}
      <div className={"main" + (showSidebar ? '' : ' no-sidebar')}>
        <main className="content">

          <div className="card-base">
            {(
              <div className="card-header">
                <h2 className="card-title"></h2>
                {showTabs && (
                  <div className="card-tabs">
                    {/* <div className="card-tab active">Ingresa</div> */}
                    {/* <div className="card-tab">Regístrate</div> */}
                  </div>
                )}
              </div>
            )}
            <div className="card-body">{children}</div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default MainLayout;
