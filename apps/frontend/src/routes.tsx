import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListClientPage } from '@/features/clients/pages/ListClientPage';
import { AddClientPage } from '@/features/clients/pages/AddClientPage';
import { ViewClientPage } from '@/features/clients/pages/ViewClientPage';
import { EditClientPage } from '@/features/clients/pages/EditClientPage';

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
    ],
  },
]);
