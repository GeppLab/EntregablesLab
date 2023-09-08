document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const areaSelect = document.getElementById("areaSelect");

    loginButton.addEventListener("click", () => {
        const username = document.getElementById("usernameInput").value;
        const selectedArea = areaSelect.value;

        // Validación básica, aquí puedes agregar tu lógica de autenticación
        if (username.trim() !== "" && selectedArea !== "") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            localStorage.setItem("selectedArea", selectedArea);
            window.location.replace("app.html"); // Redirige al usuario en la misma pestaña
        } else {
            alert("Por favor, ingrese un nombre de usuario y seleccione un área.");
        }        
        
    });
});
