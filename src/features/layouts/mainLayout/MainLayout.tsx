import { Fragment, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { scrollToTop } from 'src/features/utils/functions/scrollToTop'
import { useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import Footer from './footer'
import Header from './header'
import Loader from './loader'
import SideBar from './Sidebar'
import Taptop from './TapTop'
import ThemeCustomizer from './ThemeCustomizer'
import classNames from 'classnames'
import styles from './MainLayout.module.css'
import AccountBasicProfile from 'src/features/pages/account/AccountBasicProfile'
import Links from 'src/features/pages/links'
import Settings from 'src/features/pages/settings'
import AccountChangePassword from 'src/features/pages/account/AccountChangePassword'

function MainLayout() {
  const sidebar_types = useAppSelector((state: RootState) => state.themeCustomizer.sidebar_types)
  const settings = useAppSelector((state: RootState) => state.themeCustomizer.settings)
  const settings1 = localStorage.getItem('sidebar_Settings') || settings
  const sidebar_types1 = localStorage.getItem('sidebar_types') || sidebar_types
  const location = useLocation();
  console.log(location.pathname.split('/'));
  const pageName = location.pathname.split('/').length > 2 ? location.pathname.split('/')[2] : location.pathname.split('/')[1];

  useEffect(() => {
    setTimeout(scrollToTop, 50)
  }, [location])

  const navigate = useNavigate()

  useEffect(() => {
    // This function will be called when the custom 'sessionExpired' event is triggered.
    // It receives the event object, which is a CustomEvent instance, as its argument.
    const handleSessionExpired = (event: CustomEvent) => {
      // The 'detail' property of the CustomEvent object contains the login URL.
      // We use the 'navigate' function from 'react-router' to navigate to that URL
      // without causing a full page reload.
      navigate(event.detail)
    }

    window.addEventListener('sessionExpired', handleSessionExpired as EventListener)

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired as EventListener)
    }
  }, [navigate])

  const toggleIcon = useAppSelector((state: RootState) => state.themeCustomizer.toggleIcon)

  return (
    <Fragment>
      <Loader />
      <Taptop />
      <div className={`page-wrapper ${sidebar_types1} ${settings1}`} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper horizontal-menu">
          <SideBar />
          <div
            className={classNames('page-body', styles.pageBody, {
              [styles.pageBodySidebarCollapsed]: toggleIcon,
              [styles.pageBodySidebarExpanded]: !toggleIcon,
            })}
          >
            {pageName == 'account' || pageName == 'basic-profile' ? <AccountBasicProfile/> : (pageName=='settings' ? <Settings/> : (pageName == 'change-password' ? <AccountChangePassword/> : <Links/>))}
          </div>
          <Footer />
        </div>
      </div>

      <ThemeCustomizer />

      <ToastContainer theme="light" />
    </Fragment>
  )
}

export default MainLayout
