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

        /*let formattedInfo = `
        <div class="sessaoInfo">
            <b>CNPJ:</b> ${infos.data.cnpj}
        </div>
        <div class="sessaoInfo">
            <b>RAZÃO SOCIAL:</b> ${infos.data.razao_social}
        </div>
        <div class="sessaoInfo">
            <b>CAPITAL SOCIAL:</b> ${formatBRL(infos.data.capital_social)}
        </div>
        <div class="sessaoInfo">
            <b>TELEFONE 1:</b> ${infos.data.ddd_telefone_1}
        </div>
        <div class="sessaoInfo">
            <b>TELEFONE 2:</b> ${formatNoValue(infos.data.ddd_telefone_2)}
        </div>
        <div class="sessaoInfo">
            <b>OPÇÃO PELO MEI:</b> ${formatNoValue(infos.data.opcao_pelo_mei)}
        </div>
        <div class="sessaoInfo">
            <b>CNAEs:</b> <a href="#" onclick="showDetailCnae()"> Mais informações</a>
        </div>
        `*/
        const { logradouro, bairro, localidade, uf } = infos.data;

        if (!logradouro && !bairro && !localidade && !uf) {
            return;
        }

        setMapLocation({ logradouro, bairro, localidade, uf })
        //infosField.innerHTML = formattedInfo;
    }
}

function setMapLocation(params) {
    let mapSearch = '';

    if (params) {
        for (const key of Object.keys(params)) {
            mapSearch += `${params[key].replaceAll(" ", "+")}+`;
        }
    }

    if (!mapSearch) {
        alert('Endereço vazio')
    }

    $("#map").attr("src", `https://www.google.com/maps?q=${mapSearch}&z=20&output=embed`);
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
        return 'Sem Informação'
    }

    return value === true ? 'Sim' : value;
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
