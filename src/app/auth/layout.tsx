const AuthLayout = ({ 
    children
  }: { 
    children: React.ReactNode
  }) => {
    return ( 
      <main className="flex h-full flex-col justify-center items-center">
        {children}
      </main>
     );
  }
   
export default AuthLayout;