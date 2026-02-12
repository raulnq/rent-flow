import type {
  Application,
  RejectApplication,
  WithdrawApplication,
  StartReviewApplication,
  ApproveApplication,
  SignContractApplication,
} from '#/features/applications/schemas';
import { StartReviewButton } from './StartReviewButton';
import { ApproveButton } from './ApproveButton';
import { RejectButton } from './RejectButton';
import { WithdrawButton } from './WithdrawButton';
import { SignContractButton } from './SignContractButton';

type ApplicationButtonsProps = {
  application: Application;
  workflowPending: boolean;
  onStartReview: (data: StartReviewApplication) => void;
  onApprove: (data: ApproveApplication) => void;
  onReject: (data: RejectApplication) => void;
  onWithdraw: (data: WithdrawApplication) => void;
  onSignContract: (data: SignContractApplication) => void;
};

export function ApplicationButtons({
  application,
  workflowPending,
  onStartReview,
  onApprove,
  onReject,
  onWithdraw,
  onSignContract,
}: ApplicationButtonsProps) {
  const canStartReview = application.status === 'New';
  const canApprove = application.status === 'Under Review';
  const canReject = ['New', 'Under Review'].includes(application.status);
  const canWithdraw = ['New', 'Under Review', 'Approved'].includes(
    application.status
  );
  const canSignContract = application.status === 'Approved';

  return (
    <>
      <StartReviewButton
        disabled={workflowPending || !canStartReview}
        onStartReview={onStartReview}
      />
      <ApproveButton
        disabled={workflowPending || !canApprove}
        onApprove={onApprove}
      />
      <RejectButton
        disabled={workflowPending || !canReject}
        onReject={onReject}
      />
      <WithdrawButton
        disabled={workflowPending || !canWithdraw}
        onWithdraw={onWithdraw}
      />
      <SignContractButton
        disabled={workflowPending || !canSignContract}
        onSignContract={onSignContract}
      />
    </>
  );
}
