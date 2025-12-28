

const AppTest = () => {  

  



  return (
    <>
      <div className="fadeIn">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1><i className="fas fa-paste" /> ยื่นแบบฟอร์มแจ้งรายละเอียดลูกค้า และประกันภัย</h1>
                <button
                    className="usb-access-button"
                    onClick={() => {
                      navigator.usb
                        .requestDevice({ filters: [{ vendorId: 0x2ce3, productId: 0x9563 }] })
                        .then(device => {
                          console.log(device.productName);
                          console.log(device.manufacturerName);
                          console.log('device paired', device);
                          console.log(device.vendorId, typeof device.vendorId);
                        })
                        .then(device => {
                          return device.open()
                            .then(() => device.selectConfiguration(1))
                            .then(() => device.claimInterface(0))
                            .then(() => device.transferIn(1, 64)) // Adjust the parameters as needed
                            .then(result => {
                              // ดึงข้อมูลจากการเสียบบัตรประชาชนจาก result.data
                              console.log(result.data);
                            })
                            .catch(error => {
                              console.error(error);
                            });
                        })
                        .catch(error => {
                          console.log(error);
                        });
                    }}
                  >
                    Get USB Access
                  </button>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
      </div>
    </>
  )

}

export default AppTest
