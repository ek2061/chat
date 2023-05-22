import Skeleton from "react-loading-skeleton";

export const UserSkeleton = () => {
  return (
    <div className="flex space-x-2 p-2.5">
      <Skeleton count={1} height={40} width={40} circle={true} />
      <div>
        <Skeleton count={1} height={18} width={80} />
        <Skeleton count={1} height={14} width={100} />
      </div>
    </div>
  );
};
