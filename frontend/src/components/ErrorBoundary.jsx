import {useRouteError} from "react-router"

function ErrorBoundary() {
    const {data,status,statusText}=useRouteError()
  return (
    <div className="m-auto mr-10 ml-10 mt-50 text-center bg-red-200 text-6xl text-red-600">
        <p>{data}</p>
        <p className="mt-15">
            {status}-{statusText}
        </p>
    </div>
  )
}

export default ErrorBoundary