interface RetryButtonProps {
  onRetry: () => void;
  disabled?: boolean;
}
const RetryButton: React.FC<RetryButtonProps> = ({ onRetry, disabled }) => (
  <button
    className="bg-primary text-white p-2 w-24 mt-2 rounded-lg hover:opacity-70 disabled:opacity-50"
    onClick={onRetry}
    disabled={disabled}
  >
    Retry
  </button>
);

export default RetryButton;
