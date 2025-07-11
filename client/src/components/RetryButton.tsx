interface RetryButtonProps {
  onRetry: () => void;
  disabled?: boolean;
}
const RetryButton: React.FC<RetryButtonProps> = ({ onRetry, disabled }) => (
  <button
    className="bg-primary text-white py-1 w-36 mt-2 rounded-lg text-sm hover:opacity-70 disabled:opacity-50"
    onClick={onRetry}
    disabled={disabled}
  >
    Retry
  </button>
);

export default RetryButton;
