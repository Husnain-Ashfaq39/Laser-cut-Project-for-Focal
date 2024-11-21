import { useNavigate } from 'react-router-dom';

const AuthSuccessPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-black">
      <div className="relative p-10 bg-white rounded-xl shadow-lg w-full max-w-lg transform hover:scale-105 transition-transform duration-500 ease-in-out">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl text-black font-bold text-center mb-6">
            You have successfully Authenticated
          </h1>
        </div>
        <p className="text-center text-gray-700 mb-8">
          Access and Refresh Token has been Successfully Created
        </p>
        <div className="text-center">
          <button
            onClick={goHome}
            className="px-6 py-3 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-300 ease-in-out"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
