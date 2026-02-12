import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListClientPage } from '@/features/clients/pages/ListClientPage';
import { AddClientPage } from '@/features/clients/pages/AddClientPage';
import { ViewClientPage } from '@/features/clients/pages/ViewClientPage';
import { EditClientPage } from '@/features/clients/pages/EditClientPage';
import { ListLeadPage } from '@/features/leads/pages/ListLeadPage';
import { AddLeadPage } from '@/features/leads/pages/AddLeadPage';
import { ViewLeadPage } from '@/features/leads/pages/ViewLeadPage';
import { EditLeadPage } from '@/features/leads/pages/EditLeadPage';
import { ListPropertyPage } from '@/features/properties/pages/ListPropertyPage';
import { AddPropertyPage } from '@/features/properties/pages/AddPropertyPage';
import { ViewPropertyPage } from '@/features/properties/pages/ViewPropertyPage';
import { EditPropertyPage } from '@/features/properties/pages/EditPropertyPage';
import { ListApplicationPage } from '@/features/applications/pages/ListApplicationPage';
import { AddApplicationPage } from '@/features/applications/pages/AddApplicationPage';
import { EditApplicationPage } from '@/features/applications/pages/EditApplicationPage';

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
        path: 'leads',
        children: [
          { index: true, element: <ListLeadPage /> },
          { path: 'new', element: <AddLeadPage /> },
          { path: ':leadId', element: <ViewLeadPage /> },
          { path: ':leadId/edit', element: <EditLeadPage /> },
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
      {
        path: 'applications',
        children: [
          { index: true, element: <ListApplicationPage /> },
          { path: 'new', element: <AddApplicationPage /> },
          { path: ':applicationId/edit', element: <EditApplicationPage /> },
        ],
      },
    ],
  },
]);
