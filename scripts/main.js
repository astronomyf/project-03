const card = document.getElementById("wrapper");
const contenitore = document.getElementById("contenuto-lista");
const footer = document.getElementById("footer");
const live = document.getElementById("live");

card.addEventListener('click', () => {
  
  if(card.style.height == "auto"){
    
    card.style.height = 520 + "px";
    contenitore.style.maxHeight = 200+ "px";

    card.style.display = "grid";
    contenitore.style.display = "grid";
    footer.style.display = "grid";
    live.style.display = "grid";
  }else{
    card.style.height = "auto";
    contenitore.style.display = "none";
    footer.style.display = "none";
    live.style.display = "none";
  }
});