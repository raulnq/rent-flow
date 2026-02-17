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
import { EditApplicationForm } from '../components/EditApplicationForm';
import { ApplicationSkeleton } from '../components/ApplicationSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ApplicationToolbar } from '../components/ApplicationToolbar';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { VisitsSkeleton, VisitTable } from '../../visits/components/VisitCard';
import { AddButton } from '@/features/visits/components/AddButton';
import { useAddVisit } from '@/features/visits/stores/useVisits';
import type { AddVisit } from '#/features/visits/schemas';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '../utils/status-variants';

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
        error instanceof Error ? error.message : 'Failed to save visit'
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
      <Card>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load application"
                />
              )}
            >
              <Suspense fallback={<ApplicationSkeleton />}>
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
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <FormCardFooter
          formId="form"
          saveText="Save Notes"
          cancelText="Cancel"
          onCancel={() => navigate('/applications')}
          isPending={edit.isPending}
        />
      </Card>
      <Card>
        <ListCardHeader
          title="All visits"
          description="Manage your visits."
          renderAction={<AddButton onAdd={handleAdd} />}
        />
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load visits"
                  />
                )}
              >
                <Suspense fallback={<VisitsSkeleton />}>
                  <VisitTable applicationId={applicationId!} />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
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
}: InnerApplicationProps) {
  const { data } = useApplicationSuspense(applicationId);

  return (
    <>
      <FormCardHeader
        title="Edit Application"
        description="Edit rental application details."
        renderAction={
          data.status && (
            <Badge variant={getStatusVariant(data.status)}>{data.status}</Badge>
          )
        }
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
      </FormCardHeader>
      <EditApplicationForm
        isPending={isPending}
        onSubmit={onSubmit}
        application={data}
      />
    </>
  );
}
