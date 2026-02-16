import { useNavigate, useParams } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  EditApplication,
  RejectApplication,
  WithdrawApplication,
  StartReviewApplication,
  ApproveApplication,
  SignContractApplication,
  ReserveApplication,
} from '#/features/applications/schemas';
import {
  useEditApplication,
  useApplicationSuspense,
  useStartReview,
  useApprove,
  useReject,
  useWithdraw,
  useSignContract,
  useReserve,
} from '../stores/useApplications';
import {
  EditApplicationForm,
  EditApplicationSkeleton,
  EditApplicationError,
} from '../components/EditApplicationForm';
import { ApplicationHeader } from '../components/ApplicationHeader';
import { ApplicationToolbar } from '../components/ApplicationToolbar';
import {
  VisitsError,
  VisitsSkeleton,
  VisitTable,
} from '../../visits/components/VisitCard';
import { AddButton } from '@/features/visits/components/AddButton';
import { useAddVisit } from '@/features/visits/stores/useVisits';
import type { AddVisit } from '#/features/visits/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EditApplicationPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const edit = useEditApplication(applicationId!);
  const startReview = useStartReview(applicationId!);
  const approve = useApprove(applicationId!);
  const reject = useReject(applicationId!);
  const withdraw = useWithdraw(applicationId!);
  const signContract = useSignContract(applicationId!);
  const reserve = useReserve(applicationId!);
  const addMutation = useAddVisit(applicationId!);

  const workflowPending =
    startReview.isPending ||
    approve.isPending ||
    reject.isPending ||
    withdraw.isPending ||
    signContract.isPending ||
    reserve.isPending;

  const handleAdd = async (data: AddVisit) => {
    try {
      await addMutation.mutateAsync(data);
      toast.success('Visit added successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add visit'
      );
    }
  };

  const onSubmit: SubmitHandler<EditApplication> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Application updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save application'
      );
    }
  };

  const handleStartReview = async (data: StartReviewApplication) => {
    try {
      await startReview.mutateAsync(data);
      toast.success('Review started successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to start review'
      );
    }
  };

  const handleApprove = async (data: ApproveApplication) => {
    try {
      await approve.mutateAsync(data);
      toast.success('Application approved successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to approve application'
      );
    }
  };

  const handleReject = async (data: RejectApplication) => {
    try {
      await reject.mutateAsync(data);
      toast.success('Application rejected successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reject application'
      );
    }
  };

  const handleWithdraw = async (data: WithdrawApplication) => {
    try {
      await withdraw.mutateAsync(data);
      toast.success('Application withdrawn successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to withdraw application'
      );
    }
  };

  const handleSignContract = async (data: SignContractApplication) => {
    try {
      await signContract.mutateAsync(data);
      toast.success('Contract signed successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to sign contract'
      );
    }
  };

  const handleReserve = async (data: ReserveApplication) => {
    try {
      await reserve.mutateAsync(data);
      toast.success('Application reserved successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reserve application'
      );
    }
  };

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={EditApplicationError}
          >
            <Suspense fallback={<EditApplicationSkeleton />}>
              <InnerApplication
                isPending={edit.isPending}
                onSubmit={onSubmit}
                applicationId={applicationId!}
                onStartReview={handleStartReview}
                onApprove={handleApprove}
                onReject={handleReject}
                onWithdraw={handleWithdraw}
                onSignContract={handleSignContract}
                onReserve={handleReserve}
                workflowPending={workflowPending}
                onBack={() => navigate('/applications')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Visits</h2>
            <p className="text-sm text-muted-foreground">Manage your visits.</p>
          </div>
          <AddButton onAdd={handleAdd} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All visits</CardTitle>
          </CardHeader>
          <CardContent>
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary onReset={reset} FallbackComponent={VisitsError}>
                  <Suspense fallback={<VisitsSkeleton />}>
                    <VisitTable applicationId={applicationId!} />
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </CardContent>
        </Card>
      </>
    </div>
  );
}

type InnerApplicationProps = {
  applicationId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditApplication>;
  onStartReview: (data: StartReviewApplication) => void;
  onApprove: (data: ApproveApplication) => void;
  onReject: (data: RejectApplication) => void;
  onWithdraw: (data: WithdrawApplication) => void;
  onSignContract: (data: SignContractApplication) => void;
  onReserve: (data: ReserveApplication) => void;
  workflowPending: boolean;
  onBack: () => void;
};

function InnerApplication({
  isPending,
  onSubmit,
  applicationId,
  onStartReview,
  onApprove,
  onReject,
  onWithdraw,
  onSignContract,
  onReserve,
  workflowPending,
  onBack,
}: InnerApplicationProps) {
  const { data } = useApplicationSuspense(applicationId);

  return (
    <>
      <ApplicationHeader
        onBack={onBack}
        title="Edit Application"
        description="Edit rental application details."
        status={data.status}
      >
        <ApplicationToolbar
          status={data.status}
          isPending={workflowPending}
          onStartReview={onStartReview}
          onApprove={onApprove}
          onReject={onReject}
          onWithdraw={onWithdraw}
          onSignContract={onSignContract}
          onReserve={onReserve}
        />
      </ApplicationHeader>
      <EditApplicationForm
        isPending={isPending}
        onSubmit={onSubmit}
        application={data}
      />
    </>
  );
}
