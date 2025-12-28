import Header from './includes/Header'
import Navbar from './includes/Navbar'
import Footer from './includes/Footer'


// eslint-disable-next-line react/prop-types
const UserLayouts = ({children}) => {
  return (
    <>
      <Header/>
      <Navbar/>
        <div className="content-wrapper fadeIn">
          {children}
        </div>
      <Footer/>
    </>
    
  )
}

export default UserLayouts