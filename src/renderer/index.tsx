import { render } from "react-dom";
import App from "./App";

render(<App />, document.getElementById("root"));



window.ChatraSetup = {
  zIndex: 9999,
  
  colors: {
    buttonText: "#FFFFFF",
    buttonBg: "#FA6F15",
  },
  

  get chatHeight() {
 
    const windowHeight = window.innerHeight;
    return Math.max(200, windowHeight * 0.75);  
  }
};


function updateChatraHeight() {
  const chatraIframe = document.querySelector('.chatra--iframe');
  if (chatraIframe) {
    chatraIframe.style.height = `${window.ChatraSetup.chatHeight}px`;
  }
}


window.addEventListener('resize', updateChatraHeight);


window.addEventListener('DOMContentLoaded', () => {
  updateChatraHeight();
});


(function (d, w, c) {
  w.ChatraID = "kzQzfDagyXR78mcF3";
  var s = d.createElement("script");
  w[c] =
    w[c] ||
    function () {
      (w[c].q = w[c].q || []).push(arguments);
    };
  s.async = true;
  s.src = "https://call.chatra.io/chatra.js";
  if (d.head) d.head.appendChild(s);
})(document, window, "Chatra");
