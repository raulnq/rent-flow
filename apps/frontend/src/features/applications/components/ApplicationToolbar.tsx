import type {
  RejectApplication,
  WithdrawApplication,
  StartReviewApplication,
  ApproveApplication,
  SignContractApplication,
  ReserveApplication,
} from '#/features/applications/schemas';
import { StartReviewButton } from './StartReviewButton';
import { ApproveButton } from './ApproveButton';
import { RejectButton } from './RejectButton';
import { WithdrawButton } from './WithdrawButton';
import { SignContractButton } from './SignContractButton';
import { ReserveButton } from './ReserveButton';

type ApplicationToolbarProps = {
  status: string;
  isPending: boolean;
  onStartReview: (data: StartReviewApplication) => void;
  onApprove: (data: ApproveApplication) => void;
  onReject: (data: RejectApplication) => void;
  onWithdraw: (data: WithdrawApplication) => void;
  onSignContract: (data: SignContractApplication) => void;
  onReserve: (data: ReserveApplication) => void;
};

export function ApplicationToolbar({
  status,
  isPending,
  onStartReview,
  onApprove,
  onReject,
  onWithdraw,
  onSignContract,
  onReserve,
}: ApplicationToolbarProps) {
  const canStartReview = status === 'New';
  const canApprove = status === 'Under Review';
  const canReject = ['New', 'Under Review'].includes(status);
  const canWithdraw = ['New', 'Under Review', 'Approved', 'Reserved'].includes(
    status
  );
  const canSignContract = ['Approved', 'Reserved'].includes(status);
  const canReserve = status === 'Approved';

  return (
    <>
      <StartReviewButton
        disabled={!canStartReview}
        isPending={isPending}
        onStartReview={onStartReview}
      />
      <ApproveButton
        disabled={!canApprove}
        isPending={isPending}
        onApprove={onApprove}
      />
      <ReserveButton
        disabled={!canReserve}
        isPending={isPending}
        onReserve={onReserve}
      />
      <RejectButton
        disabled={!canReject}
        isPending={isPending}
        onReject={onReject}
      />
      <WithdrawButton
        disabled={!canWithdraw}
        isPending={isPending}
        onWithdraw={onWithdraw}
      />
      <SignContractButton
        disabled={!canSignContract}
        isPending={isPending}
        onSignContract={onSignContract}
      />
    </>
  );
}
