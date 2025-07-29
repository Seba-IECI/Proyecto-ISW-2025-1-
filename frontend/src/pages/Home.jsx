import "../styles/Form.css";


const Home = () => {
  return (
    <div className="form-container" style={{ maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 32 }}>
      <h1 style={{fontSize:"3rem" ,textAlign: "center", color: "#2d3a4b", marginBottom: 16 }}>Bienvenido al software de condominio</h1>
      <p style={{marginTop:"3rem", fontSize: 18, color: "#444", marginBottom: 24 }}>
        Aquí podrás mantenerte informado sobre las novedades, avisos y actividades de tu condominio. Accede fácilmente a los avisos publicados, consulta documentos importantes y entérate de las próximas asambleas o eventos.
      </p>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <img 
          src="https://mnk.cl/admin/archivos/imagenes/proyectos/xmUwLhDKtiyZSqMuLxVX.jpg" 
          alt="Condominio Sur - Vista exterior" 
          style={{ 
            maxWidth: "100%", 
            height: "auto", 
            borderRadius: "8px", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
          }} 
        /></div> 
    </div>
  );
};

export default Home;