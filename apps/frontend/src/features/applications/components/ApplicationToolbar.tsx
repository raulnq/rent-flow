import type {
  RejectApplication,
  WithdrawApplication,
  StartReviewApplication,
  ApproveApplication,
  SignContractApplication,
  ReserveApplication,
} from '#/features/applications/schemas';
import { ApplicationStartReviewAction } from './ApplicationStartReviewAction';
import { ApplicationApproveAction } from './ApplicationApproveAction';
import { ApplicationRejectAction } from './ApplicationRejectAction';
import { ApplicationWithdrawAction } from './ApplicationWithdrawAction';
import { ApplicationSignContractAction } from './ApplicationSignContractAction';
import { ApplicationReserveAction } from './ApplicationReserveAction';

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
      <ApplicationStartReviewAction
        disabled={!canStartReview}
        isPending={isPending}
        onStartReview={onStartReview}
      />
      <ApplicationApproveAction
        disabled={!canApprove}
        isPending={isPending}
        onApprove={onApprove}
      />
      <ApplicationReserveAction
        disabled={!canReserve}
        isPending={isPending}
        onReserve={onReserve}
      />
      <ApplicationRejectAction
        disabled={!canReject}
        isPending={isPending}
        onReject={onReject}
      />
      <ApplicationWithdrawAction
        disabled={!canWithdraw}
        isPending={isPending}
        onWithdraw={onWithdraw}
      />
      <ApplicationSignContractAction
        disabled={!canSignContract}
        isPending={isPending}
        onSignContract={onSignContract}
      />
    </>
  );
}
