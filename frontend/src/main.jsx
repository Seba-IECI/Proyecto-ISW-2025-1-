import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Asamblea from '@pages/Asamblea';
import Asambleas from '@pages/AsambleaU';
import AvisosPage from "./pages/AvisosPage";
import AvisosU from "./pages/avisosU";
import Acta from '@pages/Acta';
import ActaU from '@pages/ActaU';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        )
      },
      {
        path: '/asamblea',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'directiva']}>
            <Asamblea />
          </ProtectedRoute>
        )
      },
      {
        path: '/asambleaU',
        element: (
          <ProtectedRoute allowedRoles={['usuario']}>
            <Asambleas />
          </ProtectedRoute>
        )
      },
      {
        path: '/avisos',
       element: (
          <ProtectedRoute allowedRoles={['administrador', 'directiva']}>
            <AvisosPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/avisosU',
       element: (
          <ProtectedRoute allowedRoles={['usuario']}>
            <AvisosU />
          </ProtectedRoute>
        )
      },
       {
        path: '/acta',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'directiva']}>
            <Acta />
          </ProtectedRoute>
        )
      },
      {
        path: '/actau',
        element: (
          <ProtectedRoute allowedRoles={['usuario']}>
            <ActaU />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)