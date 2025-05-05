import Footer from "@/components/Footer";
import Header from "@/components/Header";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Main Content */}
        <main className="flex-grow bg-white pb-5 pt-[0px] dark:bg-gray-dark h-full min-h-[calc(100vh-0px)] flex flex-col">
          {children}
        </main>
        {/* Footer Always at Bottom */}
        <Footer />
      </div>

    </>
  );
}


