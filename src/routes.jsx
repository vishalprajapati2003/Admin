import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    layout: Fragment,
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/signup',
    layout: Fragment,
    element: lazy(() => import('./views/auth/signup/SignUp'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/basic/tables',
        element: lazy(() => import('./views/ui-elements/basic/Tables'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: '/destinations/destination',
        element: lazy(() => import('./views/destinations/Destination'))
      },
      {
        exact: 'true',
        path: '/sightSeeing/sightSeeing',
        element: lazy(() => import('./views/sightSeeing/SightSeeing'))
      },
      {
        exact: 'true',
        path: '/hotel',
        element: lazy(() => import('./views/hotel/Hotel'))
      },
      {
        exact: 'true',
        path: '/flight',
        element: lazy(() => import('./views/flight/Flight'))
      },
      {
        exact: 'true',
        path: '/deals',
        element: lazy(() => import('./views/deals/Deals'))
      },
      {
        exact: 'true',
        path: '/booking',
        element: lazy(() => import('./views/booking/Booking'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
