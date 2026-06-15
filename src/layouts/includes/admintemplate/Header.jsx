import { TiBusinessCard } from "react-icons/ti";

const Header = () => {
  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand navbar-dark"
        style={{ backgroundColor: "#002b57" }}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <div className="nav-link" data-widget="pushmenu" role="button">
              <i className="fas fa-bars" />
            </div>
          </li>
          {/* <li className="nav-item">
            <a href="https://appncar.sakerp.org/STC/file_dc_downloads/แบบฟอร์มใบสั่งจอง.pdf" className="nav-link font-weight-bold" target="_blank" rel="noreferrer"><i className="mr-1 fas fa-file-pdf" /> แบบฟอร์มใบสั่งจอง</a>
          </li> */}

          {/* <li className="nav-item">
            <a href="model" className="nav-link font-weight-bold" data-toggle="modal" data-target="#ManualModal"><i className="mr-1 fas fa-book" /> คู่มือการใช้งานระบบ</a>
          </li>

          <li className="nav-item">
            <a href="model" className="nav-link font-weight-bold" data-toggle="modal" data-target="#ContactModal"><i className="mr-1 fas fa-phone-square-alt" /> ติดต่อสอบถาม</a>
          </li> */}
          <li className="nav-item">
            <a
              href="/คู่มือการใช้ระบบตรวจสอบเครดิต.pdf"
              className="nav-link font-weight-bold"
              target="_blank"
            >
              <i className="mr-1 fas fa-book" />
              คู่มือการใช้งานระบบ
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/คู่มือการใช้งานระบบ สร้างใบนำส่ง.pdf"
              className="nav-link font-weight-bold"
              target="_blank"
            >
              <i className="mr-1 fas fa-book" />
              คู่มือการสร้างหนังสือนำส่ง
            </a>
          </li>

          <li className="nav-item">
            <a
              href="model"
              className="nav-link font-weight-bold"
              data-toggle="modal"
              data-target="#ContactModal"
            >
              <i className="mr-1 fas fa-phone-square-alt" />
              ติดต่อสอบถาม
            </a>
          </li>
          <li className="nav-item">
            <a
              href="model"
              className="nav-link font-weight-bold"
              data-toggle="modal"
              data-target="#ContactModal1"
            >
              <TiBusinessCard fontSize={18} /> ติดตั้งเครื่องเสียบบัตร
            </a>
          </li>
        </ul>
      </nav>
      {/* /.End Navbar */}
    </>
  );
};

export default Header;
