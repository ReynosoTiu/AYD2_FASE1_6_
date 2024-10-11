function HomeConductor() {
  const codigo = localStorage.getItem("userId");
  return <p>BIENVENIDO CONDUCTOR con codigo: {codigo}</p>;
}

export default HomeConductor;
