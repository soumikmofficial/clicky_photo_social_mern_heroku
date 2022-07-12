import { Puff } from "react-loader-spinner";

interface IProps {
  message: string;
  textClass?: string;
}

const Spinner: React.FC<IProps> = ({ message, textClass }) => {
  return (
    <div className="h-full w-full flex items-center justify-center gap-3 flex-col">
      <Puff color="#eb7c74" height={80} width={80} />
      <p className={`text-sm ${textClass ? textClass : "text-gray-500"}`}>
        {message}
      </p>
    </div>
  );
};

export default Spinner;
