
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

          <li className="nav-item">
            <a
              href="/SAKCreditScoring/คู่มือการใช้ระบบตรวจสอบเครดิต.pdf"
              className="nav-link font-weight-bold"
              target="_blank"
            >
              <i className="mr-1 fas fa-book" />
              คู่มือการใช้งานระบบ
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
        </ul>
      </nav>
     {/* /.End Navbar */}

     <div
  className="modal fade"
  id="ContactModal"
  tabIndex="-1"
  role="dialog"
  aria-hidden="true"
>

  
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content contact-modal">
      <div type="button" className="close" data-dismiss="modal">
        <span>&times;</span>
      </div>

      <div className="modal-body text-center">
         {/* ===== คนที่ 1 ===== */}
        <div className="contact-card">
         <i className="fas fa-headset contact-icon support"></i>

          <h6 className="contact-title">
            เจ้าหน้าที่ด้านงานตรวจสอบเครดิตลูกค้า
          </h6>

          <p className="contact-name">( เจ้าหน้าที่ NCB )</p>
          

          <div className="contact-actions">
            <a href="tel:881522" className="contact-phone">
              เบอร์ภายใน 881522
            </a>
            {/* <a href="tel:0891234567" className="contact-phone secondary">
              เบอร์ส่วนตัว 089-123-4567
            </a> */}
          </div>
        </div>


        {/* ===== คนที่ 2 ===== */}
        <div className="contact-card mt-4">
          <i className="fas fa-user-cog contact-icon"></i>

          <h6 className="contact-title">
            ฝ่ายพัฒนาระบบส่งเสริมปฏิบัติการ
          </h6>

          <p className="contact-name">คุณศริวิมล ( Admin )</p>

          <div className="contact-actions">
            <a href="tel:881511" className="contact-phone">
              เบอร์ภายใน 881511
            </a>
            {/* <a href="tel:0613561012" className="contact-phone secondary">
              เบอร์ส่วนตัว 061-356-1012
            </a> */}
          </div>
        </div>

       
      </div>
    </div>
  </div>


</div>

    </>
  );
};

export default Header;
