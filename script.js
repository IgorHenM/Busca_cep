//import $ from 'jquery';
window.onkeydown = (event) => {
    if (event.keyCode === 13) {
        searchCep();
    }
}


async function searchCep() {
    let infosField = document.getElementById("info");

    if (getCep()) {

        let infos = null;
        const unFormattedCEP = getCep().replace("-", "");

        if (unFormattedCEP.length !== 8) {
            toggleErrorModal("O CEP deve possuir 8 números ou atender ao seguinte formato: 00000-000");
            return;
        }

        try {
            openLoading();
            infos = await getInformation(unFormattedCEP);
            closeLoading();
        } catch (e) {
            toggleErrorModal("Nenhuma informação para o CEP foi encontrada! Verifique se o CEP está correto e tente novamente.");
            return;
        }

        if (infos.data.erro) {
            toggleErrorModal("Erro na consulta, CEP inválido ou serviço indisponivel.");
            return;
        }

        infosField.style.display = "flex";

        let formattedInfo = createInfoStructure(infos);

       const { logradouro, bairro, localidade, uf } = infos.data;

        if (!logradouro && !bairro && !localidade && !uf) {
            return;
        }

        setMapLocation({ logradouro, bairro, localidade, uf })
        infosField.innerHTML = formattedInfo;
    }
}

function setMapLocation(params) {
    let mapSearch = '';
    let zoom = 20;

    if (!params.logradouro && !params.bairro && params.localidade && params.uf) {
        zoom = 13;
    }

    if (params) {
        for (const key of Object.keys(params)) {
            mapSearch += `${params[key].replaceAll(" ", "+")}+`;
        }
    }

    if (!mapSearch) {
        alert('Endereço vazio')
    }

    $("#map").attr("src", `https://www.google.com/maps?q=${mapSearch}&z=${zoom}&output=embed`);
}

function createInfoStructure(infos) {
    return `
    <div class="sessaoInfo">
        <b>CEP:</b> ${formatNoValue(infos.data.cep)}
    </div>
    <div class="sessaoInfo">
        <b>LOGRADOURO:</b> ${formatNoValue(infos.data.logradouro)}
    </div>
    <div class="sessaoInfo">
        <b>COMPLEMENTO:</b> ${formatNoValue(infos.data.complemento)}
    </div>
    <div class="sessaoInfo">
        <b>BAIRRO:</b> ${formatNoValue(infos.data.bairro)}
    </div>
    <div class="sessaoInfo">
        <b>LOCALIDADE:</b> ${formatNoValue(infos.data.localidade)}
    </div>
    <div class="sessaoInfo">
        <b>UF:</b> ${formatNoValue(infos.data.uf)}
    </div>
    <div class="sessaoInfo">
        <b>ESTADO:</b> ${formatNoValue(infos.data.estado)}
    </div>
    <div class="sessaoInfo">
        <b>REGIÃO:</b> ${formatNoValue(infos.data.regiao)}
    </div>
    <div class="sessaoInfo">
        <b>DDD:</b> ${formatNoValue(infos.data.ddd)}
    </div>
`
}

function getCep() {
    const cep = getInputCEP();
    return cep.value;
}

function getInputCEP() {
    return document.getElementById("cep_id");//DOM = Document Object Model 
}

async function getInformation(cep) {
    return await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
}


function formatNoValue(value) {
    if (!value) {
        return '--'
    }
    return value;
}

function toggleErrorModal(description) {

    const isModalOpened = $("#error_modal").css("display") === "block";
    const toggle = isModalOpened ? "none" : "block";

    if (description) {
        $("#error_desc").text(description);
    }

    if (toggle === "none") {
        const hasOpened = $("#error_modal").hasClass('opened');

        $("#error_modal").removeClass("opened");

        setTimeout(() => {
            $("#error_modal").css("display", toggle);
            $("#overflow").css("display", toggle);
        }, 180);

    } else {
        $("#error_modal").css("display", toggle);
        $("#overflow").css("display", toggle);

        setTimeout(() => {
            $("#error_modal").addClass("opened");
        }, 50);

    }

}

function openLoading() {
    $("#loading_content").css("display", "flex");
    $("#overflow").css("display", "block");
}

function closeLoading() {
    $("#loading_content").css("display", "none");
    $("#overflow").css("display", "none");
}
