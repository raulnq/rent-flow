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
} from '#/features/applications/schemas';
import {
  useEditApplication,
  useApplicationSuspense,
  useStartReview,
  useApprove,
  useReject,
  useWithdraw,
  useSignContract,
} from '../stores/useApplications';
import {
  EditApplicationForm,
  EditApplicationSkeleton,
  EditApplicationError,
} from '../components/EditApplicationForm';
import { ApplicationHeader } from '../components/ApplicationHeader';
import { ApplicationButtons } from '../components/ApplicationButtons';

export function EditApplicationPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const edit = useEditApplication(applicationId!);
  const startReview = useStartReview(applicationId!);
  const approve = useApprove(applicationId!);
  const reject = useReject(applicationId!);
  const withdraw = useWithdraw(applicationId!);
  const signContract = useSignContract(applicationId!);

  const workflowPending =
    startReview.isPending ||
    approve.isPending ||
    reject.isPending ||
    withdraw.isPending ||
    signContract.isPending;

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
                workflowPending={workflowPending}
                onBack={() => navigate('/applications')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
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
      >
        <ApplicationButtons
          application={data}
          workflowPending={workflowPending}
          onStartReview={onStartReview}
          onApprove={onApprove}
          onReject={onReject}
          onWithdraw={onWithdraw}
          onSignContract={onSignContract}
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
