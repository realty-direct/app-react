import Input from "../components/Input";

export default function Signup(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up for an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <Input
              id="fname"
              label="First Name"
              type="text"
              required
              autoComplete="given-name"
            />
            <Input
              id="family-name"
              label="Last Name"
              type="text"
              required
              autoComplete="family-name"
            />
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              required
              autoComplete="new-password"
            />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
