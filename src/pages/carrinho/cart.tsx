import Cart from "@/components/carrinho/Cart";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ProtectPage from "@/components/login/ProtectPage";

export default function PaginaCart(){
    return(
        <main>
        <ProtectPage> 
            <Header/>
            <div className="min-h-screen">
                <Cart />
            </div>
            <Footer></Footer>
        </ProtectPage>  
        </main>
    )
}