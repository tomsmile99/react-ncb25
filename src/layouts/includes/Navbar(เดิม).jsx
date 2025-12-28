import { NavLink, useLocation } from 'react-router-dom';
// import {encryptStorage} from '../../security/EncryptStorage'

const Navbar = () => {
  let location = useLocation();

  //console.log(location.pathname)


  //document.getElementById('menu4').focus();



  return (
    <>
      <aside className="main-sidebar elevation-4 sidebar-light-teal">
        {/* Brand Logo */}
        <NavLink to="/" className="brand-link">
          <img
            src='assets/img/img_icon/logo saksiam59(150x150px).png'
            alt="Saksiam Logo"
            className="brand-image img-circle elevation-3"
          />
          <span className="brand-text" style={{fontSize: '9.5pt', fontWeight: 'bold'}}>ระบบบริหารจัดการงานประกันภัย</span>
        </NavLink>
        {/* Sidebar */}
        <div className="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition">
          <div className="os-resize-observer-host observed">
            <div
              className="os-resize-observer"
              style={{ left: 0, right: "auto" }}
            />
          </div>
          <div
            className="os-size-auto-observer observed"
            style={{ height: "calc(100% + 1px)", float: "left" }}
          >
            <div className="os-resize-observer" />
          </div>
          <div
            className="os-content-glue"
            style={{ margin: "0px -8px", width: 249, height: 155 }}
          />
          <div className="os-padding">
            <div
              className="os-viewport os-viewport-native-scrollbars-invisible"
              style={{ overflowY: "scroll" }}
            >
              <div
                className="os-content"
                style={{ padding: "0px 8px", height: "100%", width: "100%" }}
              >
                {/* Sidebar user panel (optional) */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                  <div className="image">
                    <img
                      src='assets/img/user_icon(40x40).png'
                      alt="User Image"
                      className="img-circle elevation-2"
                    />
                  </div>
                  <div className="info">
                    <span style={{fontSize: 14, fontWeight: 'bold'}} className="d-block">คุณทดสอบ ระบบ</span>
                  </div>
                </div>
                
                {/* Sidebar Menu */}
                <nav className="mt-2">
                  <ul
                    className="nav nav-pills nav-sidebar flex-column"
                    data-widget="treeview"
                    role="menu"
                    data-accordion="false"
                  >
                    <li className="nav-item">
                      {/* <a className="nav-link" href="http://localhost:8080/systemApp/dashboard"> */}
                      <a className="nav-link" href="https://appncar.sakerp.org/systemApp/dashboard">
                        <i className="nav-icon fas fa-arrow-left"></i>
                        <p>กลับหน้าหลัก</p>
                      </a>
                    </li>
                    <li className="nav-header">เมนูการจัดการ</li>


                    {/* <li className={`${location.pathname === '/' || location.pathname === '/AppTest2' ? 'menu-open' : ''} nav-item`}>
                      <a href="#" className={`${location.pathname === '/' || location.pathname === '/AppTest2' ? 'active' : ''} nav-link`}>
                        <i className="nav-icon fas fa-tachometer-alt" />
                        <p>
                          ยื่นแบบฟอร์มฯ
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                      <ul className="nav nav-treeview" style={{display: location.pathname === '/' || location.pathname === '/AppTest2' ? 'block' : 'none'}}>
                        <li className="nav-item">
                          <NavLink to="/" className={`${location.pathname === '/' ? 'active' : ''} nav-link`}>
                            <i className="fas fa-angle-right nav-icon" />
                            <p>แบบฟอร์มที่ 1</p>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/AppTest2" className={`${location.pathname === '/AppTest2' ? 'active' : ''} nav-link`}>
                          <i className="fas fa-angle-right nav-icon" />
                            <p>แบบฟอร์มที่ 2</p>
                          </NavLink>
                        </li>
                      </ul>
                    </li> */}

                    <li className="nav-item">
                      <NavLink to="/" className={`${location.pathname === '/' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ 1</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest2" className={`${location.pathname === '/AppTest2' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ 2</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>


                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>


                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>


                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>


                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>
                    <li className="nav-item" tabIndex="1">
                      <NavLink to="/AppTest3" className={`${location.pathname === '/AppTest3' ? 'active focused' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ 3</p>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/AppTest4" className={`${location.pathname === '/AppTest4' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li>

                    {/* <li className="nav-item ">
                      <NavLink to="/" className={`${location.pathname === '/' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-paste" />
                        <p>ยื่นแบบฟอร์มฯ</p>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/Orthers" className={`${location.pathname === '/Orthers' ? 'active' : ''} nav-link click-text`}>
                        <i className="nav-icon fas fa-clipboard-list" />
                        <p>แจ้งเลขที่ใบเสร็จ</p>
                      </NavLink>
                    </li> */}

                  </ul>
                </nav>
                {/* /.sidebar-menu */}
              </div>
            </div>
          </div>
          <div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable os-scrollbar-auto-hidden">
            <div className="os-scrollbar-track">
              <div
                className="os-scrollbar-handle"
                style={{ width: "100%", transform: "translate(0px, 0px)" }}
              />
            </div>
          </div>
          <div className="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden">
            <div className="os-scrollbar-track">
              <div
                className="os-scrollbar-handle"
                style={{ height: "15.7544%", transform: "translate(0px, 0px)" }}
              />
            </div>
          </div>
          <div className="os-scrollbar-corner" />
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  )
}

export default Navbar