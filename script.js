document.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.getElementById("login-link");
    const loginPopup = document.getElementById("login-popup");
    const closeLogin = document.getElementById("close-login");
    const loginButton = document.getElementById("login-button");
    const userNameInput = document.getElementById("user-name");
    const userPhoneInput = document.getElementById("user-phone");
    const welcomeMessage = document.getElementById("welcome-message");
    const tab1 = document.getElementById("tab1");
    const tab2 = document.getElementById("tab2");
    const content1 = document.getElementById("content1");
    const content2 = document.getElementById("content2");
    const searchButton = document.getElementById("search-button");
    const searchLocation = document.getElementById("search-location");
    const canoeTypes = document.querySelectorAll("#canoe-types input[type=checkbox]");
    const canoeList = document.getElementById("canoe-list");
    const confirmationPopup = document.getElementById("confirmation-popup");
    const closeConfirmation = document.getElementById("close-confirmation");
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");
    const canoeDetails = document.getElementById("canoe-details");
    const weatherForecastTable = document.getElementById("weather-forecast");
    let userPhone = "";

    loginLink.addEventListener("click", function () {
        loginPopup.style.display = "block";
    });

    closeLogin.addEventListener("click", function () {
        loginPopup.style.display = "none";
    });

    loginButton.addEventListener("click", function () {
        const userName = userNameInput.value;
        userPhone = userPhoneInput.value;

        if (userName && userPhone) {
            loginPopup.style.display = "none";
            loginLink.textContent = `Bem-vindo(a), ${userName}`;
            welcomeMessage.textContent = `Vamos pesquisar uma canoa para ${userName}`;
            tab1.click();
        }
    });

    tab1.addEventListener("click", function () {
        tab1.classList.add("active");
        tab2.classList.remove("active");
        content1.classList.add("active");
        content2.classList.remove("active");
    });

    tab2.addEventListener("click", function () {
        tab2.classList.add("active");
        tab1.classList.remove("active");
        content2.classList.add("active");
        content1.classList.remove("active");
    });

    searchButton.addEventListener("click", function () {
        const location = searchLocation.value;
        const selectedTypes = Array.from(canoeTypes)
            .filter(type => type.checked)
            .map(type => type.value);

        const searchPayload = {
            local: location,
            tipos: selectedTypes
        };

        fetch("http://localhost:5000/consultacanoas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(searchPayload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.canoas.length > 0) {
                displayCanoeList(data.canoas);
            } else {
                alert(":-( Desculpa, não encontramos nenhuma canoa com estas características");
            }
        });
    });

    function displayCanoeList(canoas) {
        canoeList.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Bairro</th>
                        <th>Referência</th>
                        <th>Município</th>
                        <th>Estado</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${canoas.map(canoa => `
                        <tr>
                            <td>${canoa.nome}</td>
                            <td>${canoa.tipo}</td>
                            <td>${canoa.bairro}</td>
                            <td>${canoa.referencia}</td>
                            <td>${canoa.municipio}</td>
                            <td>${canoa.estado}</td>
                            <td><button class="reserve-button" data-id="${canoa.id}" data-nome="${canoa.nome}">Reservar</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        addReserveButtonListeners();
    }

    function addReserveButtonListeners() {
        const reserveButtons = document.querySelectorAll(".reserve-button");
        reserveButtons.forEach(button => {
            button.addEventListener("click", function () {
                const canoeId = this.getAttribute("data-id");
                const canoeName = this.getAttribute("data-nome");
                showConfirmationPopup(canoeId, canoeName);
            });
        });
    }

    function showConfirmationPopup(canoeId, canoeName) {
        fetch(`http://localhost:5000/detalhescanoa?id=${canoeId}`)
        .then(response => response.json())
        .then(data => {
            canoeDetails.innerHTML = `
                <p><strong>Canoa Selecionada:</strong> ${canoeName}</p>
                <p><strong>Local:</strong> ${data.local.nome}</p>
                <p><strong>Bairro:</strong> ${data.local.bairro}</p>
                <p><strong>Referência:</strong> ${data.local.referencia}</p>
                <p><strong>Município:</strong> ${data.local.municipio}</p>
                <p><strong>Estado:</strong> ${data.local.estado}</p>
            `;
            // Adicionar informações de previsão do tempo aqui
            showPopup(confirmationPopup);
        });
    }

    function showPopup(popupElement) {
        popupElement.style.display = "block";
    }

    closeConfirmation.addEventListener("click", function () {
        confirmationPopup.style.display = "none";
    });

    confirmNo.addEventListener("click", function () {
        confirmationPopup.style.display = "none";
    });

    confirmYes.addEventListener("click", function () {
        // Implementar a lógica de confirmação de reserva aqui
        confirmationPopup.style.display = "none";
        alert("Reserva confirmada com sucesso!");
    });
});
