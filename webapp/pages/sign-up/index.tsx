import dynamic from 'next/dynamic';

const SignUp = dynamic(() => import("../../components/features/sign-up"), {
  ssr: false,
})

const LayoutSignUp = dynamic(() => import("../layouts/sign-up-layout"), {
  ssr: false,
})

const SignUpPage = () => {
  return (
    <LayoutSignUp>
      <SignUp/>
    </LayoutSignUp>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default SignUpPage;
