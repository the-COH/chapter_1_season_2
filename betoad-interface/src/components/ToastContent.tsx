interface ToastContentProps {
  text: string;
  hash?: string;
}

const ToastContent = ({ text, hash }: ToastContentProps) => {
  return (
    <div className="overflow-hidden">
      <div>{text}</div>
      {hash && (
        <div className="text-xs overflow-hidden text-ellipsis flex items-center">
          <span className="mr-1">tx: </span>
          <a
            className="hover:opacity-80"
            href={`https://polygonscan.com/tx/${hash.toLocaleLowerCase()}`}
            target="_blank"
          >
            {hash}
          </a>
        </div>
      )}
    </div>
  );
};

export default ToastContent;
