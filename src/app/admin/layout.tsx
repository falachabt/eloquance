import type { Metadata } from "next";



export const metadata: Metadata = {
  title: 'Page reserver',
  description: '#vousavezlaparole 2024',  
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
        children
      
  );
}
