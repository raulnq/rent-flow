import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListClientPage } from '@/features/clients/pages/ListClientPage';
import { AddClientPage } from '@/features/clients/pages/AddClientPage';
import { ViewClientPage } from '@/features/clients/pages/ViewClientPage';
import { EditClientPage } from '@/features/clients/pages/EditClientPage';
import { ListPropertyPage } from '@/features/properties/pages/ListPropertyPage';
import { AddPropertyPage } from '@/features/properties/pages/AddPropertyPage';
import { ViewPropertyPage } from '@/features/properties/pages/ViewPropertyPage';
import { EditPropertyPage } from '@/features/properties/pages/EditPropertyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <div>Hello World!!</div> },
      {
        path: 'clients',
        children: [
          { index: true, element: <ListClientPage /> },
          { path: 'new', element: <AddClientPage /> },
          { path: ':clientId', element: <ViewClientPage /> },
          { path: ':clientId/edit', element: <EditClientPage /> },
        ],
      },
      {
        path: 'properties',
        children: [
          { index: true, element: <ListPropertyPage /> },
          { path: 'new', element: <AddPropertyPage /> },
          { path: ':propertyId', element: <ViewPropertyPage /> },
          { path: ':propertyId/edit', element: <EditPropertyPage /> },
        ],
      },
    ],
  },
]);
