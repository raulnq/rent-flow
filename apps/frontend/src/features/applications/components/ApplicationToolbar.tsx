import type {
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

type ApplicationToolbarProps = {
  status: string;
  isPending: boolean;
  onStartReview: (data: StartReviewApplication) => void;
  onApprove: (data: ApproveApplication) => void;
  onReject: (data: RejectApplication) => void;
  onWithdraw: (data: WithdrawApplication) => void;
  onSignContract: (data: SignContractApplication) => void;
};

export function ApplicationToolbar({
  status,
  isPending,
  onStartReview,
  onApprove,
  onReject,
  onWithdraw,
  onSignContract,
}: ApplicationToolbarProps) {
  const canStartReview = status === 'New';
  const canApprove = status === 'Under Review';
  const canReject = ['New', 'Under Review'].includes(status);
  const canWithdraw = ['New', 'Under Review', 'Approved'].includes(status);
  const canSignContract = status === 'Approved';

  return (
    <>
      <StartReviewButton
        disabled={isPending || !canStartReview}
        onStartReview={onStartReview}
      />
      <ApproveButton
        disabled={isPending || !canApprove}
        onApprove={onApprove}
      />
      <RejectButton disabled={isPending || !canReject} onReject={onReject} />
      <WithdrawButton
        disabled={isPending || !canWithdraw}
        onWithdraw={onWithdraw}
      />
      <SignContractButton
        disabled={isPending || !canSignContract}
        onSignContract={onSignContract}
      />
    </>
  );
}
