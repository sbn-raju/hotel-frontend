export default function Loader({message = "Loading..."}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      &nbsp;
      <p>{message}</p>
    </div>
  );
}
