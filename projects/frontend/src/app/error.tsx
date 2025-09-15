"use client";
const ErrorPage = ({ error }: { error?: Error }) => {
  return (
    <div className="centered" style={{ color: "red", fontSize: "2rem" }}>
      {error?.message
        ? `An error occurred: ${error.message}`
        : "Something went wrong. Please try again later."}
    </div>
  );
};

export default ErrorPage;
