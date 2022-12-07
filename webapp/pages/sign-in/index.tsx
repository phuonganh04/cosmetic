import dynamic from "next/dynamic";

const SignIn = dynamic(() => import("../../components/features/sign-in"), {
  ssr: false,
})

const LayoutSignUp = dynamic(() => import("../layouts/sign-up-layout"), {
  ssr: false,
})

const SignInPage = () => {
  return (
    <LayoutSignUp>
      <SignIn/>
    </LayoutSignUp>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default SignInPage;
