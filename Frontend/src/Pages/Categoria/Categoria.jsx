import React from "react";
import { Link } from 'react-router-dom';
import Header from '../../Components/header/header.jsx'; 
import CategoriesBar from '../../Components/categoriesBar/categoriesBar.jsx';
import Footer from '../../Components/footer/footer.jsx'; 
import "./Categoria.css";

function Categoria() {
   return (
      <div>
         <Header />  
         <CategoriesBar /> 
         <div>
         <h1>PANTALLA DE CATEGORIAS</h1>
         </div>
         <Footer />  
      </div>
   );
}

export default Categoria;
